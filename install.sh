#!/usr/bin/env bash

if [[ $(/usr/bin/id -u) -ne 0 ]]; then
    echo "Please run this script as root"
    exit
fi

if [[ -v DOWNLOADED ]]; then
  if [[ $DOWNLOADED == 0 ]]; then
    echo "Download complete"
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
    source ~/.bashrc
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    nvm install 16
    apt update
    apt install -y dialog iperf3
    MONGODB_INSTALLATION=$(dialog --clear --title "Install MongoDB locally?" --menu "Choose whether you would like to install MongoDB locally, and use the local server, or connect to another server with a connection URL:" 15 40 4 \
      1 "Install Locally" \
      2 "Enter Connection String" 2>&1 >/dev/tty)
    case $MONGODB_INSTALLATION in
    1)
      echo "Installing MongoDB locally"
      wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -
      echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list
      sudo apt update
      sudo apt install -y mongodb-org
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

    service="
    [Unit]
    Description=\"Bandwidth Server\"

    [Service]
    ExecStart=/usr/bin/bash /root/start-server.sh
    WorkingDirectory=/root/bandwidth-server
    Restart=always
    RestartSec=10
    StandardOutput=syslog
    StandardError=syslog
    SyslogIdentifier=BandwidthServer
    Environment=NODE_ENV=production

    [Install]
    WantedBy=multi-user.target
    "

    echo "$service" | sudo tee /etc/systemd/system/bandwidth-server.service

    startscript="
    #!/bin/bash
    source /root/.nvm/nvm.sh
    node /root/bandwidth-server/server.mjs
    "

    echo "$startscript" | sudo tee /root/start-server.sh

    iperf3service="
    [Unit]
    Description=iperf3 server
    After=syslog.target network.target auditd.service

    [Service]
    ExecStart=/usr/bin/iperf3 -s

    [Install]
    WantedBy=multi-user.target"

    echo "$iperf3service" | sudo tee /etc/systemd/system/iperf3.service

    sudo systemctl daemon-reload
    sudo systemctl enable bandwidth-server
    sudo systemctl start bandwidth-server
    sudo systemctl enable iperf3
    sudo systemctl start iperf3

    SERVER_IP=$(curl -s "http://169.254.169.254/metadata/v1/interfaces/public/0/ipv4/address")

    echo "############################################################"
    echo "Installation complete"
    echo "You can connect to the server in your browser at:"
    echo "http://$SERVER_IP:3001"
    echo "############################################################"

    exit 0
  fi
fi

mkdir bandwidth-server

cd bandwidth-server || exit

wget https://dl.techied.me/latest.tar.gz

tar -xvzf latest.tar.gz

rm latest.tar.gz

chmod +x install.sh

export DOWNLOADED=0
./install.sh
