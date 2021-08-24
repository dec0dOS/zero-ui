FROM node:current-alpine as build-stage

ENV INLINE_RUNTIME_CHUNK=false
ENV GENERATE_SOURCEMAP=false

RUN yarn config set registry https://registry.npmjs.org

WORKDIR /app/frontend
COPY ./frontend/package*.json /app/frontend
COPY ./frontend/yarn.lock /app/frontend
RUN yarn install

COPY ./frontend /app/frontend
RUN yarn build


FROM node:current-alpine

WORKDIR /app/frontend/build
COPY --from=build-stage /app/frontend/build /app/frontend/build/

WORKDIR /app/backend
COPY ./backend/package*.json /app/backend
COPY ./backend/yarn.lock /app/backend
RUN yarn install

COPY ./backend /app/backend

EXPOSE 4000
ENV NODE_ENV=production
ENV ZU_SECURE_HEADERS=true
ENV ZU_SERVE_FRONTEND=true

CMD [ "node", "./bin/www" ]
