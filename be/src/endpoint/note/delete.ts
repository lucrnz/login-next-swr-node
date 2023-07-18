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
import { AuthenticatedRequest } from "../../types/Api.js";
import { StatusCode } from "status-code-enum";
import newStatusMessage from "../../util/newStatusMessage.js";
import { FileSystemBytesStoreErrors } from "../../lib/store/generic/fs-bytes-store.js";
import { getNoteStoreForUser } from "../../lib/store/implemented/stores.js";

export default async function deleteNoteEndpointHandler(
  req: AuthenticatedRequest,
  res: Response
) {
  const user = req.user!;
  const noteId = req.query.id;
  const validNoteId = typeof noteId === "string" && noteId.length > 0;

  if (!validNoteId) {
    return res
      .status(StatusCode.ClientErrorBadRequest)
      .json(newStatusMessage(false, "Bad request"));
  }

  const noteStore = getNoteStoreForUser(user.id);

  try {
    await noteStore.Delete(noteId);
  } catch (err) {
    console.error(err);

    if (
      err instanceof Error &&
      (err as Error).message === FileSystemBytesStoreErrors.itemNotExists
    ) {
      return res
        .status(StatusCode.ClientErrorNotFound)
        .json(newStatusMessage(false, "Not found"));
    }

    return res
      .status(StatusCode.ServerErrorInternal)
      .json(newStatusMessage(false, "Internal server error"));
  }

  res.status(StatusCode.SuccessOK).json(newStatusMessage(true, "Note deleted"));
}
