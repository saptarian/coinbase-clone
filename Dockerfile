FROM python:3.12.1-slim-bookworm AS app

WORKDIR /app

ARG UID=1000
ARG GID=1000

RUN \
  --mount=type=cache,target=/var/cache/apt \
  apt-get update \
  && apt-get install -y --no-install-recommends build-essential curl libpq-dev gcc

RUN \
  rm -rf /usr/share/doc /usr/share/man \
  && groupadd -g "${GID}" python \
  && useradd --create-home --no-log-init -u "${UID}" -g "${GID}" python \
  && chown python:python -R /app

USER python

COPY --chown=python:python requirements.txt .

RUN pip3 install --no-warn-script-location --user -r requirements.txt

ARG version=0.7.3

RUN curl -so envconsul.tgz \
    https://releases.hashicorp.com/envconsul/${version}/envconsul_${version}_linux_amd64.tgz \
    && tar -xvzf envconsul.tgz \
    && chown python:python ./envconsul \
    && chmod +x ./envconsul \
    && mv envconsul /home/python/.local/bin/envconsul

ENV PYTHONPATH="." \
    PATH="${PATH}:/home/python/.local/bin" \
    USER="python"

COPY --chown=python:python . .

EXPOSE 8000

#####################################################

FROM nginx:1.25.3-alpine AS nginx

RUN rm /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/conf.d
