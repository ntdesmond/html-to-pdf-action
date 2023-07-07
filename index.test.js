const { describe, it, expect } = require("@jest/globals");
const child_process = require("child_process");
const path = require("path");
const { createPdf, pathToUrl } = require(".");

const INPUT_PATH = "public/file.html";
const INPUT_OUTPUT = "public/file.pdf";
const INPUT_OPTIONS = "{}";

const script_path = path.join(__dirname, "index.js");
const runAction = (env) => {
  const { status, stderr, stdout } = child_process.spawnSync(
    "node",
    [script_path],
    { env }
  );
  console.log(
    `Action exited with status code ${status}.\n` +
      `Stdout:\n${stdout.toString()}` +
      `Stderr:\n${stderr.toString()}`
  );
  return status;
};

describe("createPdf", () => {
  const outputFile = INPUT_OUTPUT;
  const pdfOptions = JSON.parse(INPUT_OPTIONS);
  it("fails on non-existent input path", async () => {
    await createPdf({
      inputPath: pathToUrl("not-a-file.html"),
      outputFile,
      pdfOptions,
    }).catch(() => {});
  });
  it("fails on invalid input path", async () => {
    return createPdf({
      inputPath: "what/is\\this",
      outputFile,
      pdfOptions,
    }).catch(() => {});
  });
  it("succeeds on existing local files", async () => {
    await createPdf({
      inputPath: pathToUrl(INPUT_PATH),
      outputFile,
      pdfOptions,
    });
  });
  it("succeeds on files served over HTTP", async () => {
    await createPdf({
      inputPath: "http://127.0.0.1:8080/file.html",
      outputFile,
      pdfOptions,
    });
  });
});

describe("action", () => {
  it('fails on missing "path"', async () => {
    const status = runAction({ INPUT_OUTPUT, INPUT_OPTIONS });
    expect(status).not.toBeNull;
    expect(status).not.toBe(0);
  });
  it('fails on missing "output"', async () => {
    const status = runAction({ INPUT_PATH, INPUT_OPTIONS });
    expect(status).not.toBeNull;
    expect(status).not.toBe(0);
  });
  it('succeeds when "path" and "output" are defined', async () => {
    const status = runAction({ INPUT_PATH, INPUT_OUTPUT, INPUT_OPTIONS });
    expect(status).not.toBeNull;
    expect(status).toBe(0);
  });
});
