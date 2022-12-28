FROM --platform=$BUILDPLATFORM node:lts-alpine as frontend-build

ENV INLINE_RUNTIME_CHUNK=false
ENV GENERATE_SOURCEMAP=false
ENV NODE_OPTIONS=--openssl-legacy-provider

WORKDIR /app/frontend
COPY yarn.lock .yarnrc.yml ./
COPY .yarn/ ./.yarn/
COPY ./frontend/package*.json /app/frontend
RUN yarn install

COPY ./frontend /app/frontend
RUN yarn build


FROM node:lts-alpine

WORKDIR /app/frontend/build
COPY --from=frontend-build /app/frontend/build /app/frontend/build/

WORKDIR /app/backend
COPY yarn.lock .yarnrc.yml ./
COPY .yarn/ ./.yarn/
COPY ./backend/package*.json /app/backend
RUN yarn install

COPY ./backend /app/backend

EXPOSE 4000
ENV NODE_ENV=production
ENV ZU_SECURE_HEADERS=true
ENV ZU_SERVE_FRONTEND=true

CMD [ "node", "./bin/www" ]
