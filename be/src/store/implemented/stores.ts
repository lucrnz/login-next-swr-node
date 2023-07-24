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

import type { Note, SystemConfigValue, User } from "../../types/Entities.js";

import dotenv from "dotenv";

import {
  HexJSONItemEncoderDecoder,
  JSONItemEncoderDecoder
} from "../../util/Encoding.js";
import {
  FileSystemBytesStore,
  GenericBytesStore
} from "../generic/fs-bytes-store.js";
import GenericItemStore from "../generic/item-store.js";
import PasswordGenerator from "../../util/passwordGenerator.js";
import ConfigStore, { ConfigStoreVariable } from "./config-store.js";
import UserStore from "./user-store.js";

export enum EnvironmentVariable {
  Port = "Port",
  JwtSecret = "JwtSecret",
  JwtExpireTime = "JwtExpireTime",
  NodeEnv = "NodeEnv",
  DataFolder = "DataFolder",
  CreateAdminUser = "CreateAdminUser"
}

export default class Store {
  private static instance: Store;
  private static initialized = false;

  private bytesStore: GenericBytesStore | null = null;

  private configStore: ConfigStore | null = null;

  private userStore: UserStore | null = null;

  private envVarsGetters: Record<
    EnvironmentVariable,
    () => string | Promise<string>
  > = {
    [EnvironmentVariable.Port]: () => process.env.PORT ?? "3002",
    [EnvironmentVariable.JwtSecret]: async () =>
      process.env["JWT_SECRET"] ?? (await this.generateAndStoreJWTSecret()),
    [EnvironmentVariable.JwtExpireTime]: () =>
      process.env["JWT_EXPIRE_TIME"] ?? "1h",
    [EnvironmentVariable.NodeEnv]: () =>
      (process.env["NODE_ENV"] ?? "development").toLowerCase(),
    [EnvironmentVariable.DataFolder]: () =>
      process.env["DATA_FOLDER"] ?? "./data",
    [EnvironmentVariable.CreateAdminUser]: () =>
      process.env["CREATE_ADMIN_USER"] ?? "true"
  };

  private envVarsValues: Map<string, string> = new Map<string, string>();

  private async generateAndStoreJWTSecret() {
    if (this.configStore === null) {
      throw new Error("configStore is null");
    }

    const sysCfgItemId = this.configStore.ConfigItemId.get(
      ConfigStoreVariable.JwtSecret
    )!;

    const cfgStore = this.configStore.Store;

    if (await cfgStore.Exists(sysCfgItemId)) {
      const cfgItem = await cfgStore.Read(sysCfgItemId);
      console.log("JwtSecret loaded from the database.");
      return cfgItem!.value;
    }

    const cfgItem = {
      id: sysCfgItemId,
      value: PasswordGenerator.GenerateComplexPassword()
    } as SystemConfigValue;

    await cfgStore.Write(cfgItem);
    console.log("JwtSecret generated and stored in the database.");
    return cfgItem.value;
  }

  private constructor() {}

  private async initialize() {
    if (Store.initialized) {
      return;
    }

    try {
      dotenv.config();

      const getDataFolder = this.envVarsGetters[EnvironmentVariable.DataFolder];
      this.bytesStore = new FileSystemBytesStore(getDataFolder() as string);
      this.configStore = new ConfigStore(this.bytesStore);

      Store.initialized = true;

      for (const [variableName, getValue] of Object.entries(
        this.envVarsGetters
      )) {
        let value = getValue();
        value = value instanceof Promise ? await value : value;
        this.envVarsValues.set(variableName, value);
      }

      this.userStore = new UserStore(this.bytesStore);
    } catch (e) {
      Store.initialized = false;
      throw e;
    }
  }

  static async GetInstance() {
    if (!Store.instance) {
      Store.instance = new Store();
    }

    if (!Store.initialized) {
      await Store.instance.initialize();
    }

    return Store.instance;
  }

  GetNoteStoreForUser(userId: User["id"]) {
    if (!Store.initialized || !this.bytesStore) {
      throw new Error("Not initialized");
    }

    return new GenericItemStore<Note>(
      this.bytesStore,
      "Note",
      new JSONItemEncoderDecoder(),
      new HexJSONItemEncoderDecoder(),
      userId
    );
  }

  get ConfigStore() {
    if (!Store.initialized || !this.configStore) {
      throw new Error("Not initialized");
    }

    return this.configStore;
  }

  get UserStore() {
    if (!Store.initialized || !this.userStore) {
      throw new Error("Not initialized");
    }

    return this.userStore;
  }

  GetEnvironmentVariable(variableName: EnvironmentVariable): string {
    if (!Store.initialized) {
      throw new Error("Not initialized");
    }

    return this.envVarsValues.get(variableName) ?? "";
  }
}
