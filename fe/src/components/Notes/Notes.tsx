import { useUser } from "@/hooks/User/useUser";
import { useNoteList } from "@/hooks/Notes/useNoteList";
import { Note } from "@/types/Note";
import { useNote } from "@/hooks/Notes/useNote";

type NoteProps = {
  noteId: Note["id"];
};

function Note({ noteId }: NoteProps) {
  const { note, loading } = useNote(noteId);

  if (loading || !note) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2>{note.title}</h2>
      <p>{note.contents}</p>
    </div>
  );
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
            <Note key={index} noteId={noteId} />
          </li>
        ))
      ) : (
        <p>No notes yet...</p>
      )}
    </div>
  );
}
