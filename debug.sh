#!/bin/bash

docker run --name nginx.xio -p 7777:80 -v $(pwd):/usr/share/nginx/html:ro -d nginx
