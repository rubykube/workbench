#!/bin/bash

set -xe

VBOXADDITIONS="VBoxGuestAdditions_5.1.22.iso"

cd /home/vagrant
mkdir /media/VBoxGuestAdditions
mount -o loop,ro $VBOXADDITIONS /media/VBoxGuestAdditions

sh /media/VBoxGuestAdditions/VBoxLinuxAdditions.run

umount /media/VBoxGuestAdditions
rmdir /media/VBoxGuestAdditions
rm $VBOXADDITIONS
