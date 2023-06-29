import { Note } from "@/types/Note";
import { Card } from "../Card/Card";
import EditIcon from "@/assets/Icons/edit26.svg";
import styles from "./EditNote.module.css";
import { ChangeEvent, useCallback, useState } from "react";
import { awaitCallbackIfNeeded } from "@/utils/awaitCallbackIfNeeded";

// @TODO: Move to helper function
function getTextAreaHeightRem(value: string) {
  const fontSizeRem = 1;
  const lineHeight = 1.15;
  const adjustFactor = 1.2;
  const lines = value.split("\n");

  const totalLineLength = lines.reduce((total, item) => total + item.length, 0);
  const averageLineLength = totalLineLength / lines.length;
  const lineLengthFactor = averageLineLength * 0.008;

  let result =
    lines.length * lineHeight * lineLengthFactor * fontSizeRem * adjustFactor;

  result = result < 2 ? 2 : result;

  console.log("height (in rem)", result);
  return `${result}rem`;
}

function EditButton({
  onClick
}: {
  onClick: (
    event: React.MouseEvent<HTMLAnchorElement>
  ) => unknown | Promise<unknown>;
}) {
  async function clickHandler(event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    await awaitCallbackIfNeeded(onClick, event);
  }
  return (
    <a
      href="#"
      className={styles["edit-btn"]}
      aria-label="Edit"
      role="button"
      onClick={clickHandler}
    >
      <EditIcon />
    </a>
  );
}

export function EditNote({
  note: initialNote,
  onSave,
  isLoading
}: {
  note: Note;
  onSave: (note: Note) => Promise<unknown> | unknown;
  isLoading: boolean;
}) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingContents, setIsEditingContents] = useState(false);
  const [editTitle, setEditTitle] = useState(initialNote.title);
  const [editContents, setEditContents] = useState(initialNote.contents);
  const [note, setNote] = useState(initialNote);

  async function saveEditedNote(editedNote: Note) {
    let saveOk = false;
    try {
      await awaitCallbackIfNeeded(onSave, editedNote);
      saveOk = true;
    } catch (err) {
      saveOk = false;
      console.error(err);
      // @TODO: Handle error
    }

    if (saveOk) {
      setNote(editedNote);
    }
  }

  function handleInputTitleOnChange(event: ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    setEditTitle((_) => value);
  }

  async function inputTitleExitEditSave() {
    setIsEditingTitle((_) => false);
    if (editTitle !== note.title) {
      saveEditedNote({ ...note, title: editTitle });
    }
  }

  function handleInputContentsOnChange(
    event: ChangeEvent<HTMLTextAreaElement>
  ) {
    const value = event.target.value;
    setEditContents((_) => value);
  }

  async function inputContentsExitEditSave() {
    setIsEditingContents((_) => false);
    if (editContents !== note.contents) {
      saveEditedNote({ ...note, contents: editContents.trim() });
    }
  }

  return (
    <Card>
      <div className={styles["main-container"]}>
        {isLoading && <p>Loading...</p>}
        <div className={styles["title-container"]}>
          {isEditingTitle ? (
            <input
              type="text"
              className={styles["edit-title"]}
              value={editTitle}
              onChange={handleInputTitleOnChange}
              onBlur={inputTitleExitEditSave}
              onKeyUp={(event) => {
                if (event.code === "Enter" || event.code === "NumpadEnter") {
                  inputTitleExitEditSave();
                }
              }}
              autoFocus
            ></input>
          ) : (
            <>
              <h2
                className={styles["display-title"]}
                onDoubleClick={() => {
                  setIsEditingTitle((_) => true);
                }}
              >
                {note.title}
              </h2>
              <EditButton
                onClick={(_) => {
                  setIsEditingTitle((_) => true);
                }}
              />
            </>
          )}
        </div>
        <div className={styles["content-container"]}>
          {isEditingContents ? (
            <textarea
              className={styles["edit-contents"]}
              onBlur={inputContentsExitEditSave}
              onChange={handleInputContentsOnChange}
              autoFocus
              defaultValue={editContents}
              style={{
                height: getTextAreaHeightRem(editContents)
              }}
            />
          ) : (
            <>
              <textarea
                className={styles["display-contents"]}
                readOnly
                onDoubleClick={() => {
                  setIsEditingContents((_) => true);
                }}
                value={note.contents}
                onChange={(event) => {
                  event.target.style["height"] = getTextAreaHeightRem(
                    event.target.value
                  );
                }}
                style={{
                  height: getTextAreaHeightRem(note.contents)
                }}
              />
              <EditButton
                onClick={(_) => {
                  setIsEditingContents((_) => true);
                }}
              />
            </>
          )}
        </div>
      </div>
    </Card>
  );
}
