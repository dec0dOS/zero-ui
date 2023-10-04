FROM --platform=$BUILDPLATFORM node:lts-alpine as frontend-build

ENV GENERATE_SOURCEMAP=false

RUN mkdir -p /app/frontend
WORKDIR /app/
COPY --link tsconfig.json package.json yarn.lock* .yarnrc.yml ./
COPY --link .yarn/ ./.yarn
WORKDIR /app/frontend/
COPY --link ./frontend/package*.json /app/frontend
RUN yarn workspaces focus frontend
COPY --link ./frontend /app/frontend
RUN yarn build


FROM node:lts-alpine

WORKDIR /app/frontend/build
COPY --link --from=frontend-build /app/frontend/build /app/frontend/build/

RUN mkdir -p /app/backend
WORKDIR /app/
COPY --link package.json yarn.lock* .yarnrc.yml ./
COPY --link .yarn/ ./.yarn
WORKDIR /app/backend/
COPY --link ./backend/package*.json /app/backend
RUN yarn workspaces focus --production backend && yarn cache clean

COPY --link ./backend /app/backend

EXPOSE 4000
ENV NODE_ENV=production
ENV ZU_SECURE_HEADERS=true
ENV ZU_SERVE_FRONTEND=true

CMD [ "node", "./bin/www" ]
