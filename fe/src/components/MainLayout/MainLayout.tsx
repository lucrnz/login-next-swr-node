import { PropsWithChildren, useEffect } from "react";
import { defaultFont, APP_NAME } from "@/config";
import DefaultHeader from "@/components/Header/Header";
import Head from "next/head";
import styles from "./MainLayout.module.css";
import { useUser } from "@/hooks/User/useUser";

type MainProps = PropsWithChildren<{
  classList?: string[];
  title?: string;
}>;

export const MainLayout = ({
  classList: providedClassList,
  title,
  children
}: MainProps) => {
  const defaultClassList = [styles["main"], defaultFont.className];
  const classList = providedClassList
    ? [...providedClassList, ...defaultClassList]
    : defaultClassList;

  const { loggedOut } = useUser();

  useEffect(() => {
    console.log("loggedOut: ", loggedOut ? "true" : "false");
  }, [loggedOut]);

  return (
    <>
      {title && (
        <Head>
          <title>{`${title} - ${APP_NAME}`}</title>
        </Head>
      )}
      <main className={classList.join(" ")}>
        <DefaultHeader loggedOut={loggedOut} />
        <div className={styles["main-container"]}>{children}</div>
      </main>
    </>
  );
};
