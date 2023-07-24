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
import { StatusCode } from "status-code-enum";
import { v4 as uuidv4 } from "uuid";
import {
  ApiBodyPostNote,
  ApiResponse,
  ApiResponsePostNote,
  AuthenticatedRequest
} from "../../types/Api.js";
import Store from "../../store/implemented/stores.js";
import { Note } from "../../types/Entities.js";
import newStatusMessage from "../../util/newStatusMessage.js";

export default async function postNoteEndpointHandler(
  req: AuthenticatedRequest,
  res: Response
) {
  const store = await Store.GetInstance();
  const user = req.user!;
  const body = req.body as ApiBodyPostNote;

  const noteStore = store.GetNoteStoreForUser(user.id);

  let noteId: Note["id"] | null = null;

  try {
    const { note } = body;

    if (note.id.length === 0) {
      note.id = uuidv4();
    }

    noteId = note.id;

    await noteStore.Write(note);
  } catch (err) {
    console.error(err);
    return res
      .status(StatusCode.ServerErrorInternal)
      .json(newStatusMessage(false, "Internal server error"));
  }

  res.status(StatusCode.SuccessCreated).json({
    success: true,
    data: {
      noteId: noteId!
    }
  } as ApiResponse<ApiResponsePostNote>);
}
