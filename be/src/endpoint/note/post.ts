import { Response } from "express";
import {
  ApiBodyPostNote,
  ApiResponse,
  ApiResponsePostNote,
  ApiStatusMessage
} from "../../types/Api.js";
import { AuthenticatedRequest } from "../../types/AuthenticatedRequest.js";
import { StatusCode } from "status-code-enum";
import { v4 as uuidv4 } from "uuid";
import { writeNote } from "../../lib/note.js";
import { Note } from "../../types/Note.js";
import { newStatusMessage } from "../../util/newStatusMessage.js";

export async function postNoteEndpointHandler(
  req: AuthenticatedRequest,
  res: Response
) {
  const user = req.user!;
  const body = req.body as ApiBodyPostNote;

  let noteId: Note["id"] | null = null;

  try {
    const { note } = body;

    note.id = uuidv4();
    noteId = note.id;

    await writeNote(user.id, note);
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
