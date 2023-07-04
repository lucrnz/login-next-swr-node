# login-next-swr-node

A full stack application to practice authenticantion using JWT tokens and setting an http-only cookie.

There is a backend written with Node and a front-end written using [Next.js](https://nextjs.org/)

## Why does this exist?

There are multiple cases where your project will have a backend team with an API made with their preffered language (such as Java, C#, or even JavaScript).

And the front-end team will opt to use Next js to be able to use SSR and other features that are nicer than default React.

In this example, our backend team (an Express api) is setting a cookie, and we (the front-end team) have to use that api via our proxy (`pages/api/*`) and respect the user cookies.

## Prerequisites

Note: **Nix with direnv users:** Just by doing `direnv allow` in this directory the setup will be done and you can skip any install.

You need [Node.js](https://nodejs.org/en) latest LTS version.

## Development

Make sure to setup the backend environment variables.

For the _backend_: change the values by creating the file `be/.env`:

```sh
JWT_SECRET=<your secret>
JWT_EXPIRE_TIME=1h
```

Secret must be a generated password, expire time can be described as needed by the [vercel/ms](https://github.com/vercel/ms) library.

For the _frontend_: change the values by creating the file `fe/.env.local`:

```sh
BE_URL=http://localhost:3002
```

This variable must reflect the URL of the backend.

For [hCaptcha](https://hcaptcha.com/) support, set the following variables:

```
NEXT_PUBLIC_ENABLE_CAPTCHA=true
NEXT_PUBLIC_HCAPTCHA_SITEKEY=<hcaptcha_sitekey>
HCAPTCHA_SECRET=<hcaptcha_secret>
```

On the **project root** folder:

```sh
npm install
npm start
```

If you need local HTTPS for the development server you might used the supplied [Caddyfile](./Caddyfile)

```sh
caddy run --config Caddyfile
```

Then access the site using the URL `login-swr.localhost`

_Note_: Firefox users need to enable the flag `security.enterprise_roots.enabled` to `true` by accessing `about:config` in the URL bar.

## Assets Attribution

The front-end code imports the following icons:

- [Notebook](https://www.flaticon.com/free-icons/notebook) icon created by Freepik - Flaticon
- [Pencil](https://pictogrammers.com/library/mdi/icon/pencil/) icon by Google - Material design

## Deployment

If you choose to use containers, check out the [containers guide](./doc/deploy/containers.md).

Or you can run node directly on the server, check out [traditional guide](./doc/deploy/traditional.md).

Lastly, don't forget to setup the [reverse proxy](./doc/deploy/reverse-proxy.md)

## Copying

Read the [LICENSE](./LICENSE) file for more information.
