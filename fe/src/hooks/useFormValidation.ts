import { RefObject, useState } from "react";

type ValidationValue = {
  validate: (value: string) => Boolean;
  id: string;
  message: string;
};

type Validations<F> = {
  [field in keyof F]: ValidationValue;
};

type ParentRefType =
  | RefObject<HTMLElement>
  | RefObject<HTMLElement | null>
  | RefObject<HTMLElement | undefined>;

export default function useFormValidation<F extends Record<string, unknown>>(
  validations: Validations<F>,
  parentReference: ParentRefType
) {
  type Field = keyof F;

  const [validationErrors, setValidationErrors] = useState<[Field, string][]>(
    []
  );

  function validateInput(validation: ValidationValue) {
    if (!parentReference.current) {
      return [];
    }

    const errors: string[] = [];

    const { validate, message, id } = validation;

    const element = parentReference.current.querySelector(`#${id}`) as
      | HTMLInputElement
      | undefined;

    if (!element) {
      return [];
    }

    if (!validate(element.value)) {
      errors.push(message);
    }

    return errors;
  }

  function validateField(field: Field) {
    const entries = Object.entries(validations);

    const entry = entries.find(([validationKey, _]) => validationKey === field);

    if (!entry) {
      return;
    }

    const [_, validation] = entry;

    const newErrors = validateInput(validation).map(
      (error) => [field, error] as [Field, string]
    );

    setValidationErrors((errors) => {
      // Get validation errors from other inputs only
      const filtered = errors.filter(([key, _]) => key !== field);

      // Add validation errors from this input
      return [...filtered, ...newErrors];
    });
  }

  function validateAllInputs() {
    const errors: [Field, string][] = [];

    for (const validation of Object.entries(validations)) {
      const [key, validationValue] = validation;
      const field = key as Field;
      const newErrors = validateInput(validationValue).map(
        (error) => [field, error] as [Field, string]
      );

      for (const entry of newErrors) {
        errors.push(entry);
      }
    }

    setValidationErrors((_) => errors);
    return errors;
  }

  function getValidationErrorsForField(field: Field) {
    return validationErrors
      .filter(([f, _]) => f === field)
      .map(([_, message]) => message);
  }

  function getInputValues() {
    const entries = Object.entries(validations);
    const values = {} as { [key in Field]: string };

    for (const [field, { id }] of entries) {
      const value = (() => {
        if (!parentReference.current) {
          return "";
        }

        const element = parentReference.current.querySelector(`#${id}`) as
          | HTMLInputElement
          | undefined;

        return element ? element.value : "";
      })();

      values[field as Field] = value;
    }

    return values;
  }

  return {
    validateField,
    validateAllInputs,
    getValidationErrorsForField,
    getInputValues
  };
}

export function emptyStringValidation(value: string) {
  return value.trim().length === 0;
}
