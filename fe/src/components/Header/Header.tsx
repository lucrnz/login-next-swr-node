import Link from "next/link";
import React from "react";
import styles from "./Header.module.css";
import { APP_NAME } from "@/config";

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
        <span className={styles["title"]}>{APP_NAME}</span>
        <ul className={styles["ul"]}>
          {routes.map(({ name, value }) => (
            <li key={name}>
              <Link className={styles["link"]} href={`/${value}`}>
                {name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}

type DefaultHeaderProps = {
  loggedOut: boolean;
};

export default function DefaultHeader({ loggedOut }: DefaultHeaderProps) {
  const loginRoutes: Routes = [
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
