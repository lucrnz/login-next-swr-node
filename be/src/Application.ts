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

import type { Express } from "express";

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
import PasswordGenerator from "./util/passwordGenerator.js";
import { UserWithPassword } from "./types/Entities.js";

export default class Application {
  private expressApp: Express;
  private store: Store;
  private configured = false;
  private listenPort: number | null = null;

  constructor(store: Store) {
    this.expressApp = express();
    this.store = store;
  }

  private async createAdminUser() {
    const envVarValue = this.store
      .GetEnvironmentVariable(EnvironmentVariable.CreateAdminUser)
      .toLowerCase();
    const shouldCreateUser = envVarValue === "true" || envVarValue === "1";

    if (!shouldCreateUser) {
      return;
    }

    const adminUserEmail = "admin@localhost";
    const userId = "0ea8a35e-d241-4b9b-a32d-ad93b0b6c840";
    const userExists = await this.store.UserStore.Store.Exists(userId);

    if (!userExists) {
      const adminUserPassword = PasswordGenerator.GenerateComplexPassword(24);

      await this.store.UserStore.RegisterUser({
        id: userId,
        email: adminUserEmail,
        name: "Admin",
        password: adminUserPassword
      } as UserWithPassword);

      console.log(
        `Generated Admin User. Email: ${adminUserEmail} Password: ${adminUserPassword}`
      );
    }
  }

  Configure() {
    if (this.configured) {
      return;
    }

    this.listenPort = Number(
      this.store.GetEnvironmentVariable(EnvironmentVariable.Port)
    );

    this.expressApp.use(cors());
    this.expressApp.use(express.json());
    this.expressApp.use(cookieParser());

    this.expressApp.get("/", indexEndpointHandler);

    this.expressApp.post("/login", loginEndpointHandler);
    this.expressApp.post("/logout", logoutEndpointHandler);

    this.expressApp.post("/signup", signUpEndpointHandler);

    this.expressApp.get("/me", authenticate, meEndpointHandler);
    this.expressApp.get("/hello", authenticate, helloEndpointHandler);

    this.expressApp.get("/note", authenticate, getNoteEndpointHandler);
    this.expressApp.get("/note/list", authenticate, getNoteListEndpointHandler);
    this.expressApp.post("/note", authenticate, postNoteEndpointHandler);
    this.expressApp.delete("/note", authenticate, deleteNoteEndpointHandler);
  }

  async Listen() {
    await this.createAdminUser();
    this.expressApp.listen(this.listenPort, () => {
      console.log(`API Server running at http://localhost:${this.listenPort}`);
    });
  }
}
