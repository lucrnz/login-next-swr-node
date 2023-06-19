import { useUser } from "@/hooks/useUser";
import Router from "next/router";
import { MainLayout } from "@/components/MainLayout";

export default () => {
  const { loading, user, mutate } = useUser();

  let mainContent = <p>Loading...</p>;

  console.log("user", user);

  if (!loading && user) {
    mainContent = <>
      <h1>Notes</h1>
      <h2>Welcome {user.name}!</h2>
    </>
  }

  if (!loading && !user) {
    mainContent = <p>Please log in to visit this page.</p>
    Router.replace("/login");
  }

  return (
    <MainLayout title="My Notes">
      {mainContent}
    </MainLayout>);
}
