import { Note } from "@/types/Note";
import { fetchApi } from "./api";
import {
  ApiBodyPostNote,
  ApiResponsePostNote,
  ApiStatusMessage
} from "@/types/Api";

export async function saveNote(note: Note) {
  const { data: apiResult } = await fetchApi<
    ApiResponsePostNote,
    ApiBodyPostNote
  >({
    url: `note/${note.id}`,
    method: "POST",
    body: { note }
  });

  const { data } = apiResult;

  if (!apiResult.success) {
    const { message } = data as ApiStatusMessage;
    throw new Error(message);
  }

  return data as ApiResponsePostNote;
}
