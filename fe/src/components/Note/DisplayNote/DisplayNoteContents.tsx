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

import { useState } from "react";
import type { MouseEvent } from "react";
import styles from "@/styles/notes/display-note.module.css";
import commonStyles from "@/styles/common.module.css";
import { Note } from "@/types/Entities";
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
