// Base URL of the FastAPI backend. In development Vite proxies /api to port 8000.
const API_URL = "/api";

export async function fetchSongs() {
  const res = await fetch(`${API_URL}/songs`);
  if (!res.ok) throw new Error("Could not load the song list");
  return res.json();
}

export async function fetchRecommendations(song, topN = 5) {
  const params = new URLSearchParams({ song, top_n: topN });
  const res = await fetch(`${API_URL}/recommend?${params}`);
  if (res.status === 404) throw new Error("Song not found. Pick one from the suggestions.");
  if (!res.ok) throw new Error("Something went wrong. Is the backend running?");
  return res.json();
}

