import { MainLayout } from '@/components/MainLayout'
import { useUser } from '@/hooks/useUser';
import Router from 'next/router';
import { useEffect } from 'react';

export default () => {
  const { user, loading, loggedOut } = useUser();

  useEffect(() => {
    if (user && !loggedOut) {
      Router.replace("/notes");
    }
  }, [user, loggedOut]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <MainLayout>
      <h1>Login example</h1>
      <p>This is main page that anyone can read.</p>
    </MainLayout>
  )
}
