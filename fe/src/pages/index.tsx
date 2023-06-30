import { MainLayout } from "@/components/MainLayout/MainLayout";
import { defaultPageLoggedIn } from "@/config";
import { useUser } from "@/hooks/User/useUser";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Card } from "@/components/Card/Card";

export default function IndexPage() {
  const router = useRouter();
  const { loggedOut, loading: loadingUser } = useUser();

  useEffect(() => {
    if (!loggedOut && !loadingUser) {
      router.replace(defaultPageLoggedIn);
    }
  }, [loggedOut, loadingUser]);

  return (
    <MainLayout disableRedirect={true}>
      <Card>
        <h1>Login example</h1>
        <p>This is main page that anyone can read.</p>
      </Card>
    </MainLayout>
  );
}
