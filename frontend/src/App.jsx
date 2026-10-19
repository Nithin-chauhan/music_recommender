import { useEffect, useState } from "react";
import { fetchRecommendations, fetchSongs } from "./api";
import SearchBox from "./components/SearchBox";
import SongCard from "./components/SongCard";

export default function App() {
  const [songs, setSongs] = useState([]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSongs()
      .then(setSongs)
      .catch(() => setError("Cannot reach the backend. Start it with: uvicorn main:app --reload"));
  }, []);

  const handleSearch = async (song) => {
    setLoading(true);
    setError("");
    try {
      setResult(await fetchRecommendations(song));
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setResult(null);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <header className="hero">
        <p className="eyebrow">TF-IDF · Cosine Similarity · {songs.length || "…"} songs</p>
        <h1>
          Bollywood Music <em>Recommender</em>
        </h1>
        <p className="subtitle">Search a song you love and discover five that sound like it.</p>
        <SearchBox songs={songs} onSearch={handleSearch} loading={loading} />
        {error && <p className="error">{error}</p>}
      </header>

      {result && (
        <main>
          <section>
            <h2>You searched for</h2>
            <SongCard song={result.searched} featured />
          </section>
          <section>
            <h2>Top {result.recommendations.length} recommendations</h2>
            <div className="grid">
              {result.recommendations.map((s, i) => (
                <SongCard key={`${result.searched.id}-${s.id}`} song={s} rank={i + 1} onSelect={handleSearch} />
              ))}
            </div>
          </section>
        </main>
      )}

      {!result && !error && (
        <p className="hint">Try “Ek Haseena Thi Ek Deewana Tha”, “Kesariya” or “Apna Bana Le”.</p>
      )}

      <footer>Dataset: Spotify Bollywood songs, 2017–2023</footer>
    </div>
  );
}
