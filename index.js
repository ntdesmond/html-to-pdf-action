const {
  promises: { mkdir, writeFile },
} = require("fs");
const { dirname } = require("path");
const { getInput } = require("@actions/core");
const { launch } = require("puppeteer");
const { pathToFileURL } = require("url");

const pathToUrl = (path) => {
  if (/^.+:\/\//.test(path)) {
    return path;
  }
  return pathToFileURL(path);
};

const getInputs = () => {
  const inputPath = pathToUrl(getInput("path", { required: true }));
  const outputFile = getInput("output", { required: true });
  const pdfOptions = JSON.parse(getInput("options"));

  return { inputPath, outputFile, pdfOptions };
};

const createPdf = async ({ inputPath, outputFile, pdfOptions }) => {
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

  try {
    console.log(`Navigating to ${inputPath}`);
    await page.goto(inputPath, { waitUntil: "networkidle0" });

    const pdf = await page.pdf(pdfOptions);

    console.log(`PDF is ready, writing to ${outputFile}`);
    await writeFile(outputFile, pdf);
  } finally {
    console.log("Closing the browser");
    await browser.close();
  }
};

if (require.main === module) {
  (async () => {
    await createPdf(getInputs());
    console.log("Done");
  })();
}

module.exports = { pathToUrl, getInputs, createPdf };
