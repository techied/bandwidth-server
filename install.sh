#!/usr/bin/env bash

if [[ $DOWNLOADED ]]; then
  echo "Download complete";

  exit 0;
fi

wget https://dl.techied.me/latest.tar.gz

tar -xvzf latest.tar.gz

cd latest || exit

chmod +x install.sh

export DOWNLOADED=0
./install.sh