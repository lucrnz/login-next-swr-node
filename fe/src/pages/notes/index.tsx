import { useUser } from "@/hooks/User/useUser";
import { MainLayout } from "@/components/MainLayout/MainLayout";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Notes } from "@/components/Notes/Notes";
import { Card } from "@/components/Card/Card";
import styles from "@/styles/notes/index.module.css";
import commonStyles from "@/styles/common.module.css";
import { greetUserByTime } from "@/utils/greetUserByTime";
import Link from "next/link";

export default function NotesPage() {
  const router = useRouter();
  const { user, loggedOut } = useUser();
  const title = "My Notes";

  useEffect(() => {
    if (loggedOut) {
      router.replace("/login");
    }
  }, [loggedOut]);

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
          <h1 className={styles["title"]}>Notes</h1>
          <h2 className={styles["subtitle"]}>
            {`${greetUserByTime()}, ${user.name}!`}
          </h2>
          <Link href="/notes/new" className={commonStyles["link"]}>
            Create a new note
          </Link>
        </Card>
        <Notes wrapper={Card} />
      </div>
    </MainLayout>
  );
}
