#!/bin/sh

sed -i -e 's/$TOKEN/'"$TOKEN"'/g' src/common/config.js
sed -i -e 's/$PORT/'"$PORT"'/g' /etc/nginx/conf.d/default.conf
exec "$@"