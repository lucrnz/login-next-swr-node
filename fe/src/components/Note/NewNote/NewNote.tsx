import { Note } from "@/types/Note";
import Card from "@/components/Card/Card";
import styles from "@/styles/notes/edit.module.css";
import commonStyles from "@/styles/common.module.css";
import { useRef, useState } from "react";
import useFormValidation, {
  emptyStringValidation
} from "@/hooks/useFormValidation";
import awaitCallbackIfNeeded from "@/utils/awaitCallbackIfNeeded";
import saveNote from "@/utils/saveNote";

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

export default function NewNote({ onSaveSuccess, onSaveError }: NewNoteProps) {
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

    const note = {
      id: "",
      title: values[Field.Title],
      contents: values[Field.Contents]
    } as Note;

    setIsSaving((_) => true);

    let success = false;
    try {
      await saveNote(note);
      success = true;
    } catch (err) {
      const error = err as Error;
      setSaveError(error.message);
      if (onSaveError) {
        await awaitCallbackIfNeeded(onSaveError, error);
      }
    } finally {
      setIsSaving((_) => false);

      if (success && onSaveSuccess) {
        await awaitCallbackIfNeeded(onSaveSuccess, note);
      }
    }
  }

  return (
    <Card>
      <div className={styles["main-container"]}>
        <form ref={formRef} onSubmit={formSubmitEventHandler}>
          <div className={styles["title-container"]}>
            <label htmlFor="title">Title:</label>
            <input
              id="title"
              type="text"
              className={styles["edit-title"]}
              onBlur={() => validateField(Field.Title)}
              disabled={isSaving}
            ></input>
            {getValidationErrorsForField(Field.Title).map((message, index) => (
              <span key={index} className={commonStyles["text-error"]}>
                {message}
              </span>
            ))}
          </div>
          <div className={styles["content-container"]}>
            <label htmlFor="contents">Contents:</label>
            <textarea
              id="contents"
              className={styles["edit-contents"]}
              onBlur={() => validateField(Field.Contents)}
              disabled={isSaving}
            />
            {getValidationErrorsForField(Field.Contents).map(
              (message, index) => (
                <span key={index} className={commonStyles["text-error"]}>
                  {message}
                </span>
              )
            )}
          </div>
          {isSaving && (
            <span className={commonStyles["blue-text"]}>
              Saving your note, please wait ...
            </span>
          )}
          {saveError !== null && (
            <span className={commonStyles["text-error"]}>{saveError}</span>
          )}
        </form>
      </div>
    </Card>
  );
}
