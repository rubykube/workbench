#!/bin/bash

# Allow nginx to proxy
systemctl enable nginx
setsebool httpd_can_network_connect 1 -P

useradd --create-home -g users -G docker --shell /bin/bash app

cd /home/app
git clone --recursive https://www.github.com/rubykube/workbench.git

chown -R app:users /home/app

cd workbench
sudo -u app make build
sudo -u app make prepare
sudo -u app make down
docker volume prune -f
