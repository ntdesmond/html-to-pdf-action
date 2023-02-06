import fs from 'fs';
import core from "@actions/core";
import puppeteer from "puppeteer";

(async () => {
    
    const inputFile = core.getInput('path');
    const outputFile = core.getInput('output');

    console.log(`Input file: ${inputFile}`);
    console.log(`Output file: ${outputFile}`);

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(inputFile, { waitUntil: "networkidle0" });

    const pdf = await page.pdf();
    console.log("PDF generated, writing to the file")

    fs.writeFileSync(outputFile, pdf);

    console.log("Done");
})();