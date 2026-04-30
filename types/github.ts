export interface GitHubOwner {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: "User" | "Organization";
  site_admin: boolean;
}

export interface GitHubLicense {
  key: string;
  name: string;
  spdx_id: string;
  url: string | null;
  node_id: string;
}

export interface GitHubRepository {
  id: number;
  node_id: string;
  name: string;
  full_name: string;
  private: boolean;
  owner: GitHubOwner;
  html_url: string;
  description: string | null;
  fork: boolean;
  url: string;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  git_url: string;
  ssh_url: string;
  clone_url: string;
  svn_url: string;
  homepage: string | null;
  size: number;
  stargazers_count: number;
  watchers_count: number;
  language: string | null;
  has_issues: boolean;
  has_projects: boolean;
  has_downloads: boolean;
  has_wiki: boolean;
  has_pages: boolean;
  forks_count: number;
  mirror_url: string | null;
  archived: boolean;
  disabled: boolean;
  open_issues_count: number;
  license: GitHubLicense | null;
  allow_forking: boolean;
  is_template: boolean;
  topics: string[];
  visibility: "public" | "private";
  forks: number;
  open_issues: number;
  watchers: number;
  default_branch: string;
  score?: number;
}

export interface GitHubSearchResponse {
  total_count: number;
  incomplete_results: boolean;
  items: GitHubRepository[];
}

export interface SavedRepository {
  id: number;
  name: string;
  full_name: string;
  owner: {
    login: string;
    avatar_url: string;
  };
  description: string | null;
  stargazers_count: number;
  language: string | null;
  html_url: string;
}

export interface FavoriteRepository {
  id: number;
  name: string;
  full_name: string;
  login: string;
  avatar_url: string;
  description: string | null;
  stargazers_count: number;
  language: string | null;
  html_url: string;
}
