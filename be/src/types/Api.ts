import { Note } from "./Note.js";

export type ApiResponse<T> = {
  success: boolean;
  data: T;
};

export type ApiStatusMessage = {
  message: string;
};

export type ApiResponseOrMessage<T> =
  | ApiResponse<T>
  | ApiResponse<ApiStatusMessage>;

export type ApiBodyPostNote = {
  note: Note;
};

export type ApiResponsePostNote = {
  noteId: Note["id"];
};
