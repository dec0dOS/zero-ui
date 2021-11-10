# ---- initialize build stage
FROM node:current-alpine as builder

# ---- build ZeroTier-One
RUN apk add --update --no-cache alpine-sdk linux-headers \
  && git clone --quiet https://github.com/zerotier/ZeroTierOne.git /src \
  && make -C /src -f make-linux.mk

# ---- build Zero-UI
ENV INLINE_RUNTIME_CHUNK=false
ENV GENERATE_SOURCEMAP=false

RUN yarn set version berry

WORKDIR /app/frontend
COPY ./frontend/package*.json /app/frontend
COPY ./frontend/yarn.lock /app/frontend
RUN yarn install

COPY ./frontend /app/frontend
RUN yarn build

# ---- build ZeroNSd \
FROM rust:alpine as rbuild

ARG IS_LOCAL=0
ARG VERSION=main
ARG IS_TAG=0

RUN apk add --update --no-cache git libressl-dev musl-dev \
  && git clone https://github.com/zerotier/zeronsd.git \
  && cd zeronsd \
  && sh cargo-docker.sh

# ---- initialize deploy stage
FROM node:current-alpine

LABEL description="ZeroTier One as Docker Image"
LABEL org.opencontainers.image.authors="mcondarelli@soft-in.com"

# ---- copy ZeroTier-One
ARG ZT_VERSION

LABEL version="${ZT_VERSION}"

RUN apk add --update --no-cache libc6-compat libstdc++

COPY --from=builder /src/zerotier-one /usr/sbin/
RUN mkdir -p /var/lib/zerotier-one \
  && ln -s /usr/sbin/zerotier-one /usr/sbin/zerotier-idtool \
  && ln -s /usr/sbin/zerotier-one /usr/sbin/zerotier-cli

EXPOSE 9993/udp

# ---- copy Zero-UI
WORKDIR /app/frontend/build
COPY --from=builder /app/frontend/build /app/frontend/build/

WORKDIR /app/backend
COPY ./backend/package*.json /app/backend
COPY ./backend/yarn.lock /app/backend
RUN yarn install

COPY ./backend /app/backend

EXPOSE 4000
ENV NODE_ENV=production
ENV ZU_SECURE_HEADERS=true
ENV ZU_SERVE_FRONTEND=true

# ---- copy ZeroNSd
COPY --from=rbuild /usr/local/cargo/bin/zeronsd /usr/sbin/

# ---- final setup

VOLUME /var/lib/zerotier

COPY docker/all-in-one/entrypoint.sh /entrypoint.sh
RUN chmod 755 /entrypoint.sh

CMD /entrypoint.sh
