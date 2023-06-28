import { useUser } from "@/hooks/User/useUser";
import { MainLayout } from "@/components/MainLayout/MainLayout";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Notes } from "@/components/Notes/Notes";

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
      <h1>Notes</h1>
      <h2>Welcome {user.name}!</h2>
      <Notes />
    </MainLayout>
  );
}
