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

import { FileSystemBytesStore } from "../generic/fs-bytes-store.js";
import { Note } from "../../../types/Entities.js";
import {
  User,
  UserWithPassword,
  SystemConfigValue
} from "../../../types/Entities.js";
import GenericItemStore from "../generic/item-store.js";
import {
  HexJSONItemEncoderDecoder,
  JSONItemEncoderDecoder
} from "../../../util/Encoding.js";
import { EnvironmentVariable, getEnvironmentVariable } from "../../../env.js";

export const defaultFsBytesStore = new FileSystemBytesStore(
  getEnvironmentVariable(EnvironmentVariable.DataFolder) as string
);

export const configStore = new GenericItemStore<SystemConfigValue>(
  defaultFsBytesStore,
  "sys-cfg",
  new JSONItemEncoderDecoder(),
  new HexJSONItemEncoderDecoder()
);

export const userStore = new GenericItemStore<UserWithPassword>(
  defaultFsBytesStore,
  "user",
  new JSONItemEncoderDecoder(),
  new HexJSONItemEncoderDecoder()
);

export function getNoteStoreForUser(userId: User["id"]) {
  return new GenericItemStore<Note>(
    defaultFsBytesStore,
    "note",
    new JSONItemEncoderDecoder(),
    new HexJSONItemEncoderDecoder(),
    userId
  );
}
