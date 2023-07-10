# How to deploy

Setup your server, login via SSH and copy the repository tarball.

I will be using a system user with id 1000 and group-id 1000, to avoid using the privileged root user.

## Install Node

Get Node.js latest LTS version, this guide is useful for the Linux distributions Ubuntu and Debian.

You can check [Nodesource Github repo](https://github.com/nodesource/distributions) for more information.

```sh
sudo apt install -y curl
```

Current version is 18.x

```sh
curl -sL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
```

Check versions:

```sh
node --version
npm --version
```

## Instal package depencies

Navigate to the source project directory and run:

```sh
npm -w be ci --frozen-lockfile
npm -w fe ci --frozen-lockfile
```

## Setup environment variables

Make sure to setup the environment variables, by following [this guide](../env-vars.md)

## Build the projects

```sh
npm -w be run build
npm -w fe run build
```

The front-end needs an aditional step:

```sh
ln -s $PWD/fe/.next/static $PWD/fe/.next/standalone/.next/static
cp -av $PWD/fe/public $PWD/fe/.next/standalone/
```

## Setup systemd unit services

You can read more about [systemd user units here](https://wiki.archlinux.org/title/systemd/User).

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
Environment=NODE_ENV=production
ExecStart=/usr/bin/node dist/index.js
Restart=always

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
WorkingDirectory=/home/user/host/login-next-swr-node/fe/.next/standalone
Environment=NODE_ENV=production
EnvironmentFile=/home/user/host/login-next-swr-node/fe/.env.local
ExecStart=/usr/bin/node server.js
Restart=always

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

## Reminder about reverse-proxy

Don't forget to check the documentation on the [reverse proxy](./reverse-proxy.md)

Note: In this setup, you might not need to expose the backend directly to the outer network, unless you really need it.
You can point the front-end to use the localhost API port.
