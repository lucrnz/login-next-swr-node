import { Response } from "express";
import { ApiResponse, ApiStatusMessage } from "../../types/Api.js";
import { AuthenticatedRequest } from "../../types/AuthenticatedRequest.js";
import { Note } from "../../types/Note.js";
import { readNote } from "../../lib/note.js";
import { StatusCode } from "status-code-enum";
import { newStatusMessage } from "../../util/newStatusMessage.js";

export async function getNoteEndpointHandler(
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
    note = await readNote(user.id, noteId);
  } catch (err) {
    console.error(err);
    return res
      .status(StatusCode.ServerErrorInternal)
      .json(newStatusMessage(false, "Internal server error"));
  }

  if (note === null) {
    return res
      .status(StatusCode.ClientErrorNotFound)
      .json(newStatusMessage(false, "Not found"));
  }

  res.status(StatusCode.SuccessOK).json({
    success: true,
    data: note
  } as ApiResponse<Note>);
}
