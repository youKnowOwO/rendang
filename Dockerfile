FROM node:12-alpine

LABEL name "Rendang"
LABEL maintainer "Hazmi35 <contact@hzmi.xyz>"

ENV DISCORD_TOKEN= \
    MONGODB_URI=

WORKDIR /usr/rendang

COPY package.json yarn.lock /usr/rendang/
RUN echo [INFO] Installing build deps... \
&& apk add --update \
&& apk add --no-cache --virtual .build-deps build-base python g++ make \
&& echo [INFO] Build deps installed! \
&& echo [INFO] Installing 3rd party packages... \
&& apk add --no-cache git curl \
&& echo [INFO] 3rd party packages installed!

RUN echo [INFO] Node Version: $(node --version) \
&& echo [INFO] npm Version: $(npm --version) \
&& echo [INFO] Yarn Version: $(yarn --version) \
&& echo [INFO] Installing npm packages... \
&& yarn install \
&& echo [INFO] All npm packages installed! \
&& echo [INFO] Everything looks okay.

COPY . .

RUN echo [INFO] Building TypeScript project... \
&& echo Using TypeScript version: $(node -p "require('typescript').version") \
&& yarn run build \
&& echo [INFO] Done building TypeScript project! \
&& echo [INFO] Pruning devDependencies... \
&& yarn install --production \
&& apk del .build-deps \
&& echo [INFO] Done! Starting bot with yarn start

CMD ["yarn", "start"]