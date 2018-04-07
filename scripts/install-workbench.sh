#!/bin/bash

# Allow nginx to proxy
systemctl enable nginx
setsebool httpd_can_network_connect 1 -P

useradd --create-home -g users -G docker --shell /bin/bash app

cd /home/app
git clone --recursive https://www.github.com/rubykube/workbench.git

cd workbench
git checkout -b 1-5-stable origin/1-5-stable

chown -R app:users /home/app

make build
make prepare
make down
docker volume prune -f
