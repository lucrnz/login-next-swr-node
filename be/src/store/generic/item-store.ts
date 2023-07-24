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

import { IItemStringEncoderDecoder } from "../../types/IItemStringEncoder.js";
import { GenericBytesStore } from "./fs-bytes-store.js";

interface HasId {
  id: string;
}

type ItemMetaData = {
  entityName: string;
  itemId: string;
  discriminator?: string;
};

type SerializedItemMetaData = {
  Item1: string; // EntityName
  Item2: string; // ItemId
  Item3: string; // Discriminator
};

/**
 * This class is for storing Items of an specific type that have an Id.
 * Plus additionally a discriminator.
 */
export default class GenericItemStore<ItemType extends HasId> {
  constructor(
    private bytesStore: GenericBytesStore,
    private entityName: string,
    private itemEncoderDecoder: IItemStringEncoderDecoder<ItemType>,
    private metadataEncoderDecoder: IItemStringEncoderDecoder<SerializedItemMetaData>,
    private discriminator?: string
  ) {}

  private async getItemStoreName(itemId: ItemType["id"]) {
    const metaData = {
      Item1: this.entityName,
      Item2: itemId,
      Item3: this.discriminator ?? ""
    } as SerializedItemMetaData;

    return await this.metadataEncoderDecoder.Encode(metaData);
  }

  async Write(item: ItemType) {
    const itemStoreName = await this.getItemStoreName(item.id);
    const encodedItem = await this.itemEncoderDecoder.Encode(item);
    const data = Buffer.from(encodedItem, "utf-8");
    await this.bytesStore.Write(itemStoreName, data);
  }

  async Read(itemId: ItemType["id"]) {
    const itemStoreName = await this.getItemStoreName(itemId);

    if (!(await this.bytesStore.Exists(itemStoreName))) {
      return null;
    }

    const savedItemBuffer = await this.bytesStore.Read(itemStoreName);
    const item = await this.itemEncoderDecoder.Decode(
      savedItemBuffer.toString()
    );
    return item;
  }

  async Delete(itemId: ItemType["id"]) {
    const itemStoreName = await this.getItemStoreName(itemId);

    if (await this.bytesStore.Exists(itemStoreName)) {
      await this.bytesStore.Delete(itemStoreName);
    }
  }

  async ListAll() {
    const result = [] as ItemMetaData[];
    const items = await this.bytesStore.ListAll();

    for (const encodedMetaData of items) {
      const metaData = await this.metadataEncoderDecoder.Decode(
        encodedMetaData
      );

      const entityName = metaData.Item1;

      if (this.entityName !== entityName) {
        continue;
      }

      const item = {
        entityName: entityName,
        itemId: metaData.Item2,
        discriminator: metaData.Item3.length > 0 ? metaData.Item3 : undefined
      } as ItemMetaData;

      const pushItem =
        this.discriminator && item.discriminator
          ? item.discriminator === this.discriminator
          : true;

      if (pushItem) {
        result.push(item);
      }
    }

    return result;
  }

  async Exists(itemId: ItemType["id"]) {
    const itemStoreName = await this.getItemStoreName(itemId);
    return await this.bytesStore.Exists(itemStoreName);
  }

  async FindByContents(
    matcher: (item: ItemType) => Promise<boolean> | boolean
  ) {
    let foundItem: ItemType | null = null;
    const itemMetaList = await this.ListAll();

    for (const { itemId } of itemMetaList) {
      const item = await this.Read(itemId);

      if (!item) {
        continue;
      }

      const matcherResult = matcher(item);

      const matches =
        matcherResult instanceof Promise ? await matcherResult : matcherResult;

      if (matches) {
        foundItem = item;
        break;
      }
    }

    return foundItem;
  }

  async FindByMetaData(
    matcher: (itemMetaData: ItemMetaData) => Promise<boolean> | boolean
  ) {
    let foundItem: ItemType | null = null;
    const itemMetaList = await this.ListAll();

    for (const itemMetaData of itemMetaList) {
      const matcherResult = matcher(itemMetaData);

      const matches =
        matcherResult instanceof Promise ? await matcherResult : matcherResult;

      if (matches) {
        foundItem = await this.Read(itemMetaData.itemId);
        break;
      }
    }

    return foundItem;
  }
}
