import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import { loginEndpointHandler } from "./endpoint/login.js";
import { logoutEndpointHandler } from "./endpoint/logout.js";
import { authenticate } from "./middleware/authenticate.js";
import { meEndpointHandler } from "./endpoint/me.js";
import { helloEndpointHandler } from "./endpoint/hello.js";
import { EnvironmentVariable, getEnv } from "./env.js";
import { postNoteEndpointHandler } from "./endpoint/note/post.js";
import { getNoteEndpointHandler } from "./endpoint/note/get.js";
import { getNoteListEndpointHandler } from "./endpoint/note/list/get.js";
import { deleteNoteEndpointHandler } from "./endpoint/note/delete.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.post("/login", loginEndpointHandler);
app.post("/logout", logoutEndpointHandler);

app.get("/me", authenticate, meEndpointHandler);
app.get("/hello", authenticate, helloEndpointHandler);

app.get("/note", authenticate, getNoteEndpointHandler);
app.get("/note/list", authenticate, getNoteListEndpointHandler);
app.post("/note", authenticate, postNoteEndpointHandler);
app.delete("/note", authenticate, deleteNoteEndpointHandler);

const port = getEnv(EnvironmentVariable.Port) as number;

app.listen(port, () =>
  console.log(`API Server running at http://localhost:${port}`)
);
