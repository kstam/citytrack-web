#!/bin/bash

# Create directories and permissions
sudo mkdir -p /var/www/citytrack-web
sudo chown -R kstam citytrack-web
sudo chown -R kstam:kstam citytrack-web

# Copy citytrack-web.conf to services
sudo cp citytrack-web.conf /etc/init/
