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
  const [isCollapsed, setIsCollapsed] = useState(collapse);
  const lines = contents.split("\n");

  const contentLines = isCollapsed ? lines.slice(0, maxLines) : lines;

  return (
    <div className={styles["display-note"]} onDoubleClick={onDoubleClick}>
      {contentLines.map((value, index) =>
        value.length > 0 ? (
          <p key={index}>{value}</p>
        ) : (
          <p
            key={index}
            className={styles["empty-paragraph"]}
            aria-hidden={true}
          >
            {"."}
          </p>
        )
      )}
      {isCollapsed && contents.length > maxLines && (
        <a
          href="#"
          className={commonStyles["link"]}
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
