import { useUser } from "@/hooks/User/useUser";
import { useRouter } from "next/router";
import { Card } from "@/components/Card/Card";
import { useEffect } from "react";
import { MainLayout } from "@/components/MainLayout/MainLayout";

export default function NewNotePage() {
  const router = useRouter();
  const { user, loggedOut } = useUser();
  const title = "New Note";

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
      <div>
        <Card>
          <p>New note</p>
        </Card>
      </div>
    </MainLayout>
  );
}
