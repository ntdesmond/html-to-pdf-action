FROM ghcr.io/puppeteer/puppeteer:19.6.3
COPY --chown=pptruser . /app
WORKDIR /app
ENV npm_config_cache=/tmp/npm_cache
RUN npm install
CMD [ "node", "/app/index.js" ]