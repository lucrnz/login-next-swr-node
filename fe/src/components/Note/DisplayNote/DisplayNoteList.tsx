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

import React, { PropsWithChildren } from "react";
import useUser from "@/hooks/User/useUser";
import useNoteList from "@/hooks/Notes/useNoteList";
import useNote from "@/hooks/Notes/useNote";
import { Note } from "@/types/Entities";
import DisplayNote from "./DisplayNote";

type NoteProps = {
  noteId: Note["id"];
};

function FetchNote({ noteId }: NoteProps) {
  const { note, loading } = useNote(noteId);

  if (loading || !note) {
    return <p>Loading...</p>;
  }

  return <DisplayNote note={note} addLink={true} collapse={true} />;
}

export default function DisplayNoteList({
  wrapper: providedWrapper
}: {
  wrapper?: React.FC<PropsWithChildren<unknown>>;
}) {
  const { user, loading: loadingUser } = useUser();
  const { noteList: gotNoteList, loading: loadingNoteList } = useNoteList();

  if (!user) {
    console.log("Notes: Not logged in");
    return <></>;
  }

  if (loadingUser || loadingNoteList) {
    return <p>Loading...</p>;
  }

  const noteList = gotNoteList ? gotNoteList : [];

  const Wrapper = providedWrapper ? providedWrapper : React.Fragment;

  return (
    <>
      {noteList.length > 0 ? (
        noteList.map((noteId, index) => (
          <Wrapper key={index}>
            <FetchNote key={index} noteId={noteId} />
          </Wrapper>
        ))
      ) : (
        <Wrapper>
          <h3
            style={{
              fontWeight: "600"
            }}
          >
            No notes yet!
          </h3>
          <p>Start fresh and let your creativity shine.</p>
          <p>
            Create, organize, and make this space your own. Happy note-taking!
          </p>
        </Wrapper>
      )}
    </>
  );
}
