import { PropsWithChildren } from "react";
import { defaultFont, APP_NAME } from "@/config";
import DefaultNavigation from "./Navigation";
import Head from "next/head";
import styles from "./MainLayout.module.css";
import { useUser } from "@/hooks/useUser";

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

  return (
    <>
      {title && (
        <Head>
          <title>{`${title} - ${APP_NAME}`}</title>
        </Head>
      )}
      <main className={classList.join(" ")}>
        <DefaultNavigation loggedOut={loggedOut} />
        {children}
      </main>
    </>
  );
};
