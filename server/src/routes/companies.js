/**
 * NCR LaunchMap — Companies API Router
 * ======================================
 * GET /api/companies/hiring
 *   Returns distinct companies that currently have at least one active job,
 *   sorted by job count descending.
 *
 *   Response shape:
 *   {
 *     success: true,
 *     total: 12,
 *     companies: [
 *       { company: "Sprinklr", count: 8, source: "greenhouse", lat: 28.49, lng: 77.08 },
 *       ...
 *     ]
 *   }
 *
 * GET /api/companies
 *   Returns all Startup documents from the database (for map pins).
 */

'use strict';

const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const Startup = require('../models/Startup');

// ─── GET /api/companies/hiring ────────────────────────────────────────────────
router.get('/hiring', async (req, res) => {
  try {
    // Aggregate: group active jobs by company, get count + sample location + source
    const results = await Job.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$company',
          count: { $sum: 1 },
          source: { $first: '$source' },
          city: { $first: '$city' },
          // Grab coordinates from first matching job
          coordinates: { $first: '$location.coordinates' },
          founderHiringCount: {
            $sum: { $cond: ['$founderHiring', 1, 0] },
          },
        },
      },
      { $sort: { count: -1 } },
    ]);

    const companies = results.map((r) => ({
      company: r._id,
      count: r.count,
      source: r.source,
      city: r.city,
      // Convert GeoJSON [lng, lat] → { lat, lng }
      lat: r.coordinates?.[1],
      lng: r.coordinates?.[0],
      hasFounderHiring: r.founderHiringCount > 0,
    }));

    return res.json({
      success: true,
      total: companies.length,
      companies,
    });
  } catch (err) {
    console.error('GET /api/companies/hiring error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ─── GET /api/companies ───────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const { hiring, city, sector, page = 1, limit = 100 } = req.query;

    const filter = { isApproved: true };
    if (hiring === 'true') filter.isHiring = true;
    if (city && city !== 'All') filter.city = city;
    if (sector && sector !== 'All') filter.sector = sector;

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(Math.max(1, parseInt(limit, 10)), 200);

    const [startups, total] = await Promise.all([
      Startup.find(filter)
        .sort({ featured: -1, isHiring: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .lean(),
      Startup.countDocuments(filter),
    ]);

    // Convert GeoJSON coords to Leaflet-friendly [lat, lng]
    const transformed = startups.map((s) => ({
      ...s,
      coordinates: s.location?.coordinates
        ? [s.location.coordinates[1], s.location.coordinates[0]]
        : [28.52, 77.22],
    }));

    return res.json({
      success: true,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      startups: transformed,
    });
  } catch (err) {
    console.error('GET /api/companies error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ─── POST /api/companies (submit a startup) ───────────────────────────────────
router.post('/', async (req, res) => {
  try {
    const body = req.body;

    // Basic validation
    if (!body.name || !body.slug || !body.lat || !body.lng) {
      return res.status(400).json({
        success: false,
        error: 'name, slug, lat, and lng are required',
      });
    }

    const startup = new Startup({
      ...body,
      location: {
        type: 'Point',
        coordinates: [parseFloat(body.lng), parseFloat(body.lat)],
      },
      isApproved: false, // Requires manual approval
      isHiring: false,
    });

    await startup.save();
    return res.status(201).json({ success: true, startup });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ success: false, error: 'Startup slug already exists' });
    }
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
