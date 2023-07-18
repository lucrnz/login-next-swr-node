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

export enum EnvironmentVariable {
  Port,
  JwtSecret,
  JwtExpireTime,
  NodeEnv,
  DataFolder
}

const config = {
  [EnvironmentVariable.Port]: () => Number(process.env.PORT || 3001),
  [EnvironmentVariable.JwtSecret]: () => process.env["JWT_SECRET"]!,
  [EnvironmentVariable.JwtExpireTime]: () =>
    process.env["JWT_EXPIRE_TIME"] || "1h",
  [EnvironmentVariable.NodeEnv]: () =>
    (process.env["NODE_ENV"] || "development").toLowerCase(),
  [EnvironmentVariable.DataFolder]: () => process.env["DATA_FOLDER"] || "./data"
};

export function getEnvironmentVariable(key: EnvironmentVariable) {
  return config[key]();
}
