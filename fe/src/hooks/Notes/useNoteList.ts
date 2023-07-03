import useSWR from "swr";
import { getApiFetcher } from "@/utils/api";
import { Note } from "@/types/Note";

function useNoteList() {
  const fetcher = getApiFetcher<Note["id"][], never>({
    method: "GET"
  });

  const {
    data: noteList,
    mutate,
    error: gotError,
    isLoading: loading
  } = useSWR("note/list", fetcher);

  const error = gotError ? (gotError as Error) : undefined;

  return {
    loading,
    noteList,
    mutate,
    error
  };
}

export default useNoteList;
