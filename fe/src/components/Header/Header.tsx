import Link from "next/link";
import React from "react";
import styles from "./Header.module.css";
import commonStyles from "@/styles/common.module.css";
import { APP_NAME } from "@/config";
import { useUser } from "@/hooks/User/useUser";

type Routes = {
  name: string;
  value: string;
}[];

type HeaderProps = {
  routes: Routes;
};

export function Header({ routes }: HeaderProps) {
  return (
    <header className={styles["header"]}>
      <div className={styles["container"]}>
        <Link
          className={styles["title"]}
          href={"/"}
          aria-label="Go to homepage"
        >
          {APP_NAME}
        </Link>
        <ul className={styles["ul"]}>
          {routes.map(({ name, value }) => (
            <li key={name}>
              <Link className={commonStyles["link"]} href={`/${value}`}>
                {name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}

export default function DefaultHeader() {
  const { loggedOut, loading: loadingUser } = useUser();

  const loginRoutes: Routes = loadingUser
    ? []
    : [
        {
          name: loggedOut ? "Login" : "Logout",
          value: loggedOut ? "login" : "logout"
        }
      ];

  return (
    <Header
      routes={[
        ...loginRoutes,
        {
          name: "Notes",
          value: "notes"
        }
      ]}
    />
  );
}
