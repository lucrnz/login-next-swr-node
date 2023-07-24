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

import { randomBytes } from "crypto";

export default class PasswordGenerator {
  private static readonly defaultPasswordLength = 64;

  private static readonly passwordChars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+[]{}|;:,.<>?";

  public static GenerateComplexPassword(
    length: number = PasswordGenerator.defaultPasswordLength
  ): string {
    if (length <= 0) {
      throw new Error("Password length should be a positive integer.");
    }

    const randomBytesBuffer = randomBytes(length);
    const result: string[] = [];
    const charCount = PasswordGenerator.passwordChars.length;

    for (let i = 0; i < length; i++) {
      const randomByte = randomBytesBuffer.readUInt8(i);
      const index = randomByte % charCount;
      result.push(PasswordGenerator.passwordChars[index]);
    }

    return result.join("");
  }
}
