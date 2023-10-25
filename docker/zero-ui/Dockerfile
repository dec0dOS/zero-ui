FROM --platform=$BUILDPLATFORM node:lts-alpine as frontend-build

ENV GENERATE_SOURCEMAP=false

RUN corepack enable
RUN mkdir -p /app/frontend
WORKDIR /app/
COPY tsconfig.json package.json yarn.lock* .yarnrc.yml ./
COPY .yarn/ ./.yarn
WORKDIR /app/frontend/
COPY ./frontend/package*.json /app/frontend
RUN yarn workspaces focus frontend
COPY ./frontend /app/frontend
RUN yarn build


FROM node:lts-alpine

WORKDIR /app/frontend/build
COPY --from=frontend-build /app/frontend/build /app/frontend/build/

RUN corepack enable
RUN mkdir -p /app/backend
WORKDIR /app/
COPY package.json yarn.lock* .yarnrc.yml ./
COPY .yarn/ ./.yarn
WORKDIR /app/backend/
COPY ./backend/package*.json /app/backend
RUN yarn workspaces focus --production backend && yarn cache clean

COPY ./backend /app/backend

EXPOSE 4000
ENV NODE_ENV=production
ENV ZU_SECURE_HEADERS=true
ENV ZU_SERVE_FRONTEND=true

CMD [ "node", "./bin/www" ]
