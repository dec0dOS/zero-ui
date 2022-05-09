FROM node:lts-alpine as build-stage

ENV INLINE_RUNTIME_CHUNK=false
ENV GENERATE_SOURCEMAP=false

WORKDIR /app/frontend
COPY ./frontend/package*.json /app/frontend
RUN yarn install --network-timeout 1000000

COPY ./frontend /app/frontend
RUN yarn build


### Node Backend
#FROM node:lts-alpine
#
#WORKDIR /app/frontend/build
#COPY --from=build-stage /app/frontend/build /app/frontend/build/
#
#WORKDIR /app/backend
#COPY ./backend/package*.json /app/backend
#RUN yarn install
#
#COPY ./backend /app/backend
#
#EXPOSE 4000
#ENV NODE_ENV=production
#ENV ZU_SECURE_HEADERS=true
#ENV ZU_SERVE_FRONTEND=true
#
#CMD [ "node", "./bin/www" ]

#### Python Backend
FROM tiangolo/uwsgi-nginx-flask:python3.9

COPY ./backend-py/requirements.txt /app/requirements.txt

RUN pip install --no-cache-dir --upgrade -r /app/requirements.txt

COPY ./backend-py /app

ENV UWSGI_INI /app/uwsgi.ini

COPY --from=build-stage /app/frontend/build /app/app/
ENV FLASK_APP=main.py
EXPOSE 80