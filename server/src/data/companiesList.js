/**
 * NCR LaunchMap — ATS Company Registry
 *
 * Add / remove companies here to control which job boards are scraped.
 * Each entry maps to a public ATS API endpoint that requires no auth key.
 *
 * Supported ATS types:
 *  - "greenhouse"  → https://boards-api.greenhouse.io/v1/boards/{jobBoard}/jobs?content=true
 *  - "lever"       → https://api.lever.co/v0/postings/{jobBoard}?mode=json
 *  - "ashby"       → https://api.ashbyhq.com/posting-api/job-board/{jobBoard}
 *
 * IMPORTANT: Only use PUBLIC, documented endpoints. Respect each provider's ToS.
 * Do NOT attempt to scrape or reverse-engineer private API endpoints.
 *
 * NCR filter: only jobs whose locationText matches Gurugram/Noida/Delhi patterns
 * will be saved; others are silently discarded by the ingestion script.
 */

'use strict';

const COMPANIES = [
  // ── GREENHOUSE ──────────────────────────────────────────────────────────────
  // Public API docs: https://developers.greenhouse.io/job-board.html
  {
    name: 'Sprinklr',
    ats: 'greenhouse',
    jobBoard: 'sprinklr',
    city: 'Gurugram',
    area: 'DLF Cyber City',
    lat: 28.4952,
    lng: 77.0883,
    sector: 'AI & DeepTech',
    website: 'https://www.sprinklr.com',
    careersUrl: 'https://www.sprinklr.com/careers/',
  },
  {
    name: 'Urban Company',
    ats: 'greenhouse',
    jobBoard: 'urbancompany',
    city: 'Gurugram',
    area: 'Udyog Vihar Phase 4',
    lat: 28.5032,
    lng: 77.0880,
    sector: 'Consumer Tech',
    website: 'https://www.urbancompany.com',
    careersUrl: 'https://careers.urbancompany.com',
  },
  {
    name: 'ShareChat',
    ats: 'greenhouse',
    jobBoard: 'sharechat',
    city: 'Gurugram',
    area: 'Sector 44',
    lat: 28.4605,
    lng: 77.0705,
    sector: 'Consumer Tech',
    website: 'https://sharechat.com',
    careersUrl: 'https://sharechat.com/careers',
  },
  {
    name: 'InMobi',
    ats: 'greenhouse',
    jobBoard: 'inmobi',
    city: 'Gurugram',
    area: 'DLF Cyber City',
    lat: 28.4942,
    lng: 77.0875,
    sector: 'AI & DeepTech',
    website: 'https://www.inmobi.com',
    careersUrl: 'https://www.inmobi.com/company/careers/',
  },
  {
    name: 'Cashify',
    ats: 'greenhouse',
    jobBoard: 'cashify',
    city: 'Gurugram',
    area: 'Sector 32',
    lat: 28.4730,
    lng: 77.0697,
    sector: 'Consumer Tech',
    website: 'https://www.cashify.in',
    careersUrl: 'https://www.cashify.in/careers',
  },
  {
    name: 'BharatPe',
    ats: 'greenhouse',
    jobBoard: 'bharatpe',
    city: 'Gurugram',
    area: 'DLF Cyber City',
    lat: 28.4965,
    lng: 77.0893,
    sector: 'FinTech',
    website: 'https://bharatpe.com',
    careersUrl: 'https://bharatpe.com/careers',
  },
  {
    name: 'Gupshup',
    ats: 'greenhouse',
    jobBoard: 'gupshup',
    city: 'Gurugram',
    area: 'DLF Cyber City Phase 2',
    lat: 28.4936,
    lng: 77.0868,
    sector: 'AI & DeepTech',
    website: 'https://www.gupshup.io',
    careersUrl: 'https://www.gupshup.io/careers',
  },

  // ── LEVER ───────────────────────────────────────────────────────────────────
  // Public API docs: https://hire.lever.co/developer/postings
  {
    name: 'Razorpay',
    ats: 'lever',
    jobBoard: 'razorpay',
    city: 'Gurugram',
    area: 'DLF Cyber City',
    lat: 28.4947,
    lng: 77.0892,
    sector: 'FinTech',
    website: 'https://razorpay.com',
    careersUrl: 'https://razorpay.com/jobs/',
  },
  {
    name: 'PhonePe',
    ats: 'lever',
    jobBoard: 'phonepe',
    city: 'Gurugram',
    area: 'DLF Cyber City',
    lat: 28.4940,
    lng: 77.0880,
    sector: 'FinTech',
    website: 'https://www.phonepe.com',
    careersUrl: 'https://www.phonepe.com/careers/',
  },
  {
    name: 'Meesho',
    ats: 'lever',
    jobBoard: 'meesho',
    city: 'Gurugram',
    area: 'Sector 44',
    lat: 28.4615,
    lng: 77.0718,
    sector: 'E-Commerce & Quick Comm',
    website: 'https://meesho.com',
    careersUrl: 'https://meesho.io/careers',
  },
  {
    name: 'Moglix',
    ats: 'lever',
    jobBoard: 'moglix',
    city: 'Noida',
    area: 'Sector 126, Noida Expressway',
    lat: 28.5355,
    lng: 77.3910,
    sector: 'E-Commerce & Quick Comm',
    website: 'https://www.moglix.com',
    careersUrl: 'https://www.moglix.com/careers',
  },
  {
    name: 'Shiprocket',
    ats: 'lever',
    jobBoard: 'shiprocket',
    city: 'Noida',
    area: 'Sector 132, Noida',
    lat: 28.5122,
    lng: 77.4003,
    sector: 'Logistics & Mobility',
    website: 'https://www.shiprocket.in',
    careersUrl: 'https://www.shiprocket.in/careers',
  },
  {
    name: 'Khatabook',
    ats: 'lever',
    jobBoard: 'khatabook',
    city: 'Gurugram',
    area: 'Cyber Hub',
    lat: 28.4996,
    lng: 77.0886,
    sector: 'FinTech',
    website: 'https://khatabook.com',
    careersUrl: 'https://khatabook.com/careers',
  },

  // ── ASHBY ───────────────────────────────────────────────────────────────────
  // Public API docs: https://developers.ashbyhq.com/reference/jobboard
  {
    name: 'Sarvam AI',
    ats: 'ashby',
    jobBoard: 'sarvam',
    city: 'Gurugram',
    area: 'DLF Cyber City',
    lat: 28.4963,
    lng: 77.0900,
    sector: 'AI & DeepTech',
    website: 'https://www.sarvam.ai',
    careersUrl: 'https://www.sarvam.ai/careers',
  },
  {
    name: 'Krutrim',
    ats: 'ashby',
    jobBoard: 'krutrim',
    city: 'Gurugram',
    area: 'Udyog Vihar',
    lat: 28.5045,
    lng: 77.0871,
    sector: 'AI & DeepTech',
    website: 'https://krutrim.com',
    careersUrl: 'https://krutrim.com/careers',
  },
  {
    name: 'Healthmug',
    ats: 'ashby',
    jobBoard: 'healthmug',
    city: 'Noida',
    area: 'Sector 62, Noida',
    lat: 28.6295,
    lng: 77.3685,
    sector: 'HealthTech',
    website: 'https://www.healthmug.com',
    careersUrl: 'https://www.healthmug.com/careers',
  },
];

module.exports = { COMPANIES };
