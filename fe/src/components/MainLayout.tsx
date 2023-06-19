import { PropsWithChildren } from "react";
import { defaultFont, APP_NAME } from "@/config";
import Navigation from "./Navigation";
import Head from "next/head";
import styles from "./MainLayout.module.css";

type MainProps = {
  classList?: string[],
  title?: string;
};

export const MainLayout = ({ classList: providedClassList, title, children }: PropsWithChildren<MainProps>) => {
  const defaultClassList = [styles['main'], defaultFont.className];
  const classList = providedClassList ? [...providedClassList, ...defaultClassList] : defaultClassList;

  return (
    <>
      <Head>
        <title>{title ? `${title} - ${APP_NAME}` : APP_NAME}</title>
      </Head>
      <main className={classList.join(" ")}>
        <Navigation />
        {children}
      </main>;
    </>);
};
