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

import { RefObject, useState } from "react";

type ValidationValue = {
  validate: (value: string) => Boolean;
  message: string;
  id?: string;
  getValue?: (parentElement: HTMLElement) => string;
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

  function getValidationFieldValue(validation: ValidationValue) {
    if (!parentReference.current) {
      return "";
    }

    const parentElement = parentReference.current;

    const { id, getValue } = validation;

    if (getValue) {
      return getValue(parentElement);
    }

    if (id && id.length > 0) {
      const element = parentElement.querySelector(`#${id}`) as
        | HTMLInputElement
        | undefined;

      return element ? element.value : "";
    }

    return "";
  }

  function validateInput(validation: ValidationValue) {
    if (!parentReference.current) {
      return [];
    }

    const errors: string[] = [];

    const value = getValidationFieldValue(validation);
    const { validate, message } = validation;

    if (!validate(value)) {
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

    for (const [field, validationValue] of entries) {
      values[field as Field] = getValidationFieldValue(validationValue);
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
  return value.trim().length > 0;
}
