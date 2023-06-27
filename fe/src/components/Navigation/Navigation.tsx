import Link from "next/link";
import React from "react";
import styles from "./Navigation.module.css";
import { APP_NAME } from "@/config";

type Routes = {
  name: string;
  value: string;
}[];

type NavigationProps = {
  routes: Routes;
};

export function Navigation({ routes }: NavigationProps) {
  return (
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
  );
}

type DefaultNavigationProps = {
  loggedOut: boolean;
};

export default function DefaultNavigation({
  loggedOut
}: DefaultNavigationProps) {
  const loginRoutes: Routes = [
    {
      name: loggedOut ? "Login" : "Logout",
      value: loggedOut ? "login" : "logout"
    }
  ];

  return (
    <Navigation
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
