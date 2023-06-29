import { Note } from "@/types/Note";
import Link from "next/link";
import { Card } from "../Card/Card";

export function DisplayNote({
  note,
  addLink: providedAddLink
}: {
  note: Note;
  addLink?: boolean;
}) {
  const addLink = providedAddLink ?? false;

  return (
    <Card>
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
    </Card>
  );
}
