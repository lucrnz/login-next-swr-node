import Link from "next/link";
import React from "react";
import styles from './Navigation.module.css';
import { APP_NAME } from '@/config';
import { useUser } from "@/hooks/useUser";
import { awaitCallbackIfNeeded } from "@/utils/awaitCallbackIfNeeded";
import { logoutAction } from "@/utils/logoutAction";
import { useSWRConfig } from "swr";

type Routes = {
  name: string,
  value: string | (() => unknown | Promise<unknown>)
}[]

type NavigationProps = {
  routes: Routes;
}

export const Navigation: React.FC<NavigationProps> = ({ routes }) => (
  <div className={styles['container']}>
    <span className={styles['title']}>{APP_NAME}</span>
    <ul className={styles['ul']}>
      {routes.map(
        ({ name, value }) =>
          <li key={name}>
            {typeof value === 'string' && <Link className={styles['link']} href={`/${value}`}>{name}</Link>}
            {typeof value === 'function' && <a href="#" className={styles['link']} onClick={async (event: React.MouseEvent<HTMLAnchorElement>) => {
              event.preventDefault();
              await awaitCallbackIfNeeded(value);
            }}>{name}</a>}
          </li>)}
    </ul>
  </div>
);

export default () => {
  const { mutate } = useSWRConfig();
  const { loading, loggedOut, user } = useUser();

  if (loading) {
    return <p>Loading...</p>
  }

  console.log({ loggedOut, user })

  const loginRoutes: Routes = [{
    name: loggedOut ? "Login" : "Logout",
    value: loggedOut ? "login" : () => logoutAction(mutate.bind(null, null))
  }];

  return <Navigation routes={[
    ...loginRoutes,
    {
      name: "Notes",
      value: "notes"
    }
  ]} />
};
