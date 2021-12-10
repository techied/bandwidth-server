#!/usr/bin/env bash

if [[ -v DOWNLOADED ]]; then
  if [[ $DOWNLOADED == 0 ]]; then
    echo "Download complete"
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
    source ~/.bashrc
    nvm install 16
    apt install -y dialog
    MONGODB_INSTALLATION=$(dialog --clear --title "Install MongoDB locally?" --menu "Choose whether you would like to install MongoDB locally, and use the local server, or connect to another server with a connection URL:" 15 40 4 \
      1 "Install Locally" \
      2 "Enter Connection String" 2>&1 >/dev/tty)
    case $MONGODB_INSTALLATION in
    1)
      echo "Installing MongoDB locally"
      apt install -y mongodb-org
      systemctl start mongod
      systemctl enable mongod
      echo "MONGODB_URI=mongodb://localhost:27017/main" | tee .env
      ;;
    2)
      echo "Enter connection string"
      CONNECTION_STRING=$(dialog --clear --title "Enter connection string" --inputbox "Enter the connection string for your MongoDB server" 15 40 2>&1 >/dev/tty)
      echo "Connection string: $CONNECTION_STRING"
      ;;
    esac
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
