FROM python:3.12.1-slim-bookworm AS app
LABEL maintainer="Sapta Rianza <saptaqur@gmail.com>"

WORKDIR /app

ARG UID=1000
ARG GID=1000

RUN \
  --mount=type=cache,target=/var/cache/apt \
  apt-get update \
  && apt-get install -y --no-install-recommends rsync build-essential curl libpq-dev gcc

RUN pwd && whoami \
  && rm -rf /usr/share/doc /usr/share/man \
  && groupadd -g "${GID}" python \
  && useradd --create-home --no-log-init -u "${UID}" -g "${GID}" python \
  && chown python:python -R /app

USER python

COPY --chown=python:python requirements.txt ./

RUN pip3 install --no-warn-script-location --user -r requirements.txt

ENV PYTHONPATH="." \
    PATH="${PATH}:/home/python/.local/bin" \
    USER="python"

COPY --chown=python:python . .

EXPOSE 8000

CMD ["gunicorn", "-c", "python:app.gunicorn", "wsgi:app"]

#####################################################

FROM nginx:1.25.3-alpine AS nginx
LABEL maintainer="Sapta Rianza <saptaqur@gmail.com>"

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d
