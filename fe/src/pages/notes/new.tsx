import useUser from "@/hooks/User/useUser";
import Card from "@/components/Card/Card";
import MainLayout from "@/components/MainLayout/MainLayout";
import styles from "@/styles/notes/index.module.css";
import NewNote from "@/components/Note/NewNote/NewNote";
import { useRouter } from "next/router";

export default function NewNotePage() {
  const { user, loggedOut } = useUser();
  const title = "New Note";
  const router = useRouter();

  if (loggedOut || !user) {
    return (
      <MainLayout title={title}>
        <p>Please log in to visit this page.</p>
      </MainLayout>
    );
  }

  return (
    <MainLayout title={title}>
      <div className={styles["main-layout"]}>
        <Card>
          <h2 className={styles["subtitle"]}>Create a new note</h2>
        </Card>
        <NewNote
          onSaveSuccess={async (_) => {
            await router.push("/notes");
          }}
        />
      </div>
    </MainLayout>
  );
}
