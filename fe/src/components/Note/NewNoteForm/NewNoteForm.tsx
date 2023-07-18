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
import styles from "@/styles/notes/new.module.css";
import commonStyles from "@/styles/common.module.css";
import { useRef, useState } from "react";
import useFormValidation, {
  emptyStringValidation
} from "@/hooks/useFormValidation";
import awaitCallbackIfNeeded from "@/utils/awaitCallbackIfNeeded";
import saveNote from "@/utils/saveNote";
import { ApiResponsePostNote } from "@/types/Api";

const Field = {
  Title: "Title",
  Contents: "Contents"
};

const validations = {
  [Field.Title]: {
    validate: emptyStringValidation,
    id: "title",
    message: "Title is empty"
  },
  [Field.Contents]: {
    validate: emptyStringValidation,
    id: "contents",
    message: "Contents cannot be empty"
  }
};

type NewNoteProps = {
  onSaveSuccess?: (note: Note) => Promise<unknown> | unknown;
  onSaveError?: (err: Error) => Promise<unknown> | unknown;
};

export default function NewNoteForm({
  onSaveSuccess,
  onSaveError
}: NewNoteProps) {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const {
    validateField,
    validateAllInputs,
    getValidationErrorsForField,
    getInputValues
  } = useFormValidation(validations, formRef);

  async function formSubmitEventHandler(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setSaveError((_) => null);

    if (isSaving || !formRef || !formRef.current) {
      return;
    }

    const errors = validateAllInputs();

    if (errors.length) {
      return;
    }

    const values = getInputValues();

    let note = {
      id: "",
      title: values[Field.Title],
      contents: values[Field.Contents]
    } as Note;

    setIsSaving((_) => true);

    let data: ApiResponsePostNote | null = null;
    try {
      data = await saveNote(note);
    } catch (err) {
      data = null;
      const error = err as Error;
      setSaveError(error.message);
      if (onSaveError) {
        await awaitCallbackIfNeeded(onSaveError, error);
      }
    } finally {
      setIsSaving((_) => false);
    }

    if (data) {
      note.id = data.noteId;

      if (onSaveSuccess) {
        await awaitCallbackIfNeeded(onSaveSuccess, note);
      }
    }
  }

  return (
    <form
      ref={formRef}
      onSubmit={formSubmitEventHandler}
      className={styles["main-form"]}
    >
      <div>
        <label htmlFor="title">Title:</label>
        <input
          id="title"
          type="text"
          onBlur={() => validateField(Field.Title)}
          disabled={isSaving}
          className={commonStyles["text-field"]}
        ></input>
        {getValidationErrorsForField(Field.Title).map((message, index) => (
          <span key={index} className={commonStyles["text-error"]}>
            {message}
          </span>
        ))}
      </div>
      <div>
        <label htmlFor="contents">Contents:</label>
        <textarea
          id="contents"
          onBlur={() => validateField(Field.Contents)}
          disabled={isSaving}
          className={commonStyles["text-field"]}
        />
        {getValidationErrorsForField(Field.Contents).map((message, index) => (
          <span key={index} className={commonStyles["text-error"]}>
            {message}
          </span>
        ))}
      </div>
      <div>
        {isSaving && (
          <span className={commonStyles["blue-text"]}>
            Saving your note, please wait ...
          </span>
        )}
        {saveError !== null && (
          <span className={commonStyles["text-error"]}>{saveError}</span>
        )}
        <input
          type="submit"
          value="Save"
          className={[commonStyles["button"], commonStyles["blue-button"]].join(
            " "
          )}
        />
      </div>
    </form>
  );
}
