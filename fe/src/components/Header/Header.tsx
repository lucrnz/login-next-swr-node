/*
 * Copyright 2023 lucdev<lucdev.net>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import Link from "next/link";
import React from "react";
import styles from "./Header.module.css";
import commonStyles from "@/styles/common.module.css";
import { APP_NAME } from "@/config";
import useUser from "@/hooks/User/useUser";

type Routes = {
  name: string;
  value: string;
}[];

type HeaderProps = {
  routes: Routes;
};

function Header({ routes }: HeaderProps) {
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
  const { loggedOut } = useUser();

  return (
    <Header
      routes={[
        {
          name: loggedOut ? "Login" : "Logout",
          value: loggedOut ? "login" : "logout"
        },
        {
          name: "Notes",
          value: "notes"
        }
      ]}
    />
  );
}
