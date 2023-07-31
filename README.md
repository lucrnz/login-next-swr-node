# login-next-swr-node : Notes App

A full stack application to practice authenticantion using JWT tokens and setting an http-only cookie.

There is a backend written with Node and a front-end written using [Next.js](https://nextjs.org/)

## Why does this exist?

There are multiple cases where your project will have a backend team with an API made with their preffered language (such as Java, C#, or even JavaScript).

**New:** For an example C# back-end [see this repo](https://github.com/lucrnz/notes-be-cs)

And the front-end team will opt to use Next js to be able to use SSR and other features that are nicer than default React.

In this example, our backend team (an Express api) is setting a cookie, and we (the front-end team) have to use that api via our proxy (`pages/api/*`) and respect the user cookies.

## Prerequisites

Note: **Nix with direnv users:** Just by doing `direnv allow` in this directory the setup will be done and you can skip any install.

You need [Node.js](https://nodejs.org/en) latest LTS version.

## Development

Make sure to setup backend environment variables, by following [this guide](./doc/env-vars.md)

On the **project root** folder:

```sh
npm install
npm start
```

If you need local HTTPS for the development server you might use the supplied [Caddyfile](./Caddyfile)

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

## Notice

This is a hobby project, I have the right to not give documentation and/or provide support. Thank you!

## Copying

Read the [LICENSE](./LICENSE) file for more information.
