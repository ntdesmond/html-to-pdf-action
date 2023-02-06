FROM ghcr.io/puppeteer/puppeteer:19.6.3
COPY . /app
WORKDIR /app
RUN npm install
CMD [ "ts-node", "index.ts" ]