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
import { fetchApi } from "./api";
import {
  ApiBodyPostNote,
  ApiResponsePostNote,
  ApiStatusMessage
} from "@/types/Api";

export default async function saveNote(note: Note) {
  const { data: apiResult } = await fetchApi<
    ApiResponsePostNote,
    ApiBodyPostNote
  >({
    url: `note/${note.id}`,
    method: "POST",
    body: { note }
  });

  const { data } = apiResult;

  if (!apiResult.success) {
    const { message } = data as ApiStatusMessage;
    throw new Error(message);
  }

  return data as ApiResponsePostNote;
}
