#!/bin/bash

set -xe

cat <<EOT >> /etc/environment
export LANG=en_US.utf-8
export LC_ALL=en_US.utf-8
EOT

remove_docker() {
  yum remove -y docker \
    docker-client \
    docker-client-latest \
    docker-common \
    docker-latest \
    docker-latest-logrotate \
    docker-logrotate \
    docker-selinux \
    docker-engine-selinux \
    docker-engine
}

configure_docker() {
  yum install -y yum-utils \
    device-mapper-persistent-data \
    lvm2

  yum-config-manager \
    --add-repo \
    https://download.docker.com/linux/centos/docker-ce.repo
}

upgrade_system() {
  yum --enablerepo=extras install -y epel-release
  yum upgrade -y
  yum install -y screen curl wget git pwgen vim htop nginx \
    python-pip docker-ce
  systemctl enable docker
  systemctl start docker
}

install_compose() {
  pip install docker-compose
}

remove_docker
configure_docker
upgrade_system
install_compose
