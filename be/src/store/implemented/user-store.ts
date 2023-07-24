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

import type { UserWithPassword } from "../../types/Entities.js";
import type { GenericBytesStore } from "../generic/fs-bytes-store.js";
import {
  HexJSONItemEncoderDecoder,
  JSONItemEncoderDecoder
} from "../../util/Encoding.js";
import GenericItemStore from "../generic/item-store.js";
import hashPassword from "../../util/hashPassword.js";

export default class UserStore {
  private store: GenericItemStore<UserWithPassword> | null = null;

  constructor(bytesStore: GenericBytesStore) {
    this.store = new GenericItemStore(
      bytesStore,
      "User",
      new JSONItemEncoderDecoder<UserWithPassword>(),
      new HexJSONItemEncoderDecoder()
    );
  }

  get Store() {
    if (!this.store) {
      throw new Error("store is null");
    }

    return this.store;
  }

  /**
   * @param userData User Data, Password should not be hashed.
   */
  async RegisterUser(userData: UserWithPassword) {
    if (!this.store) {
      throw new Error("store is nulll");
    }

    if (await this.store.Exists(userData.id)) {
      throw Error("User already exists");
    }

    await this.store.Write({
      ...userData,
      password: await hashPassword(userData.password)
    } as UserWithPassword);
  }

  /**
   * This function is to check if user login data is correct.
   * @param email User email
   * @param password User password (should not be hashed)
   * @returns User entity if valid else null
   */
  async ValidateUserLogin(
    email: UserWithPassword["email"],
    password: UserWithPassword["password"]
  ) {
    if (!this.store) {
      throw new Error("store is nulll");
    }

    const foundUser = await this.store.FindByContents(
      (item) => item.email === email
    );

    let validPassword = false;

    if (foundUser) {
      const passwordHash = await hashPassword(password);
      validPassword = foundUser.password === passwordHash;
    }

    return foundUser && validPassword ? foundUser : null;
  }

  /**
   * @param email User email
   * @returns User entity if exists, null if not.
   */
  async FindUserByEmail(email: UserWithPassword["email"]) {
    if (!this.store) {
      throw new Error("store is nulll");
    }

    const foundUser = await this.store.FindByContents(
      (item) => item.email === email
    );

    return foundUser;
  }
}
