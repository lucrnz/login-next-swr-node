import { Note } from "@/types/Note";
import Link from "next/link";
import { Card } from "../Card/Card";
import EditIcon from "@/assets/Icons/edit26.svg";
import styles from "./DisplayNote.module.css";
import { ChangeEvent, useState } from "react";
import { awaitCallbackIfNeeded } from "@/utils/awaitCallbackIfNeeded";

type NoteProps = {
  note: Note;
};

export function DisplayNote({
  note,
  addLink: providedAddLink
}: NoteProps & {
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

function EditButton({
  onClick
}: {
  onClick: (
    event: React.MouseEvent<HTMLAnchorElement>
  ) => unknown | Promise<unknown>;
}) {
  return (
    <a
      href="#"
      className={styles["edit-btn"]}
      aria-label="Edit"
      role="button"
      onClick={onClick}
    >
      <EditIcon />
    </a>
  );
}

export function EditNote({
  note: initialNote,
  onSave,
  isLoading
}: NoteProps & {
  onSave: (note: Note) => Promise<unknown> | unknown;
  isLoading: boolean;
}) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingContents, setIsEditingContents] = useState(false);
  const [editTitle, setEditTitle] = useState(initialNote.title);
  const [note, setNote] = useState(initialNote);

  function handleInputTitleOnChange(event: ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    setEditTitle((_) => value);
  }

  async function handleInputTitleOnBlur() {
    setIsEditingTitle((_) => false);
    const editedNote = { ...note, title: editTitle } as Note;

    let saveOk = false;
    try {
      await awaitCallbackIfNeeded(onSave, editedNote);
      saveOk = true;
    } catch (err) {
      saveOk = false;
      console.error(err);

      //@TODO: set error
    }

    if (saveOk) {
      setNote(editedNote);
    }
  }

  return (
    <Card>
      {isLoading && <p>Loading...</p>}
      <div className={styles["title-container"]}>
        {isEditingTitle ? (
          <input
            type="text"
            className={styles["input-edit-title"]}
            value={editTitle}
            onChange={handleInputTitleOnChange}
            onBlur={handleInputTitleOnBlur}
            autoFocus
          ></input>
        ) : (
          <>
            <h2>{note.title}</h2>
            <EditButton
              onClick={(event) => {
                event.preventDefault();
                setIsEditingTitle((_) => true);
              }}
            />
          </>
        )}
      </div>
      {isEditingContents ? (
        <textarea>{note.contents}</textarea>
      ) : (
        <p>{note.contents}</p>
      )}
    </Card>
  );
}
