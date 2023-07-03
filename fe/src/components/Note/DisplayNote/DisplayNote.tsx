import { Note } from "@/types/Note";
import Link from "next/link";
import commonStyles from "@/styles/common.module.css";
import DisplayNoteContents from "./DisplayNoteContents";

type DisplayNoteProps = {
  note: Note;
  addLink?: boolean;
  collapse?: boolean;
};

export default function DisplayNote({
  note,
  addLink: providedAddLink,
  collapse
}: DisplayNoteProps) {
  const addLink = providedAddLink ?? false;
  const { contents, title } = note;

  return (
    <>
      <h2>
        {addLink ? (
          <Link href={`/notes/${note.id}`} className={commonStyles["link"]}>
            {title}
          </Link>
        ) : (
          title
        )}
      </h2>
      <DisplayNoteContents contents={contents} collapse={collapse ?? false} />
    </>
  );
}
