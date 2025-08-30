import puppeteer from 'puppeteer';
import fs from 'fs';
import ora from 'ora';

function sanitizeAndValidateDomain(url) {
    try {
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
        }
        let parsedDomain = new URL(url);
        const domain = parsedDomain.hostname;

        if (domain.length > 0 && domain.includes('.') && !domain.endsWith('.')) {
            return domain;
        }
    } catch (error) {
        return null;
    }
    return null;
}

function sanitizeFilename(filename) {
    // Remove any path traversal attempts and leave only valid domain name characters.
    return filename.replace(/(\.\.)|[^a-zA-Z0-9.-]/g, '');
}

export async function captureSSLLabsScreenshot(inputDomain) {
    const domain = sanitizeAndValidateDomain(inputDomain);
    if (!domain) {
        console.error("Invalid domain input.");
        return;
    }

    const sslLabsUrl = `https://www.ssllabs.com/ssltest/analyze.html?d=${domain}&hideResults=on`;
    const browser = await puppeteer.launch({
        headless: 'new' // Opting into the new headless mode
    });
    const page = await browser.newPage();

    await page.setViewport({
        width: 1200,
        height: 1000,
        deviceScaleFactor: 2
    });

    const spinner = ora(`Fetching SSL Labs screenshot for ${domain}...`).start();

    try {
        const response = await page.goto(sslLabsUrl);
        // Check the response status
        if (response.status() !== 200) {
            spinner.fail(`Received a ${response.status()} status from SSL Labs for the domain "${domain}".`);
            return;
        }

        // Attempt to find and navigate to the first IPv4 link if multiTable exists
        try {
            // Wait up to 10 seconds for the multiTable to appear
            await page.waitForSelector('#multiTable', { timeout: 10000 });
            // Extract all links from the multiTable
            const serverLinks = await page.$$eval("#multiTable a[href*='s=']", links => links.map(a => a.href));

            // Find the first IPv4 link
            const firstIPv4Link = serverLinks.find(link => !link.includes('%3a'));

            if (firstIPv4Link) {
                await page.goto(firstIPv4Link);
            } else {
                if (serverLinks.length > 0) {
                    await page.goto(serverLinks[0]);
                }
            }
        } catch (error) {
            // It's okay if multiTable is not present, moving on...
        }

        await page.waitForSelector('#rating', { timeout: 440000 });
        await new Promise(r => setTimeout(r, 5000));

        let grade;
        try {
            grade = await page.$eval("#gradeA", element => element.textContent.trim());
            spinner.succeed(`Overall rating: ${grade}`);
        } catch (error) {
            spinner.warn("Overall rating not available.");
        }

        await page.evaluate(() => {
            let reportSections = document.querySelectorAll('.reportSection');
            reportSections.forEach((section, index) => {
                if (index !== 0) {
                    section.style.display = 'none';
                }
            });
            let pageEnd = document.querySelector('#pageEnd');
            if (pageEnd) {
                pageEnd.remove();
            }
        });

        const element = await page.$('#page');
        const pageBox = await element.boundingBox();
        const screenshotBuffer = await page.screenshot({ clip: pageBox });

        const safeDomain = sanitizeFilename(domain);
        fs.writeFileSync(`${safeDomain}_report.png`, screenshotBuffer);
        spinner.succeed(`Screenshot saved as ${safeDomain}_report.png`);
    } catch (error) {
        spinner.fail(`An error occurred: ${error.message}`);
    } finally {
        await browser.close();
    }
}
