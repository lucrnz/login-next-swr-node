/*
 * Copyright 2023 lucdev<lucdev.net>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Note } from "@/types/Entities";
import PencilIcon from "@/assets/Icons/pencil.svg";
import styles from "@/styles/notes/edit.module.css";
import { ChangeEvent, useState } from "react";
import awaitCallbackIfNeeded from "@/utils/awaitCallbackIfNeeded";
import DisplayNoteContents from "@/components/Note/DisplayNote/DisplayNoteContents";

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
      <PencilIcon />
    </a>
  );
}

type EditNoteProps = {
  note: Note;
  onSave: (note: Note) => Promise<unknown> | unknown;
  isLoading: boolean;
};

export default function EditNote({
  note: initialNote,
  onSave,
  isLoading
}: EditNoteProps) {
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
    <div className={styles["edit-note-container"]}>
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
      {isEditingContents ? (
        <div className={styles["content-container"]}>
          <textarea
            className={styles["edit-contents"]}
            onBlur={inputContentsExitEditSave}
            onChange={handleInputContentsOnChange}
            autoFocus
            defaultValue={editContents}
          />
        </div>
      ) : (
        <div
          className={[
            styles["content-container"],
            styles["content-container-readonly"]
          ].join(" ")}
        >
          <DisplayNoteContents
            collapse={false}
            contents={note.contents}
            onDoubleClick={(_) => {
              setIsEditingContents((_) => true);
            }}
          />
          <EditButton
            onClick={(_) => {
              setIsEditingContents((_) => true);
            }}
          />
        </div>
      )}
    </div>
  );
}
