import { useUser } from "@/hooks/User/useUser";
import { useNoteList } from "@/hooks/Notes/useNoteList";
import { useNote } from "@/hooks/Notes/useNote";
import { Note } from "@/types/Note";
import { DisplayNote } from "../DisplayNote/DisplayNote";

type NoteProps = {
  noteId: Note["id"];
};

function FetchNote({ noteId }: NoteProps) {
  const { note, loading } = useNote(noteId);

  if (loading || !note) {
    return <p>Loading...</p>;
  }

  return <DisplayNote note={note} addLink={true} />;
}

export function Notes() {
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

  return (
    <div>
      {noteList.length > 0 ? (
        noteList.map((noteId, index) => (
          <li key={index}>
            <FetchNote key={index} noteId={noteId} />
          </li>
        ))
      ) : (
        <p>No notes yet...</p>
      )}
    </div>
  );
}
