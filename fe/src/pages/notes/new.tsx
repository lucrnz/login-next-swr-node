import useUser from "@/hooks/User/useUser";
import Card from "@/components/Card/Card";
import MainLayout from "@/components/MainLayout/MainLayout";
import styles from "@/styles/notes/index.module.css";
import NewNoteForm from "@/components/Note/NewNoteForm/NewNoteForm";
import { useRouter } from "next/router";
import useNoteList from "@/hooks/Notes/useNoteList";
import { Note } from "@/types/Note";

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
