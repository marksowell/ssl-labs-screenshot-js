#!/usr/bin/env node
import { captureSSLLabsScreenshot } from './index.js';

const version = "1.0.3";

const domain = process.argv[2];
if (!domain) {
    console.log(`ssl-labs-screenshot-js v${version}`);
    console.log('Usage: ssl-labs-screenshot domain.com');
    process.exit(1);
}

captureSSLLabsScreenshot(domain);
