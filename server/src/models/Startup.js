/**
 * NCR LaunchMap — Mongoose Startup / Company Model
 *
 * Stores the company profile that is displayed on the map alongside jobs.
 * A startup can have zero or more associated Job documents.
 */

'use strict';

const mongoose = require('mongoose');

const { Schema } = mongoose;

const startupSchema = new Schema(
  {
    // Unique slug used as the ATS job-board identifier (e.g. "sprinklr")
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },

    name: { type: String, required: true, trim: true },
    website: { type: String, default: '' },
    careersUrl: { type: String, default: '' },
    logo: { type: String, default: '' },
    description: { type: String, default: '' },

    // Sector / vertical
    sector: {
      type: String,
      enum: [
        'FinTech',
        'AI & DeepTech',
        'SaaS & Enterprise',
        'E-Commerce & Quick Comm',
        'EdTech',
        'HealthTech',
        'Logistics & Mobility',
        'Consumer Tech',
        'CleanTech',
        'Other',
      ],
      default: 'Other',
    },

    // Funding stage
    stage: {
      type: String,
      enum: [
        'Bootstrapped',
        'Pre-Seed / Seed',
        'Series A',
        'Series B',
        'Series B+',
        'Series C',
        'Series D',
        'Series E',
        'Series F',
        'Unicorn',
        'Public',
        'Unknown',
      ],
      default: 'Unknown',
    },

    // Location
    city: {
      type: String,
      enum: ['Gurugram', 'Noida', 'Delhi', 'Faridabad', 'Ghaziabad'],
    },
    area: { type: String, default: '' },

    // GeoJSON point for map pin
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [lng, lat]
        required: true,
      },
    },

    // Meta
    founders: [{ type: String }],
    foundedYear: { type: Number },
    teamSize: { type: String, default: '' },
    techStack: [{ type: String }],

    socials: {
      linkedin: { type: String, default: '' },
      twitter: { type: String, default: '' },
    },

    // ATS integration config
    atsType: {
      type: String,
      enum: ['greenhouse', 'lever', 'ashby', 'manual', 'none'],
      default: 'none',
    },

    isHiring: { type: Boolean, default: false, index: true },
    isApproved: { type: Boolean, default: false },
    featured: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

startupSchema.index({ location: '2dsphere' });
startupSchema.index({ isHiring: 1, featured: -1 });
startupSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Startup', startupSchema);
