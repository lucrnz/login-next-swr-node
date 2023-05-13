import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import { loginEndpointHandler } from "./endpoint/login.js";
import { logoutEndpointHandler } from "./endpoint/logout.js";
import { authenticate } from "./middleware/authenticate.js";
import { meEndpointHandler } from "./endpoint/me.js";
import { fooEndpointHandler } from "./endpoint/foo.js";
import { EnvironmentVariable, getEnv } from "./env.js";
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.post("/login", loginEndpointHandler);
app.post("/logout", logoutEndpointHandler);

app.get("/me", authenticate, meEndpointHandler);
app.get("/foo", authenticate, fooEndpointHandler);

const port = getEnv(EnvironmentVariable.Port) as number;

app.listen(port, () =>
  console.log(`Server running at http://localhost:${port}`)
);
