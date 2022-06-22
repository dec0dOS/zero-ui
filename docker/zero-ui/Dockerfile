FROM --platform=$BUILDPLATFORM node:lts-alpine as frontend-build

ENV INLINE_RUNTIME_CHUNK=false
ENV GENERATE_SOURCEMAP=false

WORKDIR /app
COPY .yarnrc.yml /app/.yarnrc.yml
COPY .yarn /app/.yarn

COPY ./frontend/package*.json /app/frontend
RUN yarn workspace frontend install

COPY ./frontend /app/frontend
RUN yarn workspace frontend build


FROM node:lts-alpine

WORKDIR /app/frontend/build
COPY --from=frontend-build /app/frontend/build /app/frontend/build/

WORKDIR /app
COPY .yarnrc.yml /app/.yarnrc.yml
COPY .yarn /app/.yarn

COPY ./backend/package*.json /app/backend
RUN yarn workspace backend install

COPY ./backend /app/backend

EXPOSE 4000
ENV NODE_ENV=production
ENV ZU_SECURE_HEADERS=true
ENV ZU_SERVE_FRONTEND=true

WORKDIR /app/backend

CMD [ "node", "./bin/www" ]
