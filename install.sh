#!/usr/bin/env bash

if [[ -v DOWNLOADED ]]; then
  if [[ $DOWNLOADED == 0 ]]; then
    echo "Download complete"
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
    source ~/.bashrc
    nvm install 16
    exit 0
  fi
fi

mkdir bandwidth-server

cd bandwidth-server || exit

wget https://dl.techied.me/latest.tar.gz

tar -xvzf latest.tar.gz

chmod +x install.sh

export DOWNLOADED=0
./install.sh
