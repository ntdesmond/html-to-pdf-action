const { writeFileSync } = require('fs');
const { cwd } = require('process');
const { join } = require('path');
const { getInput } = require('@actions/core');
const { launch } = require('puppeteer');

(async () => {
    
    const inputFile = join(cwd(), getInput('path'));
    const outputFile = getInput('output');
    const pdfOptions = JSON.parse(getInput('options'));

    console.log(`Input file: ${inputFile}`);
    console.log(`Output file: ${outputFile}\n`);

    console.log("Opening the browser")
    const browser = await launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
    const page = await browser.newPage();
    
    const url = `file://${inputFile}`;
    console.log(`Navigating to ${url}`)
    await page.goto(url, { waitUntil: "networkidle0" });

    const pdf = await page.pdf(pdfOptions);
    
    console.log(`PDF is ready, writing to ${outputFile}`)
    writeFileSync(outputFile, pdf);
    
    console.log("Closing the browser")
    await browser.close()

    console.log("Done");
})();
