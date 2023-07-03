import useSWR from "swr";
import { getApiFetcher } from "@/utils/api";
import { Note } from "@/types/Note";

function useNote(noteId: Note["id"]) {
  const fetcher = getApiFetcher<Note, never>({
    method: "GET"
  });

  const {
    data: note,
    mutate,
    error: gotError,
    isLoading: loading
  } = useSWR(`note/${noteId}`, fetcher);

  const error = gotError ? (gotError as Error) : undefined;

  return {
    loading,
    note,
    mutate,
    error
  };
}

export default useNote;
