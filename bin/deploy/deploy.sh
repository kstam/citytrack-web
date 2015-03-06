#!/bin/bash

## Assumes Node is installed (v0.10.36)  --> https://www.digitalocean.com/community/tutorials/how-to-install-node-js-with-nvm-node-version-manager-on-a-vps
##         gulp and bower are installed globally (npm install -g gulp bower)
##         Git is installed

mkdir -p build
echo "Compressing and copying code to server"
tar --exclude='./node_modules' --exclude='./bower_components' --exclude='./build' \
 --exclude='./.git' --exclude='./.idea' -czf build/web.tar.gz .
scp -P 10000 build/web.tar.gz kstam@83.212.114.165:~/deployment/

echo "Connecting to server to deploy"
ssh  kstam@83.212.114.165 -p 10000 << EOF
echo "Unzipping content"
cd deployment
gunzip -f web.tar.gz
tar -xf web.tar -C /var/www/citytrack-web/
rm -rf web.tar

echo "Installing and building"
cd /var/www/citytrack-web
npm install
gulp
EOF
