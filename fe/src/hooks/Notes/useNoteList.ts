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

import useSWR from "swr";
import { getApiFetcher } from "@/utils/api";
import { Note } from "@/types/Entities";

function useNoteList() {
  const fetcher = getApiFetcher<Note["id"][], never>({
    method: "GET"
  });

  const {
    data: noteList,
    mutate,
    error: gotError,
    isLoading: loading
  } = useSWR("note/list", fetcher);

  const error = gotError ? (gotError as Error) : undefined;

  return {
    loading,
    noteList,
    mutate,
    error
  };
}

export default useNoteList;
