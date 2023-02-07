FROM ghcr.io/puppeteer/puppeteer:19.6.3
COPY --chown=pptruser . /app
WORKDIR /app
ENV PUPPETEER_CACHE_DIR=/home/pptruser/.cache/puppeteer
RUN npm install
CMD [ "node", "/app/index.js" ]