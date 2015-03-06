#!/bin/bash

# Create directories and permissions
mkdir ~/deployment
sudo mkdir -p /var/www/citytrack-web
sudo chown -R kstam /var/www/citytrack-web
sudo chown -R kstam:kstam /var/www/citytrack-web

# Copy citytrack-web.conf to services
sudo cp citytrack-web.conf /etc/init/
