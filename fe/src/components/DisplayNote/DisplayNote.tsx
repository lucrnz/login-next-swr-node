import { Note } from "@/types/Note";
import Link from "next/link";

type NoteProps = {
  note: Note;
  addLink?: boolean;
};

export function DisplayNote({ note, addLink: providedAddLink }: NoteProps) {
  const addLink = providedAddLink ?? false;

  return (
    <div>
      {
        <h2>
          {addLink ? (
            <Link href={`/notes/${note.id}`}>{note.title}</Link>
          ) : (
            note.title
          )}
        </h2>
      }
      <p>{note.contents}</p>
    </div>
  );
}
