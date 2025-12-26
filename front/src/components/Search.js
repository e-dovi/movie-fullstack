import React, { useState, useEffect } from 'react';
import getMovie from '../movies.js';
import './Search.css'; // external stylesheet

function Search() {
  const [results, setResults] = useState([]);
  const [addedMovies, setAddedMovies] = useState([]);

  // Load watchlist from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('watchlist');
    if (stored) {
      const parsed = JSON.parse(stored);
      setAddedMovies(parsed);
    }
  }, []);

  // Save watchlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('watchlist', JSON.stringify(addedMovies));
  }, [addedMovies]);

  // Handle movie search
  const handleSubmit = async (event) => {
    event.preventDefault();
    const query = event.target.search.value.trim();
    if (!query) return;
  
    try {
      const res = await getMovie(query);
  
      if (res?.error) {
        alert(`${res.error} ⚠️`);
        return;
      }
  
      setResults(res?.results || []);
  
    } catch (err) {
      console.error(err);
      alert("⚠️ Something went wrong. Please try again later.");
    }
  };
  

  // Add movie to playlist
  const handleAddMovie = (title, releaseDate) => {
    const movieLabel = `🎬 ${title} (📅 ${releaseDate})`;

    if (addedMovies.includes(movieLabel)) {
      alert('❌ Movie already added.');
      return;
    }

    const updatedMovies = [...addedMovies, movieLabel];
    setAddedMovies(updatedMovies);
  };
  
  // Remove movie from playlist
  const handleRemoveMovie = (movieLabel) => {
      const updated = addedMovies.filter((m) => m !== movieLabel);
      setAddedMovies(updated);
    };
  

  // Export watchlist as text file
  const exportWatchlist = () => {
    const blob = new Blob([addedMovies.join('\n')], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'my-watchlist.txt';
    link.click();
  };

  // Share watchlist (native share or clipboard fallback)
  const shareWatchlist = async () => {
    const text = `My Watchlist:\n${addedMovies.join('\n')}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'My Watchlist', text });
      } catch (err) {
        console.error('Share failed:', err);
      }
    } else {
      await navigator.clipboard.writeText(text);
      alert('✅ Watchlist copied to clipboard!');
    }
  };


  return (
    <div className="search-page">
      {/* Header */}
      <header className="header">
        <h1>🎥 Movie Finder</h1>
        <p>Search, build your playlist, and save or share with friends and family ✨</p>
      </header>

      {/* Search Box */}
      <div className="search-box">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            id="search"
            name="search"
            placeholder="🔍 Search movie here..."
            required
          />
          <button type="submit">Search 🚀</button>
        </form>
      </div>

      {/* Results + Playlist */}
      <a href="#playlist" className="jump-to-playlist">
        ⬇️ Jump to Playlist
      </a>
      <div className="main-grid">
        {/* Results */}
        <div className="results">
          <h2>📚 Results</h2>
          {results.length === 0 ? (
            <p className="empty">No movies yet. Try searching!</p>
          ) : (
            <div className="results-grid">
              {results.map((movie) => (
                <div key={movie.id} className="result-card">
                  <div className="movie-info">
                    <h3>{movie.title}</h3>
                    <p>{movie.overview}</p>
                  </div>
                  <button
                    type="button"
                    className="add-btn"
                    onClick={() => handleAddMovie(movie.title, movie.release_date)}
                  >
                    ➕ Add
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Playlist */}
        <div className="playlist" id="playlist">
          <h2>📝 Your Playlist</h2>
          {addedMovies.length === 0 ? (
            <p className="empty">No movies added yet.</p>
          ) : (
            <div>
              <ul>
                {addedMovies.map((movie) => (
                    <li key={movie} className="playlist-item">
                    <span>{movie}</span>
                    <button
                        className="remove-btn"
                        onClick={() => handleRemoveMovie(movie)}>
                        ➖
                    </button>
                    </li>
                ))}
                </ul>

              <div className="playlist-actions">
                <button onClick={exportWatchlist}>📤 Export</button>
                <button onClick={shareWatchlist}>🔗 Share</button>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

export default Search;
