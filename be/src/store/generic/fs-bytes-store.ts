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

import { readFile, readdir, unlink, writeFile } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export interface GenericBytesStore {
  Write: (name: string, data: Uint8Array) => Promise<void>;
  Read: (name: string) => Promise<Uint8Array>;
  Delete: (name: string) => Promise<void>;
  Exists: (name: string) => Promise<boolean>;
  ListAll: () => Promise<string[]>;
}

export const FileSystemBytesStoreErrors = {
  itemNotExists: "Item does not exists"
};

export class FileSystemBytesStore implements GenericBytesStore {
  private prefix: string = "fsbs-";
  constructor(private dataFolder: string) {}

  private getItemFilePath(name: string) {
    return join(this.dataFolder, `${this.prefix}${name}`);
  }

  public async Write(name: string, data: Uint8Array) {
    const filePath = this.getItemFilePath(name);
    await writeFile(filePath, data, {
      encoding: "utf-8"
    });
  }

  public async Read(name: string) {
    const filePath = this.getItemFilePath(name);
    return await readFile(filePath);
  }

  public async ListAll() {
    return (await readdir(this.dataFolder, { encoding: "utf-8" }))
      .filter((value) => value.startsWith(this.prefix))
      .map((value) => value.split(this.prefix, 2).at(-1) as string);
  }

  public async Delete(name: string) {
    const filePath = this.getItemFilePath(name);

    if (!existsSync(filePath)) {
      throw new Error("Item does not exists");
    }

    await unlink(filePath);
  }

  public async Exists(name: string) {
    const filePath = this.getItemFilePath(name);
    return existsSync(filePath);
  }
}
