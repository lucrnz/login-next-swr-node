import { PropsWithChildren } from "react";

import styles from "./Card.module.css";

type CardProps = PropsWithChildren<{
  classList?: string[];
}>;

export default function Card({
  children,
  classList: providedClassList
}: CardProps) {
  const classList = providedClassList ?? [];

  return (
    <div className={`${styles["card"]} ${classList.join(" ")}`}>{children}</div>
  );
}
