import { Response } from "express";
import { ApiResponse, ApiStatusMessage } from "../../../types/Api.js";
import { AuthenticatedRequest } from "../../../types/AuthenticatedRequest.js";
import { StatusCode } from "status-code-enum";
import { listNotesForUser } from "../../../lib/note.js";
import { Note } from "../../../types/Note.js";

export async function getNoteListEndpointHandler(
  req: AuthenticatedRequest,
  res: Response
) {
  const user = req.user!;

  let result: Note["id"][] = [];

  try {
    const list = await listNotesForUser(user.id);

    for (const noteId of list) {
      result.push(noteId);
    }
  } catch (err) {
    console.error(err);
    res.status(StatusCode.ServerErrorInternal).json({
      success: false,
      message: "Internal server error"
    } as ApiStatusMessage);
    return;
  }

  res.status(StatusCode.SuccessOK).json({
    success: true,
    data: result
  } as ApiResponse<Note["id"][]>);
}
