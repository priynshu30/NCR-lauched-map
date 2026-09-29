/**
 * NCR LaunchMap — Backend API Service
 * =====================================
 * Typed client for the Node.js/Express backend.
 * Falls back gracefully to local static data if the backend is unavailable.
 *
 * Base URL is set via VITE_API_URL env variable.
 * Default: http://localhost:5000
 */

// ── Types ─────────────────────────────────────────────────────────────────────

export interface BackendJob {
  _id: string;
  jobId: string;
  source: 'greenhouse' | 'lever' | 'ashby' | 'hirist' | 'cutshort' | 'manual';
  title: string;
  company: string;
  description: string;
  employmentType: 'Full-time' | 'Part-time' | 'Contract' | 'Internship' | 'Freelance';
  locationText: string;
  city: string;
  state: string;
  country: string;
  lat: number;
  lng: number;
  tags: string[];
  applyUrl: string;
  postedAt: string;
  remote: boolean;
  isActive: boolean;
  founderHiring: boolean;
  experienceLevel: 'Entry' | 'Mid' | 'Senior' | 'Lead' | 'Any';
  salaryMin?: number;
  salaryMax?: number;
  currency: string;
}

export interface JobsResponse {
  success: boolean;
  total: number;
  page: number;
  pages: number;
  limit: number;
  jobs: BackendJob[];
}

export interface HiringCompany {
  company: string;
  count: number;
  source: string;
  city: string;
  lat?: number;
  lng?: number;
  hasFounderHiring: boolean;
}

export interface HiringCompaniesResponse {
  success: boolean;
  total: number;
  companies: HiringCompany[];
}

export interface JobsQueryParams {
  lat?: number;
  lng?: number;
  radius?: number;        // km
  search?: string;
  tags?: string;          // comma-separated
  source?: string;
  remote?: boolean;
  founder?: boolean;
  expLevel?: string;
  page?: number;
  limit?: number;
}

// ── Config ────────────────────────────────────────────────────────────────────

const BASE_URL = (import.meta.env.VITE_API_URL as string) || 'http://localhost:5000';
const REQUEST_TIMEOUT_MS = 8000;

// ── Helpers ───────────────────────────────────────────────────────────────────

function buildQueryString(params: Record<string, string | number | boolean | undefined>): string {
  const filtered = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== null && v !== ''
  );
  if (filtered.length === 0) return '';
  return '?' + new URLSearchParams(filtered.map(([k, v]) => [k, String(v)])).toString();
}

async function apiFetch<T>(path: string, signal?: AbortSignal): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      signal: signal ?? controller.signal,
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      throw new Error(`API error ${res.status}: ${res.statusText}`);
    }

    return (await res.json()) as T;
  } finally {
    clearTimeout(timeout);
  }
}

// ── API Methods ───────────────────────────────────────────────────────────────

/**
 * Fetch jobs from the backend with geospatial + text + filter queries.
 * NCR default center: lat=28.52, lng=77.22, radius=50km
 */
export async function fetchJobs(
  params: JobsQueryParams = {},
  signal?: AbortSignal
): Promise<JobsResponse> {
  const query = buildQueryString({
    lat: params.lat ?? 28.52,
    lng: params.lng ?? 77.22,
    radius: params.radius ?? 50,
    search: params.search,
    tags: params.tags,
    source: params.source,
    remote: params.remote ? 'true' : undefined,
    founder: params.founder ? 'true' : undefined,
    expLevel: params.expLevel,
    page: params.page ?? 1,
    limit: params.limit ?? 100,
  });

  return apiFetch<JobsResponse>(`/api/jobs${query}`, signal);
}

/**
 * Fetch the list of companies currently hiring (with job counts).
 */
export async function fetchHiringCompanies(
  signal?: AbortSignal
): Promise<HiringCompaniesResponse> {
  return apiFetch<HiringCompaniesResponse>('/api/companies/hiring', signal);
}

/**
 * Health check — returns true if the backend is reachable.
 */
export async function checkBackendHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}/health`, { signal: AbortSignal.timeout(3000) });
    const data = await res.json();
    return data.status === 'ok';
  } catch {
    return false;
  }
}
