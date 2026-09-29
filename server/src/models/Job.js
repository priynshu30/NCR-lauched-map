/**
 * NCR LaunchMap — Mongoose Job Model
 *
 * Uses a 2dsphere index on `location` (GeoJSON Point) so we can run
 * geospatial queries like $nearSphere and geoNear.
 *
 * Fields mirror the common schema used by the ingestion script and the
 * frontend TypeScript types.
 */

'use strict';

const mongoose = require('mongoose');

const { Schema } = mongoose;

// ─── Sub-schema: GeoJSON Point ────────────────────────────────────────────────
const geoPointSchema = new Schema(
  {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
      required: true,
    },
    coordinates: {
      // GeoJSON convention: [lng, lat]  (note: OPPOSITE of Leaflet [lat, lng])
      type: [Number],
      required: true,
    },
  },
  { _id: false }
);

// ─── Main Job Schema ──────────────────────────────────────────────────────────
const jobSchema = new Schema(
  {
    // Unique identifier per source, e.g. "gh-sprinklr-12345"
    jobId: {
      type: String,
      required: true,
      index: true,
    },

    // Source ATS / platform
    source: {
      type: String,
      enum: ['greenhouse', 'lever', 'ashby', 'hirist', 'cutshort', 'manual'],
      required: true,
      index: true,
    },

    // Job metadata
    title: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true, index: true },
    description: { type: String, default: '' },
    employmentType: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'],
      default: 'Full-time',
    },

    // Location
    locationText: { type: String, default: '' },  // Raw text from ATS
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    country: { type: String, default: 'India' },

    // GeoJSON Point for geospatial queries — populated by geocoder
    location: {
      type: geoPointSchema,
      required: true,
    },

    // Tags / skills
    tags: [{ type: String, trim: true }],

    // Application URL — direct link to original ATS posting
    applyUrl: { type: String, required: true },

    // Dates
    postedAt: { type: Date, default: Date.now },
    expiresAt: { type: Date },

    // Flags
    remote: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true, index: true },

    /**
     * founderHiring — true if job title / description contains keywords
     * like "founding engineer", "first hire", "founder's office", etc.
     * Detected automatically by the ingestion script.
     */
    founderHiring: { type: Boolean, default: false, index: true },

    // Optional salary info
    salaryMin: { type: Number },
    salaryMax: { type: Number },
    currency: { type: String, default: 'INR' },

    // Experience level
    experienceLevel: {
      type: String,
      enum: ['Entry', 'Mid', 'Senior', 'Lead', 'Any'],
      default: 'Any',
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────

// Geospatial index — REQUIRED for $nearSphere / geoNear
jobSchema.index({ location: '2dsphere' });

// Compound unique index: one record per (source, jobId)
jobSchema.index({ source: 1, jobId: 1 }, { unique: true });

// Full-text search index on title + company
jobSchema.index({ title: 'text', company: 'text', description: 'text' });

// Filter indexes
jobSchema.index({ isActive: 1, founderHiring: 1 });
jobSchema.index({ company: 1, isActive: 1 });
jobSchema.index({ tags: 1 });

// ─── Virtual: lat / lng convenience accessors ─────────────────────────────────
jobSchema.virtual('lat').get(function () {
  return this.location?.coordinates?.[1];
});
jobSchema.virtual('lng').get(function () {
  return this.location?.coordinates?.[0];
});

module.exports = mongoose.model('Job', jobSchema);
