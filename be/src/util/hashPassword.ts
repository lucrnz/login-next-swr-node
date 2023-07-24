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

import type { SystemConfigValue } from "../types/Entities.js";
import { randomBytes, scryptSync } from "crypto";
import Store, { ConfigStoreVariable } from "../store/implemented/stores.js";

async function getPasswordSalt() {
  const store = await Store.GetInstance();
  const sysCfgItemId = store.ConfigStore.ConfigItemId.get(
    ConfigStoreVariable.PasswordHashSalt
  )!;

  const cfgStore = store.ConfigStore.Store;

  if (await cfgStore.Exists(sysCfgItemId)) {
    const cfgItem = await cfgStore.Read(sysCfgItemId);
    return cfgItem!.value;
  }

  const cfgItem = {
    id: sysCfgItemId,
    value: randomBytes(64).toString("hex")
  } as SystemConfigValue;

  await cfgStore.Write(cfgItem);

  return cfgItem.value;
}

export default async function hashPassword(value: string) {
  const salt = await getPasswordSalt();
  return scryptSync(value, salt, 64).toString("base64");
}
