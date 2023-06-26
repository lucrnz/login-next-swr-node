import { Response } from "express";
import { AuthenticatedRequest } from "../../types/AuthenticatedRequest.js";
import { Note } from "../../types/Note.js";
import {
  deleteNote,
  deleteNoteFileNotExistsErrorMessage
} from "../../lib/note.js";
import { StatusCode } from "status-code-enum";
import { newStatusMessage } from "../../util/newStatusMessage.js";

export async function deleteNoteEndpointHandler(
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

  let note: Note | null = null;

  try {
    await deleteNote(user.id, noteId);
  } catch (err) {
    console.error(err);

    if (
      err instanceof Error &&
      (err as Error).message === deleteNoteFileNotExistsErrorMessage
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
