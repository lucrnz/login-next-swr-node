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

You need the [pnpm] package manager.

You can `enable` it via corepack:

```sh
corepack enable
corepack prepare pnpm@latest --activate
```

## Development

```sh
pnpm install
pnpm start
```

## Copying

Read the [LICENSE](./LICENSE) file for more information.
