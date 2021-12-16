FROM node:lts-alpine as build-stage

ENV INLINE_RUNTIME_CHUNK=false
ENV GENERATE_SOURCEMAP=false

RUN yarn set version 3.x

WORKDIR /app/frontend
COPY ./frontend/package*.json /app/frontend
RUN yarn install

COPY ./frontend /app/frontend
RUN yarn build


FROM node:lts-alpine

WORKDIR /app/frontend/build
COPY --from=build-stage /app/frontend/build /app/frontend/build/

WORKDIR /app/backend
COPY ./backend/package*.json /app/backend
RUN yarn install

COPY ./backend /app/backend

EXPOSE 4000
ENV NODE_ENV=production
ENV ZU_SECURE_HEADERS=true
ENV ZU_SERVE_FRONTEND=true

CMD [ "node", "./bin/www" ]
