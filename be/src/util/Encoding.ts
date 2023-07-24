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

import type {
  IItemStringDecoder,
  IItemStringEncoder
} from "../types/IItemStringEncoder.js";

export class HexJSONItemEncoderDecoder<ItemType>
  implements IItemStringEncoder<ItemType>, IItemStringDecoder<ItemType>
{
  async Encode(item: ItemType) {
    return Buffer.from(JSON.stringify(item), "utf8").toString("hex");
  }

  async Decode(encoded: string) {
    const jsonString = Buffer.from(encoded, "hex").toString("utf-8");
    return JSON.parse(jsonString) as ItemType;
  }
}

export class JSONItemEncoderDecoder<ItemType>
  implements IItemStringEncoder<ItemType>, IItemStringDecoder<ItemType>
{
  async Encode(item: ItemType) {
    return JSON.stringify(item);
  }

  async Decode(encoded: string) {
    return JSON.parse(encoded) as ItemType;
  }
}
