#!/bin/bash

set -xe

setup_vagrant() {
  mkdir -p /home/vagrant/.ssh
  chmod 0700 /home/vagrant/.ssh
  wget --no-check-certificate \
    https://raw.github.com/mitchellh/vagrant/master/keys/vagrant.pub \
    -O /home/vagrant/.ssh/authorized_keys
  chmod 0600 /home/vagrant/.ssh/authorized_keys
  chown -R vagrant /home/vagrant/.ssh
  gpasswd -a vagrant docker
}

setup_vagrant
