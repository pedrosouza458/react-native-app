import { useRepoState } from "@/store/useRepoStore";
import { RepositoryListView } from "./RepositoryListView";

export function FavoriteRepositoryList() {
  const { savedRepos } = useRepoState();
  return (
    <RepositoryListView
      data={savedRepos}
      title="Favorite Repositorioes"
      emptyMessage="No favorite repository were found."
      loading={false}
    />
  );
}
