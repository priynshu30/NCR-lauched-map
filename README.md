# 🚀 NCR Launched — Delhi NCR's #1 Startup & Job Aggregator Map

[![React](https://img.shields.io/badge/React-18.3-61dafb?style=flat-square&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646cff?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9-199900?style=flat-square&logo=leaflet)](https://leafletjs.com/)
[![Express](https://img.shields.io/badge/Express-4.19-000000?style=flat-square&logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Geospatial_2dsphere-47A248?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)

**NCR Launched** (NCR LaunchMap) is an interactive geospatial aggregator platform designed for the **Delhi NCR tech ecosystem** (Gurugram, Noida, and Delhi). It aggregates live job openings from top public ATS platforms (**Greenhouse**, **Lever**, **Ashby**) and displays them on a map with real-time hiring pins. Candidates can click "Apply" to go directly to official job postings (like Naukri/Wellfound).

---

## 🌟 Key Highlights

- 🗺️ **Real Street Map (OpenStreetMap):** Free, authentic global map loaded with Delhi NCR expressways, metro lines, tech parks (DLF Cyber City, Sector 62 Noida, Okhla, etc.). **Zero API keys required.**
- 📍 **Precision Map Pins:** Sleek teardrop pins with needle-point coordinate precision:
  - 🟢 **Hiring Startups:** Vibrant Emerald Green with ground pulse beacon & "HIRING" badge.
  - 🔵 **Registered Startups:** Royal Sapphire Blue.
  - 🟡 **Selected State:** Amber highlight ring with auto-fly camera zoom.
- ⚡ **Automated Public ATS Ingestion:** Ingestion script scrapes official public endpoints:
  - **Greenhouse:** `https://boards-api.greenhouse.io/v1/boards/{jobBoard}/jobs?content=true`
  - **Lever:** `https://api.lever.co/v0/postings/{jobBoard}?mode=json`
  - **Ashby:** `https://api.ashbyhq.com/posting-api/job-board/{jobBoard}`
- 🚀 **Founder / Startup Hiring Detection:** Automatically classifies roles with keywords like `"founding engineer"`, `"first hire"`, `"founder's office"`, `"0-1"`, etc.
- 📈 **Animated Live Counters:** Real-time ease-out counting animation for Startups, Hiring Now, and Active Jobs.
- 🚇 **Delhi Metro Route Visualization:** Realistic Metro simulation (Yellow & Blue lines) with ambient sound synthesis.
- 🔍 **Full-Text & Geospatial Search:** MongoDB `$nearSphere` queries by radius (in km) around given coordinates, text search, tag filters, and remote/hybrid modes.
- 📱 **Fully Responsive:** Custom mobile drawer menu, mobile-first floating tabs, and dark/light mode toggle.
- 🌐 **Rank #1 SEO Suite:** Comprehensive Schema.org JSON-LD structured data, OpenGraph, Twitter Cards, Geotags, `robots.txt`, and `sitemap.xml`.

---

## 📁 Repository Structure

```
NCR-lauched map/
├── public/
│   ├── robots.txt              # Search engine crawler configuration
│   ├── sitemap.xml             # XML sitemap for Google indexing
│   └── logo.png
├── src/                        # Frontend React + TypeScript
│   ├── components/
│   │   ├── AnimatedCounter.tsx # Live count-up animation component
│   │   ├── Header.tsx          # High-tech vector logo & navigation
│   │   ├── MapView.tsx         # OpenStreetMap + Teardrop Pins & Popups
│   │   ├── MetroTrack.tsx      # Delhi Metro track animation
│   │   ├── StartupList.tsx     # Sidebar list of companies
│   │   └── Modals/             # JobsModal, PostJobModal, SearchModal, etc.
│   ├── data/                   # Fallback sample data (startupsData, jobsData)
│   ├── hooks/
│   │   └── useBackendJobs.ts   # React hook connecting to Express backend
│   ├── services/
│   │   ├── apiService.ts       # Typed API client for /api/jobs & /api/companies
│   │   └── atsSyncService.ts   # In-browser ATS fallback sync
│   ├── App.tsx                 # Main application dashboard
│   └── index.css               # Tailwind CSS, map filters, dark mode
├── server/                     # Node.js + Express + MongoDB Backend
│   ├── src/
│   │   ├── models/
│   │   │   ├── Job.js          # Mongoose model (2dsphere geospatial index)
│   │   │   └── Startup.js      # Mongoose Startup profile model
│   │   ├── routes/
│   │   │   ├── jobs.js         # GET /api/jobs ($nearSphere, text search, filters)
│   │   │   └── companies.js    # GET /api/companies/hiring aggregation
│   │   ├── data/
│   │   │   ├── companiesList.js # Registry of ATS companies (Sprinklr, Urban Company, Razorpay, etc.)
│   │   │   └── cityCoords.json # NCR city & sector geocoding dictionary
│   │   └── server.js           # Express entrypoint, CORS, rate limiting
│   ├── scripts/
│   │   ├── fetchJobsFromATS.js # Production ingestion engine
│   │   └── runCron.js          # node-cron recurring ingestion scheduler
│   ├── .env.example
│   └── package.json
├── .env.example
├── index.html                  # SEO metadata, OpenGraph, JSON-LD, Preload links
├── package.json
└── vite.config.ts
```

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite 6, TypeScript 5, Tailwind CSS 3 |
| **Mapping Engine** | Leaflet 1.9, OpenStreetMap Tiles, Vector SVG Markers |
| **Backend API** | Node.js (>= 18), Express 4, CORS, express-rate-limit |
| **Database** | MongoDB with Mongoose (2dsphere index for `$nearSphere`) |
| **Scheduling** | node-cron (automated recurrent scrapes every 6 hours) |
| **Public ATS Integrations** | Greenhouse Board API, Lever Postings API, Ashby Job Board API |
| **SEO & Performance** | Schema.org JSON-LD, OpenGraph, WebP Image Optimization, robots.txt, sitemap.xml |

---

## 🚀 Getting Started

### Prerequisites

1. **Node.js** >= 18.0.0
2. **MongoDB** installed locally (or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster)
3. **Git**

---

### Step 1: Clone & Install Dependencies

```bash
# Clone repository
git clone <your-repository-url>
cd "NCR-lauched map"

# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

---

### Step 2: Environment Variables Setup

#### 1. Frontend Environment (`.env`)
Create a `.env` file in the root directory:
```bash
cp .env.example .env
```
Content:
```env
VITE_API_URL=http://localhost:5000
```

#### 2. Backend Environment (`server/.env`)
Create a `.env` file inside `/server`:
```bash
cd server
cp .env.example .env
```
Content:
```env
MONGO_URI=mongodb://localhost:27017/ncr_launchmap
PORT=5000
CLIENT_ORIGIN=http://localhost:5173
INGEST_CRON=0 */6 * * *
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW_MS=900000
```
*(If using MongoDB Atlas, replace `MONGO_URI` with your connection string).*

---

### Step 3: Run Job Ingestion (Greenhouse, Lever, Ashby)

Pull live jobs from tracked NCR companies into your database:
```bash
cd server
npm run ingest
```
This fetches open roles, performs geocoding to NCR coordinates, detects founder/startup hiring signals, and upserts them to MongoDB.

To run automated scheduled ingestion every 6 hours:
```bash
npm run cron
```

---

### Step 4: Start Development Servers

#### Terminal 1 — Backend:
```bash
cd server
npm run dev
# Running at http://localhost:5000
```

#### Terminal 2 — Frontend:
```bash
# In the root directory:
npm run dev
# Running at http://localhost:5173
```

Open your browser at `http://localhost:5173`.

---

## 📡 API Endpoints

### 1. `GET /api/jobs`
Query live jobs using radius-based geospatial queries:
```
GET /api/jobs?lat=28.52&lng=77.22&radius=35&search=react&founder=true&remote=false
```
**Query Parameters:**
- `lat`: Latitude center (Default: `28.52`)
- `lng`: Longitude center (Default: `77.22`)
- `radius`: Radius in kilometers (Default: `50`)
- `search`: Full-text keyword search across title, company, and description
- `tags`: Comma-separated tag filters (e.g. `React,TypeScript`)
- `founder`: `true` to filter for founder / early-stage roles
- `remote`: `true` for remote positions only
- `expLevel`: `Entry` | `Mid` | `Senior` | `Lead`

### 2. `GET /api/companies/hiring`
Returns distinct companies that currently have open positions, aggregated with counts and coordinates.

### 3. `GET /health`
Returns database connectivity and server uptime status.

---

## ➕ How to Track More Companies

To add new startups to the automated ATS ingestion pipeline, simply open [`server/src/data/companiesList.js`](file:///c:/Users/priya/Desktop/NCR-lauched%20map/server/src/data/companiesList.js) and add an entry:

```javascript
{
  name: 'Sarvam AI',
  ats: 'ashby',             // 'greenhouse' | 'lever' | 'ashby'
  jobBoard: 'sarvam',       // Organization slug from their ATS board URL
  city: 'Gurugram',         // 'Gurugram' | 'Noida' | 'Delhi'
  area: 'DLF Cyber City',
  lat: 28.4963,
  lng: 77.0900,
  sector: 'AI & DeepTech',
  website: 'https://www.sarvam.ai',
  careersUrl: 'https://www.sarvam.ai/careers',
}
```

Run `npm run ingest` to immediately pull their open positions.

---

## 🔒 Compliance & Safety

- Uses **only public, documented endpoints** with no private scraping.
- Enforces rate limits and polite pauses between calls (500ms delay between company requests, 1.1s delay on geocoding).
- API is protected with `express-rate-limit` to prevent abuse.

---

## 📄 License

MIT License — Feel free to use and contribute to the NCR tech ecosystem!
