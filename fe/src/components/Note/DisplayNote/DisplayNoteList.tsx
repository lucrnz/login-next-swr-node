import React, { PropsWithChildren } from "react";
import useUser from "@/hooks/User/useUser";
import useNoteList from "@/hooks/Notes/useNoteList";
import useNote from "@/hooks/Notes/useNote";
import { Note } from "@/types/Note";
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
