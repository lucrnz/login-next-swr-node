import { useUser } from "@/hooks/useUser";
import { MainLayout } from "@/components/MainLayout";
import { useRouter } from "next/router";
import { PropsWithChildren, useEffect } from "react";

function Layout({ children }: PropsWithChildren) {
  return <MainLayout title="My Notes">{children}</MainLayout>;
}

export default function NotesPage() {
  const router = useRouter();
  const { user, loggedOut } = useUser();

  useEffect(() => {
    if (loggedOut) {
      router.replace("/login");
    }
  }, [loggedOut]);

  if (loggedOut || !user) {
    return (
      <Layout>
        <p>Please log in to visit this page.</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <h1>Notes</h1>
      <h2>Welcome {user.name}!</h2>
    </Layout>
  );
}
