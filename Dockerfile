FROM ghcr.io/puppeteer/puppeteer:19.6.3

ARG USER=runner
ARG UID=1001
ARG GID=121

# Create Github runner user and its home folder
USER root
RUN groupadd $USER -g $GID && \
    useradd $USER --uid $UID -g $USER && \
    mkdir /home/$USER && chown $USER:$USER /home/$USER
USER $USER

COPY --chown=$USER:$USER . /app
WORKDIR /app

ENV PUPPETEER_CACHE_DIR=/home/$USER/.cache/puppeteer
RUN npm install
CMD [ "node", "/app/index.js" ]