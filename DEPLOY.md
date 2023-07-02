# How to deploy

This project uses docker-compatible containers.

This document explains how to deploy it using the podman container manager.

Setup your server, login via SSH and copy the repository tarball.

I will be using a system user with id 1000 and group-id 1000, to avoid using the privileged root user.

## Build images

```sh
cd be && podman build --no-cache -t "login-swr-be" .
cd fe && podman build --no-cache -t "login-swr-fe" .
```

## Create volumes

```sh
podman volume create login-swr-be-data
```

## Start backend service

Create a `.env` file and setup the needed environment variables that are specified on the [README](./README.md) document.

```sh
cd be/
podman run -d -p 127.0.0.1:3002:3002 -v login-swr-be-data:/app/data --user 1001:1001 --env-file ./.env login-swr-be
```

Check the container is running

```sh
podman ps
```

```
CONTAINER ID  IMAGE                          COMMAND               CREATED         STATUS            PORTS                     NAMES
65d01f95ba72  localhost/login-swr-be:latest  node dist/index.j...  13 seconds ago  Up 4 seconds ago  127.0.0.1:3002->3002/tcp  infallible_hypatia
```

## Start front-end service

Create a `.env.local` file and setup the needed environment variables that are specified on the [README](./README.md) document.

```sh
cd fe/
podman run -d -p 127.0.0.1:3000:3000 --user 1001:1001 --env-file ./.env.local login-swr-fe
```

Check the container is running

```sh
podman ps
```

```
CONTAINER ID  IMAGE                          COMMAND               CREATED         STATUS             PORTS                     NAMES
761c463e020e  localhost/login-swr-fe:latest  node server.js        21 seconds ago  Up 11 seconds ago  127.0.0.1:3000->3000/tcp  quizzical_spence
```

## Setup reverse proxy

For this I am using the [Caddy](https://caddyserver.com/) server but setting up nginx should be very similar.

First don't forget to open relevant ports on your service firewall or using `ufw`

```sh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

Let's edit the Caddyfile

```sh
sudo nano /etc/caddy/Caddyfile
```

Example contents:

```
login-swr.yourdomain.tld {
  reverse_proxy localhost:3000
}

api.login-swr.yourdomain.tld {
  reverse_proxy localhost:3002
}
```

```sh
sudo systemctl enable --now caddy.service
```

## Setup systemd unit services

Before doing this, you should stop the podman containers if they are running.

To allow services to autostart, we are gonna create systemd user service units.

```sh
mkdir -p ~/.config/systemd/user
cd ~/.config/systemd/user
```

Create the following file `login-swr-be.service`:

Example contents:

```
[Unit]
Description=login-swr-be
After=network.target

[Service]
WorkingDirectory=/home/user/host/login-next-swr-node/be
Restart=always
ExecStartPre=-/usr/bin/podman rm "container-login-swr-be"
ExecStart=/usr/bin/podman run --name container-login-swr-be -p 127.0.0.1:3002:3002 -v login-swr-be-data:/app/data --user 1001:1001 --env-file ./.env login-swr-be
ExecStop=/usr/bin/podman stop "container-login-swr-be"

[Install]
WantedBy=default.target
```

Please replace "/home/user" with the appropriate home user directory.

Create the following file `login-swr-fe.service`:

Example contents:

```
[Unit]
Description=login-swr-fe
After=network.target

[Service]
WorkingDirectory=/home/user/host/login-next-swr-node/fe
Restart=always
ExecStartPre=-/usr/bin/podman rm "container-login-swr-fe"
ExecStart=/usr/bin/podman run --name container-login-swr-fe -p 127.0.0.1:3002:3002 --user 1001:1001 --env-file ./.env.local login-swr-fe
ExecStop=/usr/bin/podman stop "container-login-swr-fe"

[Install]
WantedBy=default.target
```

Please replace "/home/user" with the appropriate home user directory.

Enable the services:

```sh
systemd --user enable login-swr-be
systemd --user enable login-swr-fe
```

Start the services:

```sh
systemd --user start login-swr-be
systemd --user start login-swr-fe
```

Allow the user to auto-start its service units:

```sh
sudo loginctl enable-linger username
```
