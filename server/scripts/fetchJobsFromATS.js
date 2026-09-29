#!/usr/bin/env node
/**
 * NCR LaunchMap — ATS Job Ingestion Script
 * =========================================
 * Fetches jobs from public Greenhouse, Lever, and Ashby APIs,
 * geocodes locations, detects founder/startup hiring signals,
 * and upserts results into MongoDB.
 *
 * Usage:
 *   node scripts/fetchJobsFromATS.js
 *
 * Environment variables required (.env in /server):
 *   MONGO_URI — MongoDB connection string
 *
 * COMPLIANCE NOTE:
 *   This script only calls publicly documented, rate-limit-friendly
 *   endpoints. We do NOT scrape HTML pages or call private APIs.
 *   Providers:
 *     Greenhouse: https://developers.greenhouse.io/job-board.html
 *     Lever:      https://hire.lever.co/developer/postings
 *     Ashby:      https://developers.ashbyhq.com/reference/jobboard
 *
 * Rate limiting: 500ms delay between each company fetch to be polite.
 */

'use strict';

require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const axios = require('axios');
const mongoose = require('mongoose');
const Job = require('../src/models/Job');
const Startup = require('../src/models/Startup');
const { COMPANIES } = require('../src/data/companiesList');
const cityCoords = require('../src/data/cityCoords.json');

// ─── Constants ────────────────────────────────────────────────────────────────

const NCR_CENTER = { lat: 28.5274, lng: 77.1785 }; // fallback coords
const REQUEST_TIMEOUT_MS = 10_000;
const POLITE_DELAY_MS = 500; // wait between company fetches (ToS compliance)

// NCR location detection patterns
const GURUGRAM_PATTERNS = [
  'gurugram', 'gurgaon', 'dlf', 'cyber city', 'udyog vihar',
  'sohna', 'manesar', 'haryana', 'cyber hub', 'golf course',
  'sector 32', 'sector 44', 'sector 18 gur',
];
const NOIDA_PATTERNS = [
  'noida', 'greater noida', 'sector 62', 'sector 126', 'sector 132',
  'sector 18 noida', 'sector 125', 'sector 5 noida', 'expressway',
  'knowledge park', 'tech zone',
];
const DELHI_PATTERNS = [
  'new delhi', 'delhi', 'connaught', 'saket', 'nehru place', 'okhla',
  'vasant kunj', 'south delhi', 'dwarka', 'janakpuri', 'lajpat',
];

// Keywords that signal founder / early-stage hiring
const FOUNDER_KEYWORDS = [
  'founding engineer', 'founding member', 'founding team',
  'first engineer', 'first hire', 'first 10', 'first 20',
  "founder's office", "founder office", 'foundermode',
  'early team', 'early employee', 'early stage',
  '0-1', '0 to 1', 'zero to one',
  'startup', 'pre-seed', 'seed stage', 'build from scratch',
  'staff #1', 'employee #1',
];

// Skill extraction patterns
const SKILL_RULES = [
  [/react|frontend|front-end|next\.?js/i, ['React', 'TypeScript', 'Tailwind CSS', 'Next.js']],
  [/android|kotlin/i, ['Kotlin', 'Android NDK', 'Jetpack Compose']],
  [/ios|swift/i, ['Swift', 'iOS SDK', 'UIKit']],
  [/backend|back-end|golang|go\b/i, ['Golang', 'Distributed Systems', 'Redis']],
  [/java\b|spring/i, ['Java', 'Spring Boot', 'Microservices', 'Kafka']],
  [/python|django|fastapi/i, ['Python', 'FastAPI', 'PostgreSQL']],
  [/machine learning|ai engineer|llm|nlp/i, ['PyTorch', 'LLMs', 'Transformers', 'Vector DB']],
  [/data science|data analyst/i, ['Python', 'SQL', 'Pandas', 'Predictive Modeling']],
  [/devops|sre|cloud|infrastructure/i, ['Kubernetes', 'Docker', 'AWS', 'Terraform']],
  [/product manager|pm\b/i, ['Product Strategy', 'Roadmapping', 'Agile', 'Metrics']],
  [/ui\/ux|product designer|designer/i, ['Figma', 'UX Research', 'Design Systems']],
  [/security|infosec/i, ['Cloud Security', 'VAPT', 'Penetration Testing']],
  [/qa|automation|test engineer/i, ['Selenium', 'Cypress', 'Playwright', 'API Testing']],
  [/mern|node\.?js/i, ['MongoDB', 'Express', 'React', 'Node.js']],
];

// ─── Utility Helpers ──────────────────────────────────────────────────────────

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Detect NCR city from a raw location string.
 * Returns { matches: true, city: 'Gurugram' | 'Noida' | 'Delhi' } or { matches: false }.
 */
function detectNcrCity(locationText = '') {
  const loc = locationText.toLowerCase();
  for (const p of GURUGRAM_PATTERNS) {
    if (loc.includes(p)) return { matches: true, city: 'Gurugram' };
  }
  for (const p of NOIDA_PATTERNS) {
    if (loc.includes(p)) return { matches: true, city: 'Noida' };
  }
  for (const p of DELHI_PATTERNS) {
    if (loc.includes(p)) return { matches: true, city: 'Delhi' };
  }
  return { matches: false };
}

/**
 * Geocode a location string → { lat, lng }.
 *
 * Strategy:
 * 1. Try exact / partial match against local cityCoords.json (zero network cost).
 * 2. Fall back to Nominatim (free OSM geocoder, no API key needed).
 *    — Rate limit: max 1 req/sec per Nominatim ToS.
 * 3. If all fails, use company's known coordinates.
 */
async function geocode(locationText, companyLat, companyLng) {
  if (!locationText) return { lat: companyLat, lng: companyLng };

  const normalized = locationText.toLowerCase().trim();

  // 1. Local map lookup (longest substring match wins)
  let bestMatch = null;
  let bestMatchLen = 0;
  for (const [key, coords] of Object.entries(cityCoords)) {
    if (normalized.includes(key) && key.length > bestMatchLen) {
      bestMatch = coords;
      bestMatchLen = key.length;
    }
  }
  if (bestMatch) {
    return { lat: bestMatch[0], lng: bestMatch[1] };
  }

  // 2. Nominatim free geocoder (respect 1 req/sec ToS limit)
  try {
    const query = encodeURIComponent(`${locationText}, NCR, India`);
    const url = `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1&countrycodes=in`;
    const res = await axios.get(url, {
      timeout: REQUEST_TIMEOUT_MS,
      headers: { 'User-Agent': 'NCRLaunchMap/1.0 (ncr-launchmap@example.com)' },
    });
    if (res.data && res.data.length > 0) {
      return {
        lat: parseFloat(res.data[0].lat),
        lng: parseFloat(res.data[0].lon),
      };
    }
  } catch (err) {
    // Nominatim unavailable — use company coords as fallback
  }

  // 3. Company coords fallback
  return { lat: companyLat, lng: companyLng };
}

/**
 * Extract tags/skills from a job title + department string.
 */
function extractTags(title, department = '') {
  const combined = `${title} ${department}`;
  for (const [regex, tags] of SKILL_RULES) {
    if (regex.test(combined)) return tags;
  }
  return ['Engineering', 'Problem Solving'];
}

/**
 * Detect work mode from title + location text.
 */
function detectWorkMode(text = '') {
  const t = text.toLowerCase();
  if (t.includes('remote') || t.includes('work from home') || t.includes('wfh')) return 'Remote';
  if (t.includes('hybrid')) return 'Hybrid';
  return 'Onsite';
}

/**
 * Detect experience level from title.
 */
function detectExperienceLevel(title = '') {
  if (/principal|director|head of|vp\b|architect|staff/i.test(title)) return 'Lead';
  if (/senior|sr\.|sr\b/i.test(title)) return 'Senior';
  if (/junior|jr\.|intern|graduate|entry|associate/i.test(title)) return 'Entry';
  return 'Mid';
}

/**
 * Detect employment type.
 */
function detectEmploymentType(text = '') {
  const t = text.toLowerCase();
  if (t.includes('intern')) return 'Internship';
  if (t.includes('contract') || t.includes('freelance')) return 'Contract';
  if (t.includes('part-time') || t.includes('part time')) return 'Part-time';
  return 'Full-time';
}

/**
 * Check if a job is founder / early-stage hiring.
 */
function isFounderHiring(title = '', description = '') {
  const combined = `${title} ${description}`.toLowerCase();
  return FOUNDER_KEYWORDS.some((kw) => combined.includes(kw));
}

// ─── ATS API Fetchers ─────────────────────────────────────────────────────────

/**
 * Fetch from Greenhouse public boards API.
 * Endpoint: GET /v1/boards/{jobBoard}/jobs?content=true
 *
 * COMPLIANCE: Public, documented endpoint. No auth required.
 * ToS: https://greenhouse.io/terms-of-service
 */
async function fetchGreenhouseJobs(company) {
  const url = `https://boards-api.greenhouse.io/v1/boards/${company.jobBoard}/jobs?content=true`;
  const res = await axios.get(url, { timeout: REQUEST_TIMEOUT_MS });
  const rawJobs = res.data.jobs || [];

  const parsed = [];
  for (const r of rawJobs) {
    const locText = r.location?.name || '';
    const ncrCheck = detectNcrCity(locText);
    if (!ncrCheck.matches) continue; // skip non-NCR jobs

    const city = ncrCheck.city;
    const dept = r.departments?.[0]?.name || '';
    const { lat, lng } = await geocode(locText, company.lat, company.lng);
    await sleep(1100); // respect Nominatim 1 req/sec

    const descText = r.content ? r.content.replace(/<[^>]+>/g, ' ') : '';

    parsed.push({
      jobId: `gh-${company.jobBoard}-${r.id}`,
      source: 'greenhouse',
      title: r.title,
      company: company.name,
      description: descText.slice(0, 2000),
      employmentType: 'Full-time',
      locationText: locText,
      city,
      state: city === 'Gurugram' ? 'Haryana' : 'Uttar Pradesh',
      country: 'India',
      location: { type: 'Point', coordinates: [lng, lat] }, // GeoJSON [lng, lat]
      tags: extractTags(r.title, dept),
      applyUrl: r.absolute_url || company.careersUrl,
      postedAt: r.updated_at ? new Date(r.updated_at) : new Date(),
      remote: detectWorkMode(locText) === 'Remote',
      isActive: true,
      founderHiring: isFounderHiring(r.title, descText),
      experienceLevel: detectExperienceLevel(r.title),
    });
  }
  return parsed;
}

/**
 * Fetch from Lever public postings API.
 * Endpoint: GET /v0/postings/{company}?mode=json
 *
 * COMPLIANCE: Public, documented endpoint. No auth required.
 * ToS: https://www.lever.co/terms-of-use
 */
async function fetchLeverJobs(company) {
  const url = `https://api.lever.co/v0/postings/${company.jobBoard}?mode=json`;
  const res = await axios.get(url, { timeout: REQUEST_TIMEOUT_MS });
  const rawJobs = Array.isArray(res.data) ? res.data : [];

  const parsed = [];
  for (const r of rawJobs) {
    const locStr = [
      r.categories?.location || '',
      ...(r.categories?.allLocations || []),
    ].join(' ');

    const ncrCheck = detectNcrCity(locStr);
    if (!ncrCheck.matches) continue;

    const city = ncrCheck.city;
    const team = r.categories?.team || '';
    const { lat, lng } = await geocode(locStr, company.lat, company.lng);
    await sleep(1100);

    const descText = r.description ? r.description.replace(/<[^>]+>/g, ' ') : '';

    parsed.push({
      jobId: `lv-${company.jobBoard}-${r.id}`,
      source: 'lever',
      title: r.text,
      company: company.name,
      description: descText.slice(0, 2000),
      employmentType: detectEmploymentType(r.categories?.commitment || ''),
      locationText: locStr,
      city,
      state: city === 'Gurugram' ? 'Haryana' : 'Uttar Pradesh',
      country: 'India',
      location: { type: 'Point', coordinates: [lng, lat] },
      tags: extractTags(r.text, team),
      applyUrl: r.hostedUrl || company.careersUrl,
      postedAt: r.createdAt ? new Date(Number(r.createdAt)) : new Date(),
      remote: r.workplaceType === 'remote',
      isActive: true,
      founderHiring: isFounderHiring(r.text, descText),
      experienceLevel: detectExperienceLevel(r.text),
    });
  }
  return parsed;
}

/**
 * Fetch from Ashby public job board API.
 * Endpoint: GET /posting-api/job-board/{organizationSlug}
 *
 * COMPLIANCE: Public, documented endpoint. No auth required.
 * ToS: https://www.ashbyhq.com/legal/terms-of-service
 */
async function fetchAshbyJobs(company) {
  const url = `https://api.ashbyhq.com/posting-api/job-board/${company.jobBoard}`;
  const res = await axios.get(url, { timeout: REQUEST_TIMEOUT_MS });
  const rawJobs = res.data.jobPostings || [];

  const parsed = [];
  for (const r of rawJobs) {
    const locText = r.locationName || '';
    const ncrCheck = detectNcrCity(locText);
    if (!ncrCheck.matches) continue;

    const city = ncrCheck.city;
    const dept = r.departmentName || '';
    const { lat, lng } = await geocode(locText, company.lat, company.lng);
    await sleep(1100);

    const descText = r.descriptionPlain || r.description?.replace(/<[^>]+>/g, ' ') || '';

    parsed.push({
      jobId: `as-${company.jobBoard}-${r.id}`,
      source: 'ashby',
      title: r.title,
      company: company.name,
      description: descText.slice(0, 2000),
      employmentType: detectEmploymentType(r.employmentType || ''),
      locationText: locText,
      city,
      state: city === 'Gurugram' ? 'Haryana' : 'Uttar Pradesh',
      country: 'India',
      location: { type: 'Point', coordinates: [lng, lat] },
      tags: extractTags(r.title, dept),
      applyUrl: r.jobPostingUrl || company.careersUrl,
      postedAt: r.publishedDate ? new Date(r.publishedDate) : new Date(),
      remote: r.isRemote || false,
      isActive: true,
      founderHiring: isFounderHiring(r.title, descText),
      experienceLevel: detectExperienceLevel(r.title),
    });
  }
  return parsed;
}

// ─── Upsert to MongoDB ────────────────────────────────────────────────────────

/**
 * Upsert a list of parsed job objects into MongoDB.
 * Uses { source, jobId } as the unique key.
 */
async function upsertJobs(jobs) {
  let upserted = 0;
  let errors = 0;

  for (const job of jobs) {
    try {
      await Job.findOneAndUpdate(
        { source: job.source, jobId: job.jobId },
        { $set: job },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      upserted++;
    } catch (err) {
      errors++;
      console.error(`  ✗ Failed to upsert ${job.jobId}: ${err.message}`);
    }
  }

  return { upserted, errors };
}

/**
 * Update the Startup.isHiring flag based on whether they have active jobs.
 */
async function syncStartupHiringFlags() {
  // Get all companies that currently have active jobs
  const hiringCompanies = await Job.distinct('company', { isActive: true });
  const hiringSet = new Set(hiringCompanies.map((c) => c.toLowerCase()));

  const startups = await Startup.find({});
  let updated = 0;
  for (const startup of startups) {
    const shouldBeHiring = hiringSet.has(startup.name.toLowerCase());
    if (startup.isHiring !== shouldBeHiring) {
      startup.isHiring = shouldBeHiring;
      await startup.save();
      updated++;
    }
  }
  return updated;
}

// ─── Main Entry Point ─────────────────────────────────────────────────────────

async function main() {
  console.log('\n🚀 NCR LaunchMap — ATS Ingestion Script');
  console.log('━'.repeat(50));
  console.log(`⏰ Started at: ${new Date().toISOString()}`);

  // Connect to MongoDB
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/ncr_launchmap';
  console.log(`📦 Connecting to MongoDB: ${mongoUri}`);
  await mongoose.connect(mongoUri);
  console.log('✅ MongoDB connected\n');

  const totalStats = { fetched: 0, upserted: 0, errors: 0 };

  for (const company of COMPANIES) {
    console.log(`\n▶ Fetching: ${company.name} (${company.ats.toUpperCase()})`);

    try {
      let jobs = [];

      if (company.ats === 'greenhouse') {
        jobs = await fetchGreenhouseJobs(company);
      } else if (company.ats === 'lever') {
        jobs = await fetchLeverJobs(company);
      } else if (company.ats === 'ashby') {
        jobs = await fetchAshbyJobs(company);
      }

      console.log(`  📋 NCR jobs found: ${jobs.length}`);

      if (jobs.length > 0) {
        const { upserted, errors } = await upsertJobs(jobs);
        totalStats.fetched += jobs.length;
        totalStats.upserted += upserted;
        totalStats.errors += errors;
        console.log(`  ✅ Upserted: ${upserted}  Errors: ${errors}`);
      }

      // Polite delay between companies (ToS compliance)
      await sleep(POLITE_DELAY_MS);
    } catch (err) {
      console.error(`  ✗ Error fetching ${company.name}: ${err.message}`);
      totalStats.errors++;
    }
  }

  // Sync startup hiring flags
  console.log('\n🔄 Syncing startup isHiring flags...');
  const flagsUpdated = await syncStartupHiringFlags();
  console.log(`  ✅ Updated ${flagsUpdated} startup hiring flags`);

  // Summary
  console.log('\n' + '━'.repeat(50));
  console.log('📊 Ingestion Summary:');
  console.log(`  NCR jobs fetched : ${totalStats.fetched}`);
  console.log(`  Jobs upserted    : ${totalStats.upserted}`);
  console.log(`  Errors           : ${totalStats.errors}`);
  console.log(`  Completed at     : ${new Date().toISOString()}`);
  console.log('━'.repeat(50) + '\n');

  await mongoose.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
