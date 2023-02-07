const { writeFileSync } = require('fs');
const { cwd } = require('process');
const { join } = require('path');
const { getInput } = require('@actions/core');
const { launch } = require('puppeteer');

(async () => {
    
    const inputFile = join(cwd(), getInput('path'));
    const outputFile = getInput('output');

    console.log(`Input file: ${inputFile}`);
    console.log(`Output file: ${outputFile}`);

    const browser = await launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
    const page = await browser.newPage();
    await page.goto(`file://${inputFile}`, { waitUntil: "networkidle0" });

    const pdf = await page.pdf();
    console.log("PDF generated, writing to the file")

    writeFileSync(outputFile, pdf);

    console.log("Done");
})();
