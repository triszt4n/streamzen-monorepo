# Please keep this section in sync with the other Dockerfile
FROM node:20-alpine AS base

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

ENV NODE_ENV=production
ENV YARN_VERSION=4.4.1

WORKDIR /app/

RUN corepack enable &&\
    corepack prepare yarn@${YARN_VERSION} &&\
    echo 'nodeLinker: node-modules' > .yarnrc.yml &&\
    mkdir backend/ frontend/

FROM base AS builder

COPY package.json yarn.lock ./

RUN yarn install --immutable

# ------------ END OF COMMON STEPS -------------- #

COPY . .
RUN yarn build

# ======================================================== #
# ======================== RUNNER ======================== #
# ======================================================== #

FROM base AS runner

COPY package.json yarn.lock ./

RUN yarn install --immutable

COPY --from=builder /app/prisma/ ./prisma/

WORKDIR /app
RUN npx prisma generate
COPY --from=builder /app/dist/ ./

ENV NODE_ENV=production PORT=80
EXPOSE 80
CMD ["node", "./main.js"]
