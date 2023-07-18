#!/usr/bin/env bash

cd "$(dirname "$0")/.."
. .env
. $HOME/.bashrc
. "$NVM_DIR/nvm.sh" && nvm use v18

host=$HOST_DOMAIN
name=$HOST_PATH
project=$HOST_PROJECT

node -v
npm -v

echo "current name: $name"

cd $HOME/www/${name}/${project}
CURRENT_UID=$(id -u):$(id -g) docker-compose pull
CURRENT_UID=$(id -u):$(id -g) docker-compose build --no-cache
CURRENT_UID=$(id -u):$(id -g) docker-compose up -d
