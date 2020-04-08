#!/usr/bin/env bash

. .env
. $HOME/.bashrc

args=(-azvP --delete --exclude=node_modules --exclude=.idea --exclude=.git)
hosts=($HOST_DOMAIN) # tornado lightning thunder tundra jefferson
dry=() #add --dry-run to enable testing
user=$HOST_USER
name=$HOST_PATH
project=$HOST_PROJECT

for host in "${hosts[@]}"
do
  echo ""
  date
  echo "---------------------"
  echo "syncing ${host}"
  echo "---------------------"
  rsync ${dry[@]} ${args[@]} ./ ${user}@${host}:www/${name}/${project}
  ssh -t ${user}@${host} \$HOME/www/${name}/${project}/bin/post-deploy.sh
done

version=$(jq -r .version package.json)
say "$HOST_PROJECT is live!"
exit
