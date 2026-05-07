import { useFavoriteRepos } from "@/hooks/useFavoriteRepos";
import { useFavoriteRepoStore } from "@/store/useFavoriteRepoStore";
import { useEffect } from "react";
import { RepositoryListView } from "./RepositoryListView";

export function FavoriteRepositoryList() {
  const { loadFavorites, isLoading } = useFavoriteRepos();

  const savedRepos = useFavoriteRepoStore((state) => state.savedRepos);
  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  return (
    <RepositoryListView
      data={savedRepos}
      title="Favorite Repositorioes"
      emptyMessage="No favorite repository were found."
      loading={isLoading}
    />
  );
}
