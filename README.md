# html2pdf

Github Action to convert local and remote HTML files to PDF using [puppeteer](https://github.com/puppeteer/puppeteer).

Supports puppeteer [`PDFOptions`](https://github.com/puppeteer/puppeteer/blob/471e291e052686988b850995a9412c19a82de503/docs/api/puppeteer.pdfoptions.md) to configure the PDF generation.

## Usage

Use it as a step in your workflow file:

```yaml
jobs:
  html2pdf:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: ntdesmond/html2pdf-action@v1
        with:
          path: ./file.html
          output: ./file.pdf
          options: |
            {"format": "A4"}
      - uses: actions/upload-artifact@v3
        with:
          path: ./file.pdf
```

To fetch files served over HTTP, pass the URL as path, e.g. `http://127.0.0.1:8080/file.html`.
