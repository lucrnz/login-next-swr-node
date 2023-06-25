import { readFile, readdir, unlink, writeFile } from "fs/promises";
import { Note } from "../types/Note.js";
import { User } from "../types/User.js";
import { join } from "path";
import { dataFolder } from "../config.js";
import { existsSync } from "fs";

export const deleteNoteFileNotExistsErrorMessage = "File not exists";

type SavedNote = {
  userId: User["id"];
  note: Note;
};

function getNoteFilePath(userId: User["id"], noteId: Note["id"]) {
  return join(dataFolder, `note_${userId}-${noteId}.json`);
}

export async function writeNote(userId: User["id"], note: Note) {
  const savedNote = {
    userId,
    note
  } as SavedNote;

  const filePath = getNoteFilePath(userId, note.id);
  await writeFile(filePath, JSON.stringify(savedNote, undefined, "\t"), {
    encoding: "utf-8"
  });
}

export async function readNote(userId: User["id"], noteId: Note["id"]) {
  const filePath = getNoteFilePath(userId, noteId);

  if (!existsSync(filePath)) {
    return null;
  }

  const savedNoteString = await readFile(filePath, { encoding: "utf-8" });
  const { note } = JSON.parse(savedNoteString) as SavedNote;
  return note;
}

export async function deleteNote(userId: User["id"], noteId: Note["id"]) {
  const filePath = getNoteFilePath(userId, noteId);

  if (!existsSync(filePath)) {
    throw new Error(deleteNoteFileNotExistsErrorMessage);
  }

  await unlink(filePath);
}

export async function listNotesForUser(userId: User["id"]) {
  const files = await readdir(dataFolder, { encoding: "utf-8" });

  const filtered = files.filter(
    (value) =>
      value.length > 0 &&
      value.startsWith(`note_${userId}-`) &&
      value.endsWith(".json")
  );

  const parsed = filtered.map((fileName) =>
    fileName.replace(`note_${userId}-`, "").replace(".json", "")
  );

  return parsed;
}
