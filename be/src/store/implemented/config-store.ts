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

import type { SystemConfigValue } from "../../types/Entities.js";
import type { GenericBytesStore } from "../generic/fs-bytes-store.js";
import {
  HexJSONItemEncoderDecoder,
  JSONItemEncoderDecoder
} from "../../util/Encoding.js";
import GenericItemStore from "../generic/item-store.js";

export enum ConfigStoreVariable {
  PasswordHashSalt = "PasswordHashSalt",
  JwtSecret = "JwtSecret"
}

export default class ConfigStore {
  private configItemId: Readonly<Map<ConfigStoreVariable, string>> = new Map<
    ConfigStoreVariable,
    string
  >([
    [
      ConfigStoreVariable.PasswordHashSalt,
      "0a9b3d56-1891-40f6-b005-901a772af78d"
    ],
    [ConfigStoreVariable.JwtSecret, "f1be8c81-390a-4ae9-ace5-14e477503a0d"]
  ]);

  private store: GenericItemStore<SystemConfigValue> | null = null;

  constructor(bytesStore: GenericBytesStore) {
    this.store = new GenericItemStore<SystemConfigValue>(
      bytesStore,
      "SystemConfigValue",
      new JSONItemEncoderDecoder(),
      new HexJSONItemEncoderDecoder()
    );
  }

  get Store() {
    if (!this.store) {
      throw new Error();
    }
    return this.store;
  }

  get ConfigItemId() {
    return this.configItemId;
  }
}
