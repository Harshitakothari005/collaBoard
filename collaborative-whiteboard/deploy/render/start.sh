#!/bin/sh
set -e

: "${PORT:=10000}"
: "${BACKEND_PORT:=8080}"

export PORT BACKEND_PORT

envsubst '${PORT} ${BACKEND_PORT}' \
  < /etc/nginx/templates/default.conf.template \
  > /etc/nginx/http.d/default.conf

java -jar /app/app.jar --server.port="${BACKEND_PORT}" &
JAVA_PID=$!

nginx -g 'daemon off;' &
NGINX_PID=$!

trap 'kill "$JAVA_PID" "$NGINX_PID" 2>/dev/null || true' INT TERM

while kill -0 "$JAVA_PID" 2>/dev/null && kill -0 "$NGINX_PID" 2>/dev/null; do
  sleep 2
done

kill "$JAVA_PID" "$NGINX_PID" 2>/dev/null || true
