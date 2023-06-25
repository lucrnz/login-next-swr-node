import { useUser } from "@/hooks/useUser";
import { MainLayout } from "@/components/MainLayout";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function NotesPage() {
  const router = useRouter();
  const { user, loggedOut } = useUser();

  useEffect(() => {
    if (loggedOut) {
      router.replace("/login");
    }
  }, [loggedOut]);

  let mainContent = <p>Loading...</p>;

  if (!loggedOut && user) {
    mainContent = (
      <>
        <h1>Notes</h1>
        <h2>Welcome {user.name}!</h2>
      </>
    );
  }

  if (loggedOut) {
    mainContent = <p>Please log in to visit this page.</p>;
  }

  return <MainLayout title="My Notes">{mainContent}</MainLayout>;
}
