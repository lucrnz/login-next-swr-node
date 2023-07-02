# Setup reverse proxy

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
