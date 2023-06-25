import { Response } from "express";
import { ApiResponse, ApiStatusMessage } from "../../types/Api.js";
import { AuthenticatedRequest } from "../../types/AuthenticatedRequest.js";
import { Note } from "../../types/Note.js";
import { readNote } from "../../lib/note.js";
import { StatusCode } from "status-code-enum";

export async function getNoteEndpointHandler(
  req: AuthenticatedRequest,
  res: Response
) {
  const user = req.user!;

  const noteId = req.query.id;
  const validNoteId = typeof noteId === "string" && noteId.length > 0;

  if (!validNoteId) {
    res.status(StatusCode.ClientErrorBadRequest).json({
      success: false,
      message: "Bad request"
    } as ApiStatusMessage);
    return;
  }

  let note: Note | null = null;

  try {
    note = await readNote(user.id, noteId);
  } catch (err) {
    console.error(err);
    res.status(StatusCode.ServerErrorInternal).json({
      success: false,
      message: "Internal server error"
    } as ApiStatusMessage);
    return;
  }

  if (note === null) {
    res.status(StatusCode.ClientErrorNotFound).json({
      success: false,
      message: "Not found"
    } as ApiStatusMessage);
    return;
  }

  res.status(StatusCode.SuccessOK).json({
    success: true,
    data: note
  } as ApiResponse<Note>);
}
