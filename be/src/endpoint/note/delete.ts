import { Response } from "express";
import { ApiResponse, ApiStatusMessage } from "../../types/Api.js";
import { AuthenticatedRequest } from "../../types/AuthenticatedRequest.js";
import { Note } from "../../types/Note.js";
import {
  deleteNote,
  deleteNoteFileNotExistsErrorMessage
} from "../../lib/note.js";
import { StatusCode } from "status-code-enum";

export async function deleteNoteEndpointHandler(
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
    await deleteNote(user.id, noteId);
  } catch (err) {
    console.error(err);

    if (
      err instanceof Error &&
      (err as Error).message === deleteNoteFileNotExistsErrorMessage
    ) {
      res.status(StatusCode.ClientErrorNotFound).json({
        success: false,
        message: "Not found"
      } as ApiStatusMessage);
      return;
    }

    res.status(StatusCode.ServerErrorInternal).json({
      success: false,
      message: "Internal server error"
    } as ApiStatusMessage);
    return;
  }

  res.status(StatusCode.SuccessOK).json({
    success: true,
    data: null
  } as ApiResponse<null>);
}
