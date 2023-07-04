import { useState } from "react";
import type { MouseEvent } from "react";
import styles from "@/styles/notes/display-note.module.css";
import commonStyles from "@/styles/common.module.css";
import { Note } from "@/types/Note";
import { displayNoteMaxLines } from "@/config";

type DisplayNoteContentsProps = {
  contents: Note["contents"];
  collapse: boolean;
  onDoubleClick?: (
    event: MouseEvent<HTMLDivElement>
  ) => unknown | Promise<unknown>;
};

export default function DisplayNoteContents({
  contents,
  collapse,
  onDoubleClick
}: DisplayNoteContentsProps) {
  const maxLines = displayNoteMaxLines;
  const lines = contents.split("\n");

  const shouldCollapse = collapse && lines.length >= maxLines;
  const [isCollapsed, setIsCollapsed] = useState(shouldCollapse);

  const contentLines = isCollapsed ? lines.slice(0, maxLines) : lines;

  return (
    <div className={styles["display-note"]} onDoubleClick={onDoubleClick}>
      {contentLines.map((value, index) =>
        value.length > 0 ? (
          <p key={index}>{value}</p>
        ) : (
          <div
            key={index}
            className={styles["empty-paragraph"]}
            aria-hidden={true}
          ></div>
        )
      )}
      {isCollapsed && (
        <a
          href="#"
          className={[commonStyles["link"], styles["read-more-link"]].join(" ")}
          onClick={(event) => {
            event.preventDefault();
            setIsCollapsed(false);
          }}
        >
          Read more...
        </a>
      )}
    </div>
  );
}
