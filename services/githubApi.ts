export async function getTrendingRepos() {
  try {
    const baseUrl = "https://api.github.com/search/repositories";
    const date = new Date();
    date.setDate(date.getDate() - 1);
    const dateString = date.toLocaleDateString("en-CA");

    const params = new URLSearchParams({
      q: `created:>${dateString}`,
      sort: "stars",
      order: "desc",
    });

    const response = await fetch(`${baseUrl}?${params.toString()}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.items;
  } catch (error) {
    console.error("Failed to fetch repositories: ", error);
  }
}
