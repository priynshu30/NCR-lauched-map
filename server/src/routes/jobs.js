/**
 * NCR LaunchMap — Jobs API Router
 * ================================
 * GET /api/jobs
 *   Query params:
 *     lat       (number)  — center latitude  [default: 28.52, NCR center]
 *     lng       (number)  — center longitude [default: 77.22]
 *     radius    (number)  — search radius in km [default: 50]
 *     search    (string)  — full-text search on title / company / description
 *     tags      (string)  — comma-separated tag filter (OR logic)
 *     source    (string)  — filter by ATS source (greenhouse|lever|ashby|manual)
 *     remote    (boolean) — "true" to show only remote jobs
 *     founder   (boolean) — "true" to show only founder-hiring jobs
 *     expLevel  (string)  — Entry|Mid|Senior|Lead
 *     page      (number)  — page number [default: 1]
 *     limit     (number)  — results per page [default: 50, max: 200]
 *
 * GET /api/jobs/:id
 *   Returns a single job by MongoDB _id.
 */

'use strict';

const express = require('express');
const router = express.Router();
const Job = require('../models/Job');

// ─── GET /api/jobs ────────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const {
      lat = 28.52,
      lng = 77.22,
      radius = 50,   // km
      search,
      tags,
      source,
      remote,
      founder,
      expLevel,
      page = 1,
      limit = 50,
    } = req.query;

    const centerLat = parseFloat(lat);
    const centerLng = parseFloat(lng);
    const radiusKm = Math.min(parseFloat(radius), 200); // cap at 200 km
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(Math.max(1, parseInt(limit, 10)), 200);

    // ── Build filter object ──────────────────────────────────────────────────
    const filter = { isActive: true };

    // Geospatial: jobs within `radius` km of [lng, lat]
    // MongoDB $nearSphere expects [lng, lat] (GeoJSON order)
    filter.location = {
      $nearSphere: {
        $geometry: {
          type: 'Point',
          coordinates: [centerLng, centerLat],
        },
        $maxDistance: radiusKm * 1000, // metres
      },
    };

    // Full-text search (uses the text index on title + company + description)
    if (search && search.trim()) {
      filter.$text = { $search: search.trim() };
    }

    // Tag filter (OR: job must have at least one of the given tags)
    if (tags && tags.trim()) {
      const tagList = tags.split(',').map((t) => t.trim()).filter(Boolean);
      if (tagList.length > 0) {
        filter.tags = { $in: tagList };
      }
    }

    // Source filter
    if (source && source.trim()) {
      filter.source = source.trim().toLowerCase();
    }

    // Remote filter
    if (remote === 'true') {
      filter.remote = true;
    }

    // Founder hiring filter
    if (founder === 'true') {
      filter.founderHiring = true;
    }

    // Experience level filter
    if (expLevel && expLevel.trim()) {
      filter.experienceLevel = expLevel.trim();
    }

    // ── Execute query ────────────────────────────────────────────────────────
    const skip = (pageNum - 1) * limitNum;

    // When doing text search, include score for sorting relevance
    let query = Job.find(filter);
    if (search && search.trim()) {
      query = query.select({ score: { $meta: 'textScore' } });
    }

    const [jobs, total] = await Promise.all([
      query
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Job.countDocuments(filter),
    ]);

    // Transform to frontend-friendly format (Leaflet uses [lat, lng])
    const transformed = jobs.map((job) => ({
      ...job,
      // Expose lat/lng separately for convenience
      lat: job.location?.coordinates?.[1],
      lng: job.location?.coordinates?.[0],
    }));

    return res.json({
      success: true,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      limit: limitNum,
      jobs: transformed,
    });
  } catch (err) {
    console.error('GET /api/jobs error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ─── GET /api/jobs/:id ────────────────────────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).lean();
    if (!job) {
      return res.status(404).json({ success: false, error: 'Job not found' });
    }
    return res.json({
      success: true,
      job: {
        ...job,
        lat: job.location?.coordinates?.[1],
        lng: job.location?.coordinates?.[0],
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
