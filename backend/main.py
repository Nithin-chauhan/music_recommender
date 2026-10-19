"""FastAPI backend for the Bollywood Music Recommendation System."""
from pathlib import Path

import pandas as pd
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

DATASET = Path(__file__).resolve().parent.parent / "data" / "Bollywood_Songs_With_Album_Genre.csv"
songs = pd.read_csv(DATASET)

# Build the model from the CSV at startup. This avoids loading pandas-version-
# dependent DataFrame pickles distributed with older copies of the project.
features = songs[["song_name", "artist", "album", "genre"]].fillna("").astype(str)
combined = features.agg(" ".join, axis=1)
vectors = TfidfVectorizer(stop_words="english").fit_transform(combined)
similarity = cosine_similarity(vectors)
normalized_names = songs["song_name"].astype(str).str.strip().str.lower()

app = FastAPI(title="Bollywood Music Recommender API", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_methods=["GET"],
    allow_headers=["*"],
)


def song_to_dict(index: int, score: float | None = None) -> dict:
    row = songs.iloc[index]
    release = pd.to_numeric(row.get("release"), errors="coerce")
    data = {
        "id": int(index),
        "song_name": str(row["song_name"]),
        "artist": str(row["artist"]),
        "album": str(row["album"]),
        "genre": str(row["genre"]),
        "release": int(release) if pd.notna(release) else None,
        "thumbnail": row["thumbnail"] if isinstance(row.get("thumbnail"), str) else None,
    }
    if score is not None:
        data["similarity"] = round(float(score), 4)
    return data


def find_index(name: str) -> int | None:
    matches = normalized_names[normalized_names == name.strip().lower()].index
    return int(matches[0]) if len(matches) else None


@app.get("/")
def health():
    return {"status": "ok", "songs": len(songs)}


@app.get("/songs")
def list_songs():
    """All song names, used by the frontend for autocomplete."""
    return sorted(songs["song_name"].astype(str).unique().tolist())


@app.get("/recommend")
def recommend(
    song: str = Query(..., min_length=1, description="Exact song name"),
    top_n: int = Query(5, ge=1, le=20),
):
    index = find_index(song)
    if index is None:
        raise HTTPException(status_code=404, detail=f"Song '{song}' not found")

    scores = sorted(enumerate(similarity[index]), key=lambda x: x[1], reverse=True)
    scores = [s for s in scores if s[0] != index][:top_n]
    return {
        "searched": song_to_dict(index),
        "recommendations": [song_to_dict(i, score) for i, score in scores],
    }
