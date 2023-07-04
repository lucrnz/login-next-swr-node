import useUser from "@/hooks/User/useUser";
import MainLayout from "@/components/MainLayout/MainLayout";
import Card from "@/components/Card/Card";
import styles from "@/styles/notes/index.module.css";
import commonStyles from "@/styles/common.module.css";
import greetUserByTime from "@/utils/greetUserByTime";
import Link from "next/link";
import DisplayNoteList from "@/components/Note/DisplayNote/DisplayNoteList";

export default function NotesPage() {
  const { user, loggedOut } = useUser();
  const title = "My Notes";

  if (loggedOut || !user) {
    return (
      <MainLayout title={title}>
        <Card>
          <p>Please log in to visit this page.</p>
        </Card>
      </MainLayout>
    );
  }

  return (
    <MainLayout title={title}>
      <div className={styles["main-layout"]}>
        <Card>
          <h1 className={styles["title"]}>Notes</h1>
          <h2 className={styles["subtitle"]}>
            {`${greetUserByTime()}, ${user.name}!`}
          </h2>
          <Link href="/notes/new" className={commonStyles["link"]}>
            Create a new note
          </Link>
        </Card>
        <div className={styles["note-list"]}>
          <DisplayNoteList wrapper={Card} />
        </div>
      </div>
    </MainLayout>
  );
}
