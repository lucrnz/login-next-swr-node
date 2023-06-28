import { EditNote } from "@/components/DisplayNote/DisplayNote";
import { MainLayout } from "@/components/MainLayout/MainLayout";
import { useNote } from "@/hooks/Notes/useNote";
import { useUser } from "@/hooks/User/useUser";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function NoteIdPage() {
  const router = useRouter();
  const { id } = router.query;
  const { user, loggedOut, loading: loadingUser } = useUser();
  const { note, loading: loadingNote, error } = useNote(id as string);

  useEffect(() => {
    if (loggedOut) {
      router.replace("/login");
    }
  }, [loggedOut]);

  if (loggedOut || !user) {
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

  return (
    <MainLayout title={note.title}>
      <EditNote
        note={note}
        onSave={(note) => {
          console.log("To save", note);
        }}
        isLoading={false}
      />
    </MainLayout>
  );
}
