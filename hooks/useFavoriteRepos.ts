import { auth } from "@/services/firebase";
import { syncDatabases } from "@/services/syncDatabases";
import { useFavoriteRepoStore } from "@/store/useFavoriteRepoStore";
import {
  FavoriteRepository,
  GitHubRepository,
  SavedRepository,
} from "@/types/github";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useState } from "react";

export function useFavoriteRepos() {
  const db = useSQLiteContext();
  const setStoreRepos = useFavoriteRepoStore((state) => state.setSavedRepos);
  const [isLoading, setIsLoading] = useState(true);

  const loadFavorites = useCallback(async () => {
    try {
      setIsLoading(true);
      const userId = auth.currentUser?.uid || "guest_user";
      console.log(userId);

      const rows = await db.getAllAsync<FavoriteRepository>(
        `SELECT fr.* FROM favorite_repositories AS fr 
         JOIN user_favorite_repositories AS ufr on fr.id = ufr.repository_id
         WHERE ufr.user_id = ? AND ufr.is_deleted = 0`,
        [userId],
      );

      setStoreRepos(rows.map(toDomain));
    } catch (error) {
      console.error("Failed to load favorite repos: ", error);
    } finally {
      setIsLoading(false);
    }
  }, [db, setStoreRepos]);

  const favorite = async (repo: GitHubRepository) => {
    const favoriteRepo: SavedRepository = {
      id: repo.id,
      name: repo.name || "",
      full_name: repo.full_name || "",
      description: repo.description || "",
      owner: {
        login: repo.owner?.login || "unknown",
        avatar_url: repo.owner?.avatar_url || "",
      },
      language: repo.language || "Unknown",
      stargazers_count: repo.stargazers_count || 0,
      html_url: repo.html_url || "",
    };

    const params = [
      favoriteRepo.id,
      favoriteRepo.name,
      favoriteRepo.full_name,
      favoriteRepo.description,
      favoriteRepo.owner.login,
      favoriteRepo.owner.avatar_url,
      favoriteRepo.stargazers_count,
      favoriteRepo.language,
      favoriteRepo.html_url,
    ];
    try {
      const userId = auth.currentUser?.uid || "guest_user";

      await db.runAsync(
        "INSERT OR REPLACE INTO favorite_repositories (id, name, full_name, description, login, avatar_url, stargazers_count, language, html_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        params,
      );

      if (userId) {
        const repoId = params[0];
        await db.runAsync(
          "INSERT OR REPLACE INTO user_favorite_repositories (user_id, repository_id, is_deleted, is_synced) VALUES (?, ?, 0, 0)",
          [userId, repoId],
        );
      }

      await loadFavorites();

      syncDatabases().catch((error) => {
        console.error("Background sync failed ", error);
      });
    } catch (error) {
      console.error("Error saving repository in database: ", error);
    }
  };

  const unfavorite = async (id: number) => {
    try {
      const userId = auth.currentUser?.uid || "guest_user";

      await db.runAsync(
        "INSERT OR REPLACE INTO user_favorite_repositories (user_id, repository_id, is_deleted, is_synced) VALUES (?, ?, 1, 0)",
        [userId, id],
      );

      await loadFavorites();

      syncDatabases().catch((error) => {
        console.error("Background sync failed ", error);
      });
    } catch (error) {
      console.error("Failed to remove repository in database: ", error);
    }
  };

  return { isLoading, loadFavorites, favorite, unfavorite };
}

function toDomain(row: FavoriteRepository): SavedRepository {
  return {
    id: row.id,
    name: row.name,
    full_name: row.full_name,
    description: row.description,
    stargazers_count: row.stargazers_count,
    language: row.language,
    html_url: row.html_url,
    owner: {
      login: row.login,
      avatar_url: row.avatar_url,
    },
  };
}

function toDatabase(repo: SavedRepository): FavoriteRepository {
  return {
    id: repo.id,
    name: repo.name,
    full_name: repo.full_name,
    login: repo.owner.login,
    avatar_url: repo.owner.avatar_url,
    description: repo.description,
    stargazers_count: repo.stargazers_count,
    language: repo.language || "Unknown",
    html_url: repo.html_url,
  };
}
