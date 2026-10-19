# 🎵 Bollywood Music Recommendation System

A content-based music recommender for 974 Bollywood songs (Spotify, 2017–2023).
Search a song and get the 5 most similar songs, with thumbnails and a match score.

- **Model:** TF-IDF on song name + artist + album + genre, ranked by cosine similarity
- **Backend:** FastAPI (Python)
- **Frontend:** React (Vite)

## Project structure

```
music_recommender/
├── data/
│   └── Bollywood_Songs_With_Album_Genre.csv   # Dataset
├── notebook/
│   └── model.ipynb                            # Trains the model, saves to backend/artifacts
├── backend/
│   ├── main.py                                # FastAPI app
│   ├── requirements.txt
│   └── artifacts/                             # Trained model (pickle files, already included)
│       ├── songs_df.pkl
│       ├── similarity.pkl
│       └── tfidf_vectorizer.pkl
└── frontend/
    ├── package.json
    ├── vite.config.js                         # Proxies /api → http://127.0.0.1:8000
    ├── index.html
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── App.css
        ├── api.js                             # Calls the backend
        └── components/
            ├── SearchBox.jsx                  # Search with autocomplete
            └── SongCard.jsx                   # Song card with thumbnail + match %
```

## How to run

Requirements: **Python 3.10+** and **Node.js 18+**. Use two terminals.

**Terminal 1 — backend**
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
API docs: http://127.0.0.1:8000/docs

**Terminal 2 — frontend**
```bash
cd frontend
npm install
npm run dev
```
Open http://localhost:5173

## API endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Health check (returns song count) |
| GET | `/songs` | All song names (used for autocomplete) |
| GET | `/recommend?song=<name>&top_n=5` | Searched song + top N similar songs. Returns 404 if not found |

Example response for `/recommend?song=Kesariya&top_n=1`:
```json
{
  "searched": { "id": 872, "song_name": "Kesariya", "artist": "Arijit Singh", "release": 2022, "...": "..." },
  "recommendations": [
    { "id": 146, "song_name": "Kesariya Jugni", "similarity": 0.5, "...": "..." }
  ]
}
```

## Retraining the model (optional)

The trained files are already in `backend/artifacts/`. To retrain:
```bash
pip install jupyter pandas scikit-learn
cd notebook
jupyter notebook model.ipynb   # Run all cells
```
Then restart the backend.

## Improvements over the original tutorial
- Search ignores extra spaces and upper/lower case (this caused the "Song not found" error in the video)
- Fixed the `.index` bug that stopped recommendations from showing
- The searched song is no longer recommended back to itself
- Autocomplete suggestions so song names can't be mistyped
- Similarity score shown as a "% match", and "More like this" to explore from any result
