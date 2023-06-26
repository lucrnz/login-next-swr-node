import { Note } from "./Note";

export type ApiResponse<T> = {
  success: boolean;
  data: T;
};

export type ApiStatusMessage = {
  message: string;
};

export type ApiResponseOrMessage<T> = ApiResponse<T | ApiStatusMessage>;

export type ApiBodyPostNote = {
  note: Note;
};

export type ApiResponsePostNote = {
  noteId: Note["id"];
};
