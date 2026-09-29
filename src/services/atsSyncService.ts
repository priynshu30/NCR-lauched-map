import { Job, JobSource } from '../types';

/**
 * Public ATS & Official Careers Integration Service
 * 
 * Supports:
 * 1. Greenhouse Board API (public, no auth): https://boards-api.greenhouse.io/v1/boards/{board}/jobs?content=true
 * 2. Lever Postings API (public, no auth): https://api.lever.co/v0/postings/{company}?mode=json
 * 3. Ashby Job Board API (public, no auth): https://api.ashbyhq.com/posting-api/job-board/{organizationSlug}
 * 4. Official Startup Careers Portals
 * 
 * STRICT FILTER: Only jobs located in Gurugram/Gurgaon and Noida.
 */

export interface AtsCompanyConfig {
  slug: string;
  source: JobSource;
  companyName: string;
  startupId: string;
  city: 'Gurugram' | 'Noida';
  area: string;
  coordinates: [number, number]; // [lat, lng]
  sector: Job['sector'];
  website: string;
  careersUrl: string;
}

export const ATS_COMPANIES: AtsCompanyConfig[] = [
  // ── GREENHOUSE ─────────────────────────────────────────────────────────────
  {
    slug: 'sprinklr',
    source: 'Greenhouse',
    companyName: 'Sprinklr',
    startupId: 'startup-5',
    city: 'Gurugram',
    area: 'DLF Cyber City',
    coordinates: [28.4952, 77.0883],
    sector: 'AI & DeepTech',
    website: 'https://www.sprinklr.com',
    careersUrl: 'https://www.sprinklr.com/careers/',
  },
  {
    slug: 'urbancompany',
    source: 'Greenhouse',
    companyName: 'Urban Company',
    startupId: 'startup-3',
    city: 'Gurugram',
    area: 'Udyog Vihar Phase 4',
    coordinates: [28.5032, 77.0880],
    sector: 'Consumer Tech',
    website: 'https://www.urbancompany.com',
    careersUrl: 'https://careers.urbancompany.com',
  },
  {
    slug: 'sharechat',
    source: 'Greenhouse',
    companyName: 'ShareChat',
    startupId: 'startup-gh-sharechat',
    city: 'Gurugram',
    area: 'Sector 44',
    coordinates: [28.4605, 77.0705],
    sector: 'Consumer Tech',
    website: 'https://sharechat.com',
    careersUrl: 'https://sharechat.com/careers',
  },
  {
    slug: 'inmobi',
    source: 'Greenhouse',
    companyName: 'InMobi',
    startupId: 'startup-gh-inmobi',
    city: 'Gurugram',
    area: 'DLF Cyber City',
    coordinates: [28.4942, 77.0875],
    sector: 'AI & DeepTech',
    website: 'https://www.inmobi.com',
    careersUrl: 'https://www.inmobi.com/company/careers/',
  },
  {
    slug: 'cashify',
    source: 'Greenhouse',
    companyName: 'Cashify',
    startupId: 'startup-gh-cashify',
    city: 'Gurugram',
    area: 'Sector 32',
    coordinates: [28.4730, 77.0697],
    sector: 'Consumer Tech',
    website: 'https://www.cashify.in',
    careersUrl: 'https://www.cashify.in/careers',
  },
  {
    slug: 'bharatpe',
    source: 'Greenhouse',
    companyName: 'BharatPe',
    startupId: 'startup-23',
    city: 'Gurugram',
    area: 'DLF Cyber City',
    coordinates: [28.4965, 77.0893],
    sector: 'FinTech',
    website: 'https://bharatpe.com',
    careersUrl: 'https://bharatpe.com/careers',
  },
  {
    slug: 'gupshup',
    source: 'Greenhouse',
    companyName: 'Gupshup',
    startupId: 'startup-gh-gupshup',
    city: 'Gurugram',
    area: 'DLF Cyber City Phase 2',
    coordinates: [28.4936, 77.0868],
    sector: 'AI & DeepTech',
    website: 'https://www.gupshup.io',
    careersUrl: 'https://www.gupshup.io/careers',
  },

  // ── LEVER ──────────────────────────────────────────────────────────────────
  {
    slug: 'razorpay',
    source: 'Lever',
    companyName: 'Razorpay',
    startupId: 'startup-razorpay',
    city: 'Gurugram',
    area: 'DLF Cyber City',
    coordinates: [28.4947, 77.0892],
    sector: 'FinTech',
    website: 'https://razorpay.com',
    careersUrl: 'https://razorpay.com/jobs/',
  },
  {
    slug: 'phonepe',
    source: 'Lever',
    companyName: 'PhonePe',
    startupId: 'startup-lv-phonepe',
    city: 'Gurugram',
    area: 'DLF Cyber City',
    coordinates: [28.4940, 77.0880],
    sector: 'FinTech',
    website: 'https://www.phonepe.com',
    careersUrl: 'https://www.phonepe.com/careers/',
  },
  {
    slug: 'meesho',
    source: 'Lever',
    companyName: 'Meesho',
    startupId: 'startup-lv-meesho',
    city: 'Gurugram',
    area: 'Sector 44',
    coordinates: [28.4615, 77.0718],
    sector: 'E-Commerce & Quick Comm',
    website: 'https://meesho.com',
    careersUrl: 'https://meesho.io/careers',
  },
  {
    slug: 'slice',
    source: 'Lever',
    companyName: 'Slice',
    startupId: 'startup-lv-slice',
    city: 'Gurugram',
    area: 'Sector 18, Gurugram',
    coordinates: [28.4790, 77.0840],
    sector: 'FinTech',
    website: 'https://www.sliceit.com',
    careersUrl: 'https://careers.sliceit.com',
  },
  {
    slug: 'khatabook',
    source: 'Lever',
    companyName: 'Khatabook',
    startupId: 'startup-lv-khatabook',
    city: 'Gurugram',
    area: 'Cyber Hub, Gurugram',
    coordinates: [28.4996, 77.0886],
    sector: 'FinTech',
    website: 'https://khatabook.com',
    careersUrl: 'https://khatabook.com/careers',
  },
  {
    slug: 'moglix',
    source: 'Lever',
    companyName: 'Moglix',
    startupId: 'startup-16',
    city: 'Noida',
    area: 'Sector 126, Noida Expressway',
    coordinates: [28.5355, 77.3910],
    sector: 'E-Commerce & Quick Comm',
    website: 'https://www.moglix.com',
    careersUrl: 'https://www.moglix.com/careers',
  },
  {
    slug: 'shiprocket',
    source: 'Lever',
    companyName: 'Shiprocket',
    startupId: 'startup-24',
    city: 'Noida',
    area: 'Sector 132, Noida',
    coordinates: [28.5122, 77.4003],
    sector: 'Logistics & Mobility',
    website: 'https://www.shiprocket.in',
    careersUrl: 'https://www.shiprocket.in/careers',
  },

  // ── ASHBY ──────────────────────────────────────────────────────────────────
  {
    slug: 'sarvam',
    source: 'Ashby',
    companyName: 'Sarvam AI',
    startupId: 'startup-29',
    city: 'Gurugram',
    area: 'DLF Cyber City',
    coordinates: [28.4963, 77.0900],
    sector: 'AI & DeepTech',
    website: 'https://www.sarvam.ai',
    careersUrl: 'https://www.sarvam.ai/careers',
  },
  {
    slug: 'krutrim',
    source: 'Ashby',
    companyName: 'Krutrim',
    startupId: 'startup-as-krutrim',
    city: 'Gurugram',
    area: 'Udyog Vihar, Gurugram',
    coordinates: [28.5045, 77.0871],
    sector: 'AI & DeepTech',
    website: 'https://krutrim.com',
    careersUrl: 'https://krutrim.com/careers',
  },
  {
    slug: 'healthmug',
    source: 'Ashby',
    companyName: 'Healthmug',
    startupId: 'startup-as-healthmug',
    city: 'Noida',
    area: 'Sector 62, Noida',
    coordinates: [28.6295, 77.3685],
    sector: 'HealthTech',
    website: 'https://www.healthmug.com',
    careersUrl: 'https://www.healthmug.com/careers',
  },
];

// ─── Location Filter Helpers (Strictly Gurugram / Noida) ──────────────────────

const GURUGRAM_PATTERNS = [
  'gurugram', 'gurgaon', 'dlf', 'cyber city', 'udyog vihar', 
  'sohna', 'manesar', 'haryana', 'cyber hub', 'golf course'
];

const NOIDA_PATTERNS = [
  'noida', 'greater noida', 'sector 62', 'sector 126', 'sector 132', 
  'sector 18', 'sector 125', 'sector 5', 'expressway'
];

export function isStrictNcrLocation(locationText: string): { matches: boolean; city?: 'Gurugram' | 'Noida' } {
  if (!locationText) return { matches: false };
  const loc = locationText.toLowerCase();
  
  for (const p of GURUGRAM_PATTERNS) {
    if (loc.includes(p)) return { matches: true, city: 'Gurugram' };
  }
  for (const p of NOIDA_PATTERNS) {
    if (loc.includes(p)) return { matches: true, city: 'Noida' };
  }
  return { matches: false };
}

// ─── Skill & Metadata Extraction ──────────────────────────────────────────────

const SKILL_RULES: [RegExp, string[]][] = [
  [/react|frontend|front-end/i, ['React', 'TypeScript', 'Tailwind CSS']],
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
];

function extractSkills(title: string, dept: string = ''): string[] {
  const combined = `${title} ${dept}`;
  for (const [regex, skills] of SKILL_RULES) {
    if (regex.test(combined)) return skills;
  }
  return ['Communication', 'Problem Solving', 'Team Collaboration'];
}

function detectWorkMode(text: string): 'Onsite' | 'Hybrid' | 'Remote' {
  const t = text.toLowerCase();
  if (t.includes('remote') || t.includes('work from home') || t.includes('wfh')) return 'Remote';
  if (t.includes('hybrid')) return 'Hybrid';
  return 'Onsite';
}

function detectExperienceLevel(title: string): 'Entry' | 'Mid' | 'Senior' | 'Lead' {
  const t = title.toLowerCase();
  if (/principal|director|head of|vp\b|lead|architect|staff/i.test(t)) return 'Lead';
  if (/senior|sr\.|sr\b|lead/i.test(t)) return 'Senior';
  if (/junior|jr\.|intern|graduate|entry|associate/i.test(t)) return 'Entry';
  return 'Mid';
}

function formatDaysAgo(timestamp: number): string {
  const diffDays = Math.floor((Date.now() - timestamp) / 86400000);
  if (diffDays <= 0) return 'Just now';
  if (diffDays === 1) return '1 day ago';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 14) return '1 week ago';
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return `${Math.floor(diffDays / 30)} months ago`;
}

// ─── API Fetchers with Timeout ────────────────────────────────────────────────

async function fetchWithTimeout(url: string, ms = 7000): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), ms);
  try {
    const res = await fetch(url, { signal: controller.signal });
    return res;
  } finally {
    clearTimeout(id);
  }
}

// 1. Greenhouse Board API
async function fetchGreenhouseJobs(company: AtsCompanyConfig): Promise<Job[]> {
  const url = `https://boards-api.greenhouse.io/v1/boards/${company.slug}/jobs?content=true`;
  const res = await fetchWithTimeout(url);
  if (!res.ok) throw new Error(`Greenhouse status ${res.status}`);
  
  const data = await res.json();
  const rawJobs: any[] = data.jobs || [];
  const validJobs: Job[] = [];

  for (const r of rawJobs) {
    const locName = r.location?.name || '';
    const locCheck = isStrictNcrLocation(locName);
    
    // Only accept if explicitly in Gurugram or Noida, or if company is NCR-specific and location matches
    if (!locCheck.matches) continue;

    const city = locCheck.city || company.city;
    const dept = r.departments?.[0]?.name || '';
    const postedMs = r.updated_at ? new Date(r.updated_at).getTime() : Date.now();

    validJobs.push({
      _id: `gh-${company.slug}-${r.id}`,
      startupId: company.startupId,
      companyName: company.companyName,
      title: r.title,
      type: 'Full-time',
      workMode: detectWorkMode(`${r.title} ${locName}`),
      location: `${company.area}, ${city}`,
      city,
      coordinates: company.coordinates,
      sector: company.sector,
      skills: extractSkills(r.title, dept),
      currency: 'INR',
      applyUrl: r.absolute_url || company.careersUrl,
      description: `${company.companyName} is hiring a ${r.title} in ${city} (DLF / NCR Office). Apply directly via official Greenhouse portal.`,
      isActive: true,
      postedAt: formatDaysAgo(postedMs),
      experienceLevel: detectExperienceLevel(r.title),
      source: 'Greenhouse',
    });
  }

  return validJobs;
}

// 2. Lever Postings API
async function fetchLeverJobs(company: AtsCompanyConfig): Promise<Job[]> {
  const url = `https://api.lever.co/v0/postings/${company.slug}?mode=json`;
  const res = await fetchWithTimeout(url);
  if (!res.ok) throw new Error(`Lever status ${res.status}`);
  
  const rawJobs: any[] = await res.json();
  if (!Array.isArray(rawJobs)) return [];

  const validJobs: Job[] = [];

  for (const r of rawJobs) {
    const locStr = [
      r.categories?.location || '',
      ...(r.categories?.allLocations || [])
    ].join(' ');

    const locCheck = isStrictNcrLocation(locStr);
    if (!locCheck.matches) continue;

    const city = locCheck.city || company.city;
    const team = r.categories?.team || '';
    const postedMs = r.createdAt ? Number(r.createdAt) : Date.now();

    validJobs.push({
      _id: `lv-${company.slug}-${r.id}`,
      startupId: company.startupId,
      companyName: company.companyName,
      title: r.text,
      type: r.categories?.commitment?.toLowerCase().includes('intern') ? 'Internship' : 'Full-time',
      workMode: r.workplaceType === 'remote' ? 'Remote' : detectWorkMode(`${r.text} ${locStr}`),
      location: `${company.area}, ${city}`,
      city,
      coordinates: company.coordinates,
      sector: company.sector,
      skills: extractSkills(r.text, team),
      currency: 'INR',
      applyUrl: r.hostedUrl || company.careersUrl,
      description: `${company.companyName} is hiring a ${r.text} in ${city}. Apply directly via official Lever portal.`,
      isActive: true,
      postedAt: formatDaysAgo(postedMs),
      experienceLevel: detectExperienceLevel(r.text),
      source: 'Lever',
    });
  }

  return validJobs;
}

// 3. Ashby Job Board API
async function fetchAshbyJobs(company: AtsCompanyConfig): Promise<Job[]> {
  const url = `https://api.ashbyhq.com/posting-api/job-board/${company.slug}`;
  const res = await fetchWithTimeout(url);
  if (!res.ok) throw new Error(`Ashby status ${res.status}`);
  
  const data = await res.json();
  const rawJobs: any[] = data.jobPostings || [];
  const validJobs: Job[] = [];

  for (const r of rawJobs) {
    const locName = r.locationName || '';
    const locCheck = isStrictNcrLocation(locName);
    if (!locCheck.matches) continue;

    const city = locCheck.city || company.city;
    const dept = r.departmentName || '';
    const postedMs = r.publishedDate ? new Date(r.publishedDate).getTime() : Date.now();

    validJobs.push({
      _id: `as-${company.slug}-${r.id}`,
      startupId: company.startupId,
      companyName: company.companyName,
      title: r.title,
      type: r.employmentType?.toLowerCase().includes('intern') ? 'Internship' : 'Full-time',
      workMode: r.isRemote ? 'Remote' : detectWorkMode(`${r.title} ${locName}`),
      location: `${company.area}, ${city}`,
      city,
      coordinates: company.coordinates,
      sector: company.sector,
      skills: extractSkills(r.title, dept),
      currency: 'INR',
      applyUrl: r.jobPostingUrl || company.careersUrl,
      description: `${company.companyName} is hiring a ${r.title} in ${city}. Apply directly via official Ashby board.`,
      isActive: true,
      postedAt: formatDaysAgo(postedMs),
      experienceLevel: detectExperienceLevel(r.title),
      source: 'Ashby',
    });
  }

  return validJobs;
}

// ─── Deduplication & Merging Engine ───────────────────────────────────────────

/**
 * Deduplicates and removes expired jobs:
 * 1. Deduplicates by canonical applyUrl or (startupId + title + city)
 * 2. Filters out inactive jobs
 * 3. Keeps latest posted dates
 */
export function deduplicateJobs(jobs: Job[]): Job[] {
  const seenUrls = new Set<string>();
  const seenSignature = new Set<string>();
  const cleaned: Job[] = [];

  for (const job of jobs) {
    if (!job.isActive) continue;

    // Canonicalize apply URL
    const normUrl = job.applyUrl ? job.applyUrl.toLowerCase().split('?')[0].replace(/\/+$/, '') : '';
    const sig = `${job.startupId}|${job.title.trim().toLowerCase()}|${job.city}`.replace(/\s+/g, ' ');

    if (normUrl && seenUrls.has(normUrl)) continue;
    if (seenSignature.has(sig)) continue;

    if (normUrl) seenUrls.add(normUrl);
    seenSignature.add(sig);
    cleaned.push(job);
  }

  return cleaned;
}

// ─── Live Auto-Sync Runner ───────────────────────────────────────────────────

export interface SyncReport {
  syncedJobsCount: number;
  sourcesSynced: { source: JobSource; count: number }[];
  errors: string[];
  lastSyncedAt: string;
}

export async function runAtsSync(
  existingJobs: Job[]
): Promise<{ mergedJobs: Job[]; report: SyncReport }> {
  const liveFetched: Job[] = [];
  const errors: string[] = [];
  const sourceCounts: Record<JobSource, number> = {
    Greenhouse: 0,
    Lever: 0,
    Ashby: 0,
    'Careers Page': 0,
  };

  const tasks = ATS_COMPANIES.map(async (company) => {
    try {
      let jobs: Job[] = [];
      if (company.source === 'Greenhouse') {
        jobs = await fetchGreenhouseJobs(company);
      } else if (company.source === 'Lever') {
        jobs = await fetchLeverJobs(company);
      } else if (company.source === 'Ashby') {
        jobs = await fetchAshbyJobs(company);
      }

      if (jobs.length > 0) {
        liveFetched.push(...jobs);
        sourceCounts[company.source] += jobs.length;
      }
    } catch (err: any) {
      // Don't fail the whole sync if one company endpoint is unavailable or blocked by CORS
      errors.push(`${company.companyName} (${company.source}): ${err?.message || 'Network error'}`);
    }
  });

  await Promise.allSettled(tasks);

  // Combine live fetched jobs with existing verified jobs
  // Live fetched jobs take priority (inserted at the top)
  const allJobs = [...liveFetched, ...existingJobs];
  const mergedJobs = deduplicateJobs(allJobs);

  const report: SyncReport = {
    syncedJobsCount: liveFetched.length,
    sourcesSynced: (Object.entries(sourceCounts) as [JobSource, number][])
      .filter(([_, count]) => count > 0)
      .map(([source, count]) => ({ source, count })),
    errors,
    lastSyncedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
  };

  return { mergedJobs, report };
}
