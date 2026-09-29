/**
 * NCR LaunchMap — useBackendJobs Hook
 * =====================================
 * React hook that fetches jobs from the Express/MongoDB backend.
 * If the backend is unreachable, it transparently falls back to the
 * static local job data (so the app works without a server in pure
 * frontend / demo mode).
 *
 * Usage:
 *   const { jobs, hiringCompanies, loading, error, refetch, backendOnline } = useBackendJobs(filters);
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  fetchJobs,
  fetchHiringCompanies,
  checkBackendHealth,
  BackendJob,
  HiringCompany,
  JobsQueryParams,
} from '../services/apiService';
import { Job } from '../types';
import { initialJobs } from '../data/jobsData';

// ── Type Adapters ─────────────────────────────────────────────────────────────
// The backend uses a slightly different schema than the frontend legacy Job type.
// This adapter converts BackendJob → frontend Job so existing components keep working.

function backendJobToFrontend(bj: BackendJob): Job {
  return {
    _id: bj._id,
    startupId: bj.company.toLowerCase().replace(/\s+/g, '-'),
    companyName: bj.company,
    title: bj.title,
    type: bj.employmentType as Job['type'],
    workMode: bj.remote ? 'Remote' : 'Onsite',
    location: bj.locationText || `${bj.city}, India`,
    city: (bj.city || 'Gurugram') as Job['city'],
    coordinates: bj.lat && bj.lng ? [bj.lat, bj.lng] : undefined,
    sector: 'AI & DeepTech', // TODO: map from tags
    skills: bj.tags,
    currency: bj.currency || 'INR',
    applyUrl: bj.applyUrl,
    description: bj.description,
    isActive: bj.isActive,
    postedAt: bj.postedAt
      ? new Date(bj.postedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
      : 'Recently',
    experienceLevel: bj.experienceLevel === 'Any' ? 'Mid' : bj.experienceLevel,
    source: bj.source.charAt(0).toUpperCase() + bj.source.slice(1) as Job['source'],
  };
}

// ── Hook Types ────────────────────────────────────────────────────────────────

export interface BackendJobsState {
  jobs: Job[];
  backendJobs: BackendJob[];   // raw backend format (for job map pins with accurate coords)
  hiringCompanies: HiringCompany[];
  loading: boolean;
  error: string | null;
  backendOnline: boolean;
  total: number;
  refetch: () => void;
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useBackendJobs(
  filters: JobsQueryParams = {},
  enabled = true
): BackendJobsState {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [backendJobs, setBackendJobs] = useState<BackendJob[]>([]);
  const [hiringCompanies, setHiringCompanies] = useState<HiringCompany[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [backendOnline, setBackendOnline] = useState(false);
  const [total, setTotal] = useState(0);
  const abortRef = useRef<AbortController | null>(null);

  const load = useCallback(async () => {
    if (!enabled) return;

    // Cancel any in-flight request
    abortRef.current?.abort();
    abortRef.current = new AbortController();
    const signal = abortRef.current.signal;

    setLoading(true);
    setError(null);

    // 1. Quick health check to decide whether to hit backend or fallback
    const healthy = await checkBackendHealth();
    setBackendOnline(healthy);

    if (!healthy) {
      // Fallback: use static local job data
      setJobs(initialJobs.filter((j) => j.isActive));
      setBackendJobs([]);
      setHiringCompanies([]);
      setTotal(initialJobs.filter((j) => j.isActive).length);
      setLoading(false);
      return;
    }

    try {
      // 2. Parallel fetch: jobs + hiring companies
      const [jobsRes, hiringRes] = await Promise.all([
        fetchJobs(filters, signal),
        fetchHiringCompanies(signal),
      ]);

      if (!signal.aborted) {
        const adapted = jobsRes.jobs.map(backendJobToFrontend);
        setBackendJobs(jobsRes.jobs);
        setJobs(adapted);
        setTotal(jobsRes.total);
        setHiringCompanies(hiringRes.companies);
      }
    } catch (err: unknown) {
      if (!signal.aborted) {
        const msg = err instanceof Error ? err.message : 'Unknown error';
        setError(msg);
        // Fallback to static data on error
        setJobs(initialJobs.filter((j) => j.isActive));
        setTotal(initialJobs.filter((j) => j.isActive).length);
      }
    } finally {
      if (!signal.aborted) setLoading(false);
    }
  }, [
    enabled,
    filters.lat,
    filters.lng,
    filters.radius,
    filters.search,
    filters.tags,
    filters.source,
    filters.remote,
    filters.founder,
    filters.expLevel,
    filters.page,
    filters.limit,
  ]);

  useEffect(() => {
    load();
    return () => abortRef.current?.abort();
  }, [load]);

  return {
    jobs,
    backendJobs,
    hiringCompanies,
    loading,
    error,
    backendOnline,
    total,
    refetch: load,
  };
}
