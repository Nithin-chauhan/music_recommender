import { useState } from "react";

export default function SongCard({ song, rank, featured = false, onSelect }) {
  const [imgFailed, setImgFailed] = useState(false);
  const match = song.similarity != null ? Math.round(song.similarity * 100) : null;

  return (
    <article className={`card ${featured ? "card-featured" : ""}`}>
      {song.thumbnail && !imgFailed ? (
        <img
          src={song.thumbnail}
          alt={`${song.song_name} thumbnail`}
          loading="lazy"
          onError={() => setImgFailed(true)}
        />
      ) : (
        <div className="thumb-fallback">♪</div>
      )}
      <div className="card-body">
        {rank != null && <span className="rank">#{rank}</span>}
        <h3>{song.song_name}</h3>
        <p className="artist">{song.artist}</p>
        <p className="meta">
          {song.album} · {song.release}
        </p>
        <div className="card-footer">
          {match != null && <span className="match">{match}% match</span>}
          {onSelect && (
            <button type="button" className="link" onClick={() => onSelect(song.song_name)}>
              More like this →
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
