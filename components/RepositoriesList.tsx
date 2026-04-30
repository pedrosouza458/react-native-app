import { getTrendingRepos } from "@/services/githubApi";
import { GitHubRepository } from "@/types/github";
import { useEffect, useState } from "react";
import { RepositoryListView } from "./RepositoryListView";

export default function RepositoriesList() {
  const [repos, setRepos] = useState<GitHubRepository[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getTrendingRepos();
        setRepos(Array.isArray(data) ? data : data.items || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <RepositoryListView
      data={repos}
      title="Trending Repositories"
      emptyMessage="No repository were found."
      loading={false}
    />
  );
}
