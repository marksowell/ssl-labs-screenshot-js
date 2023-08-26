#!/usr/bin/env node
import { captureSSLLabsScreenshot } from './index.js';

const domain = process.argv[2];
if (!domain) {
    console.log('Usage: ssl-labs-screenshot domain.com');
    process.exit(1);
}

captureSSLLabsScreenshot(domain);
