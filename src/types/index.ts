export type City = 'All' | 'Gurugram' | 'Noida' | 'Delhi' | 'Faridabad' | 'Ghaziabad';

export type Sector = 
  | 'All'
  | 'FinTech'
  | 'AI & DeepTech'
  | 'SaaS & Enterprise'
  | 'E-Commerce & Quick Comm'
  | 'EdTech'
  | 'HealthTech'
  | 'Logistics & Mobility'
  | 'Consumer Tech'
  | 'CleanTech';

export type Stage = 
  | 'All'
  | 'Bootstrapped'
  | 'Pre-Seed / Seed'
  | 'Series A'
  | 'Series B'
  | 'Series B+'
  | 'Series C'
  | 'Series D'
  | 'Series E'
  | 'Series F'
  | 'Unicorn'
  | 'Public';

export type WorkMode = 'All' | 'Onsite' | 'Hybrid' | 'Remote';

export interface Startup {
  _id: string;
  name: string;
  slug: string;
  website: string;
  logo: string;
  description: string;
  sector: Sector;
  stage: Stage;
  city: 'Gurugram' | 'Noida' | 'Delhi' | 'Faridabad' | 'Ghaziabad';
  area: string;
  coordinates: [number, number]; // [lat, lng]
  isHiring: boolean;
  careersUrl: string;
  founders: string[];
  foundedYear: number;
  teamSize: string;
  techStack?: string[];
  socials: {
    linkedin?: string;
    twitter?: string;
  };
  isApproved: boolean;
  featured?: boolean;
}

export type JobSource = 'Greenhouse' | 'Lever' | 'Ashby' | 'Careers Page';

export interface Job {
  _id: string;
  startupId: string;
  companyName?: string;
  title: string;
  type: 'Full-time' | 'Contract' | 'Internship';
  workMode: 'Onsite' | 'Hybrid' | 'Remote';
  location: string;
  city: 'Gurugram' | 'Noida' | 'Delhi';
  coordinates?: [number, number]; // [lat, lng] exact coordinates in NCR
  sector: Sector;
  skills: string[];
  salaryMin?: number;
  salaryMax?: number;
  salaryDisplay?: string;
  currency: string;
  applyUrl: string;
  applyEmail?: string;
  description: string;
  isActive: boolean;
  postedAt: string;
  experienceLevel: 'Entry' | 'Mid' | 'Senior' | 'Lead';
  source?: JobSource;
}

export type ViewMode = 'split' | 'map' | 'list';
