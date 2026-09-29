#!/usr/bin/env node
/**
 * NCR LaunchMap — Cron Scheduler
 * ================================
 * Runs the ATS ingestion script on a configurable schedule using node-cron.
 *
 * Usage:
 *   node scripts/runCron.js
 *
 * Environment variable:
 *   INGEST_CRON  — cron expression (default: "0 *\/6 * * *" = every 6 hours)
 *
 * To keep this running in production, use PM2:
 *   pm2 start scripts/runCron.js --name ncr-cron
 */

'use strict';

require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const cron = require('node-cron');
const { execSync } = require('child_process');
const path = require('path');

const CRON_EXPRESSION = process.env.INGEST_CRON || '0 */6 * * *';
const INGEST_SCRIPT = path.resolve(__dirname, 'fetchJobsFromATS.js');

console.log(`\n⏰ NCR LaunchMap Cron Scheduler`);
console.log(`📅 Schedule: ${CRON_EXPRESSION}`);
console.log(`📂 Script  : ${INGEST_SCRIPT}`);
console.log(`🔄 Running first ingestion immediately...\n`);

// Run once immediately on start
function runIngestion() {
  const timestamp = new Date().toISOString();
  console.log(`\n[${timestamp}] 🚀 Starting scheduled ingestion...`);
  try {
    execSync(`node "${INGEST_SCRIPT}"`, { stdio: 'inherit' });
  } catch (err) {
    console.error(`[${timestamp}] ✗ Ingestion failed: ${err.message}`);
  }
}

// Initial run
runIngestion();

// Schedule recurring runs
if (!cron.validate(CRON_EXPRESSION)) {
  console.error(`✗ Invalid cron expression: "${CRON_EXPRESSION}"`);
  process.exit(1);
}

cron.schedule(CRON_EXPRESSION, runIngestion, {
  scheduled: true,
  timezone: 'Asia/Kolkata',
});

console.log(`\n✅ Cron scheduler active. Will run: ${CRON_EXPRESSION} (IST)\n`);
