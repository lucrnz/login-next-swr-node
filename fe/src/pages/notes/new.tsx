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

import useUser from "@/hooks/User/useUser";
import Card from "@/components/Card/Card";
import MainLayout from "@/components/MainLayout/MainLayout";
import styles from "@/styles/notes/index.module.css";
import NewNoteForm from "@/components/Note/NewNoteForm/NewNoteForm";
import { useRouter } from "next/router";
import useNoteList from "@/hooks/Notes/useNoteList";
import { Note } from "@/types/Entities";

export default function NewNotePage() {
  const { user, loggedOut } = useUser();
  const title = "New Note";
  const router = useRouter();
  const {
    noteList,
    mutate: mutateNoteList,
    loading: loadingNoteList
  } = useNoteList();

  if (loggedOut || !user) {
    return (
      <MainLayout title={title}>
        <p>Please log in to visit this page.</p>
      </MainLayout>
    );
  }

  if (loadingNoteList) {
    return (
      <MainLayout title={title}>
        <p>Loading, please wait...</p>
      </MainLayout>
    );
  }

  async function saveNoteSuccessHandler(note: Note) {
    if (noteList) {
      await mutateNoteList([note.id, ...noteList]);
    }

    await router.push("/notes");
  }

  return (
    <MainLayout title={title}>
      <div className={styles["main-layout"]}>
        <Card>
          <h2 className={styles["subtitle"]}>Create a new note</h2>
        </Card>
        <Card>
          <NewNoteForm onSaveSuccess={saveNoteSuccessHandler} />
        </Card>
      </div>
    </MainLayout>
  );
}
