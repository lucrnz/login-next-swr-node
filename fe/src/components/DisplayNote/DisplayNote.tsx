import { Note } from "@/types/Note";
import Link from "next/link";
import commonStyles from "@/styles/common.module.css";

export function DisplayNote({
  note,
  addLink: providedAddLink
}: {
  note: Note;
  addLink?: boolean;
}) {
  const addLink = providedAddLink ?? false;

  return (
    <>
      {
        <h2>
          {addLink ? (
            <Link href={`/notes/${note.id}`} className={commonStyles["link"]}>
              {note.title}
            </Link>
          ) : (
            note.title
          )}
        </h2>
      }
      <p>{note.contents}</p>
    </>
  );
}
