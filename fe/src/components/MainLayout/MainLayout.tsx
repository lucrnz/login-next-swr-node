import { PropsWithChildren, useEffect, useState } from "react";
import { APP_NAME } from "@/config";
import DefaultHeader from "@/components/Header/Header";
import Head from "next/head";
import styles from "./MainLayout.module.css";
import useUser from "@/hooks/User/useUser";
import { useRouter } from "next/router";

type MainLayoutProps = PropsWithChildren<{
  classList?: string[];
  title?: string;
  disableRedirect?: boolean;
}>;

export default function MainLayout({
  classList: providedClassList,
  disableRedirect: providedDisableRedirect,
  title,
  children
}: MainLayoutProps) {
  const [isRedirecting, setIsRedirecting] = useState(false);
  const disableRedirect = providedDisableRedirect ?? false;
  const router = useRouter();
  const defaultClassList = [styles["main"]];
  const classList = providedClassList
    ? [...providedClassList, ...defaultClassList]
    : defaultClassList;

  const { loggedOut, loading: loadingUser, loginExpired } = useUser();

  useEffect(() => {
    if (!disableRedirect && !loadingUser && !isRedirecting && loggedOut) {
      const query = loginExpired
        ? { message: "Login expired. Please login again." }
        : undefined;
      router.replace({
        pathname: "/login",
        query
      });
      setIsRedirecting((_) => true);
    }
  }, [
    loggedOut,
    loginExpired,
    loadingUser,
    disableRedirect,
    isRedirecting,
    router
  ]);

  return (
    <>
      {title && (
        <Head>
          <title>{`${title} - ${APP_NAME}`}</title>
        </Head>
      )}
      <main className={classList.join(" ")}>
        <DefaultHeader />
        <div className={styles["main-container"]}>{children}</div>
      </main>
    </>
  );
}
