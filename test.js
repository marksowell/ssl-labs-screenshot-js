/**
 * 🛠 To keep this branch up to date with main:
 * 
 *   git checkout ci-test
 *   git merge main
 *
 * This script runs a basic functional test of the CLI tool by generating
 * a screenshot of an SSL Labs report and verifying the output file exists.
 * It fails if the screenshot is not produced or if SSL Labs changes their layout.
 */

import fs from 'fs';
import { captureSSLLabsScreenshot } from './index.js';

const domain = 'ssllabs.com';
const filename = `${domain}_report.png`;

async function runTest() {
  try {
    await captureSSLLabsScreenshot(domain);

    if (!fs.existsSync(filename)) {
      throw new Error(`Screenshot file "${filename}" was not created.`);
    }

    console.log(`✅ Screenshot file "${filename}" exists.`);
    fs.unlinkSync(filename); // Clean up after success
    process.exit(0);
  } catch (err) {
    console.error(`❌ Test failed: ${err.message}`);
    process.exit(1);
  }
}

runTest();
