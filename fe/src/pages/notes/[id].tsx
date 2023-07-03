import EditNote from "@/components/Note/EditNote/EditNote";
import MainLayout from "@/components/MainLayout/MainLayout";
import useNote from "@/hooks/Notes/useNote";
import useUser from "@/hooks/User/useUser";
import { Note } from "@/types/Note";
import saveNote from "@/utils/saveNote";
import { useRouter } from "next/router";
import { useState } from "react";

export default function NoteIdPage() {
  const router = useRouter();
  const { id } = router.query;
  const { user, loggedOut, loading: loadingUser, loginExpired } = useUser();
  const { note, loading: loadingNote, error } = useNote(id as string);
  const [isSavingNote, setIsSavingNote] = useState(false);

  if (loggedOut || !user || loginExpired) {
    return (
      <MainLayout title="Note">
        <p>Please log in to visit this page.</p>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout title="Error">
        <p>{error.message}</p>
      </MainLayout>
    );
  }

  if (loadingUser || loadingNote || !note) {
    return (
      <MainLayout title="Note">
        <p>Loading, please wait...</p>
      </MainLayout>
    );
  }

  async function onSaveNote(note: Note) {
    setIsSavingNote((_) => true);
    await saveNote(note);
    setIsSavingNote((_) => false);
  }

  return (
    <MainLayout title={note.title}>
      <EditNote note={note} onSave={onSaveNote} isLoading={isSavingNote} />
    </MainLayout>
  );
}
