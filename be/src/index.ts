/*
 * Copyright 2023 lucdev<lucdev.net>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import indexEndpointHandler from "./endpoint/index.js";
import loginEndpointHandler from "./endpoint/login.js";
import logoutEndpointHandler from "./endpoint/logout.js";
import meEndpointHandler from "./endpoint/me.js";
import helloEndpointHandler from "./endpoint/hello.js";
import authenticate from "./middleware/authenticate.js";
import getNoteEndpointHandler from "./endpoint/note/get.js";
import getNoteListEndpointHandler from "./endpoint/note/list/get.js";
import postNoteEndpointHandler from "./endpoint/note/post.js";
import deleteNoteEndpointHandler from "./endpoint/note/delete.js";
import signUpEndpointHandler from "./endpoint/signup.js";
import Store, { EnvironmentVariable } from "./store/implemented/stores.js";

async function main() {
  const store = await Store.GetInstance();
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(cookieParser());

  app.get("/", indexEndpointHandler);

  app.post("/login", loginEndpointHandler);
  app.post("/logout", logoutEndpointHandler);

  app.post("/signup", signUpEndpointHandler);

  app.get("/me", authenticate, meEndpointHandler);
  app.get("/hello", authenticate, helloEndpointHandler);

  app.get("/note", authenticate, getNoteEndpointHandler);
  app.get("/note/list", authenticate, getNoteListEndpointHandler);
  app.post("/note", authenticate, postNoteEndpointHandler);
  app.delete("/note", authenticate, deleteNoteEndpointHandler);

  const port = Number(store.GetEnvironmentVariable(EnvironmentVariable.Port));

  app.listen(port, () => {
    console.log(`API Server running at http://localhost:${port}`);
  });
}

main();
