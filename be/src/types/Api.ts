import { Note } from "./Note.js";

export type ApiResponse<T> = {
  success: boolean;
  data: T;
};

export type ApiStatusMessage = {
  success: boolean;
  message: string;
};

export type ApiResponseOrError<T> = ApiResponse<T> | ApiStatusMessage;

export type ApiBodyPostNote = {
  note: Note;
};

export type ApiResponsePostNote = {
  noteId: Note["id"];
};
