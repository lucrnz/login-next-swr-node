import { PropsWithChildren } from "react";

import styles from "./Card.module.css";

export function Card({
  children,
  classList: providedClassList
}: PropsWithChildren<{
  classList?: string[];
}>) {
  const classList = providedClassList ?? [];

  return (
    <div className={`${styles["card"]} ${classList.join(" ")}`}>{children}</div>
  );
}
