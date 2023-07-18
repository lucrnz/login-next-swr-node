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

import { Response } from "express";
import { ApiResponse } from "../../../types/Api.js";
import { AuthenticatedRequest } from "../../../types/Api.js";
import { StatusCode } from "status-code-enum";
import { Note } from "../../../types/Entities.js";
import newStatusMessage from "../../../util/newStatusMessage.js";
import { getNoteStoreForUser } from "../../../lib/store/implemented/stores.js";

export default async function getNoteListEndpointHandler(
  req: AuthenticatedRequest,
  res: Response
) {
  const user = req.user!;

  let result: Note["id"][] = [];

  const noteStore = getNoteStoreForUser(user.id);

  try {
    const list = await noteStore.ListAll();

    for (const { itemId } of list) {
      result.push(itemId);
    }
  } catch (err) {
    console.error(err);
    return res
      .status(StatusCode.ServerErrorInternal)
      .json(newStatusMessage(false, "Internal server error"));
  }

  res.status(StatusCode.SuccessOK).json({
    success: true,
    data: result
  } as ApiResponse<Note["id"][]>);
}
