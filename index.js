const {
  promises: { mkdir, writeFile },
} = require("fs");
const { cwd } = require("process");
const { join, dirname } = require("path");
const { getInput } = require("@actions/core");
const { launch } = require("puppeteer");

(async () => {
  let inputPath =
    getInput("path") || "http://host.docker.internal:4173/cv.html";
  if (!/^.+:\/\//.test(inputPath)) {
    inputPath = `file://${join(cwd(), inputPath)}`;
  }

  const outputFile = getInput("output") || "./test/path/cv.pdf";
  const pdfOptions = JSON.parse(getInput("options") || "{}");

  console.log(`Input path: ${inputPath}`);
  console.log(`Output file: ${outputFile}\n`);

  console.log("Making sure output directory exists");
  const dir = dirname(outputFile);
  await mkdir(dir, { recursive: true });

  console.log("Opening the browser");
  const browser = await launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();

  console.log(`Navigating to ${inputPath}`);
  await page.goto(inputPath, { waitUntil: "networkidle0" });

  const pdf = await page.pdf(pdfOptions);

  console.log(`PDF is ready, writing to ${outputFile}`);
  await writeFile(outputFile, pdf);

  console.log("Closing the browser");
  await browser.close();

  console.log("Done");
})();
