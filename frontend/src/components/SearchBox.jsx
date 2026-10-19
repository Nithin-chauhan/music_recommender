import { useMemo, useState } from "react";

// Text input with a filtered suggestion list (keyboard friendly)
export default function SearchBox({ songs, onSearch, loading }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return songs.filter((s) => s.toLowerCase().includes(q)).slice(0, 8);
  }, [query, songs]);

  const submit = (value) => {
    const song = (value ?? query).trim();
    if (!song) return;
    setQuery(song);
    setOpen(false);
    onSearch(song);
  };

  const onKeyDown = (e) => {
    if (!open || suggestions.length === 0) {
      if (e.key === "Enter") submit();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => (a + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => (a - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      submit(suggestions[active]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <form
      className="search"
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      <div className="search-field">
        <input
          type="text"
          value={query}
          placeholder="Search a song, e.g. Hue Bechain"
          aria-label="Song name"
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setActive(0);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 120)}
          onKeyDown={onKeyDown}
        />
        {open && suggestions.length > 0 && (
          <ul className="suggestions" role="listbox">
            {suggestions.map((s, i) => (
              <li
                key={s}
                role="option"
                aria-selected={i === active}
                className={i === active ? "active" : ""}
                onMouseDown={() => submit(s)}
                onMouseEnter={() => setActive(i)}
              >
                {s}
              </li>
            ))}
          </ul>
        )}
      </div>
      <button type="submit" disabled={loading || !query.trim()}>
        {loading ? "Finding…" : "Recommend"}
      </button>
    </form>
  );
}
