# Environment variables

## Backend

Change the values by creating the file `be/.env`:

```sh
JWT_SECRET=<your secret>
JWT_EXPIRE_TIME=1h
```

Secret must be a generated password, expire time can be described as needed by the [vercel/ms](https://github.com/vercel/ms) library.

## Frontend

Change the values by creating the file `fe/.env.local`:

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
