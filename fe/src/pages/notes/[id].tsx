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

import EditNote from "@/components/Note/EditNote/EditNote";
import MainLayout from "@/components/MainLayout/MainLayout";
import useNote from "@/hooks/Notes/useNote";
import useUser from "@/hooks/User/useUser";
import { Note } from "@/types/Entities";
import { useRouter } from "next/router";
import { PropsWithChildren, useState } from "react";
import Card from "@/components/Card/Card";
import { saveNoteAction } from "@/utils/actions";

type LayoutProps = PropsWithChildren<{
  title: string;
}>;

function Layout({ children, title }: LayoutProps) {
  return (
    <MainLayout title={title}>
      <Card>{children}</Card>
    </MainLayout>
  );
}

export default function NoteIdPage() {
  const router = useRouter();
  const { id } = router.query;
  const { user, loggedOut, loading: loadingUser, loginExpired } = useUser();
  const { note, loading: loadingNote, error } = useNote(id as string);
  const [isSavingNote, setIsSavingNote] = useState(false);

  if (loggedOut || !user || loginExpired) {
    return (
      <Layout title="Note">
        <p>Please log in to visit this page.</p>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Error">
        <p>{error.message}</p>
      </Layout>
    );
  }

  if (loadingUser || loadingNote || !note) {
    return (
      <Layout title="Note">
        <p>Loading, please wait...</p>
      </Layout>
    );
  }

  async function onSaveNote(note: Note) {
    setIsSavingNote((_) => true);
    await saveNoteAction(note);
    setIsSavingNote((_) => false);
  }

  return (
    <Layout title={note.title}>
      <EditNote note={note} onSave={onSaveNote} isLoading={isSavingNote} />
    </Layout>
  );
}
