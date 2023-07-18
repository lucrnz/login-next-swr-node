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

function defaultValidator(value: string) {
  return value.length > 0;
}

/**
 * @param values String array of all the fields
 * @param validate Function reference for validating a field
 * @returns The same "values" array if all the fields are valid, if not an empty array
 */
export default function validateAllFields(
  values: (string | undefined)[],
  validate: (value: string) => boolean = defaultValidator
) {
  let valid = true;

  for (const value of values) {
    valid = valid && Boolean(value && validate(value));
  }

  return valid ? (values as string[]) : ([] as string[]);
}
