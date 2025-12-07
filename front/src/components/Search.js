import React, { useState } from 'react';
import getMovie from '../movies.js';
import send from '../email.js';
import './Search.css'; // external stylesheet

function Search() {
  const [results, setResults] = useState([]);
  const [addedMovies, setAddedMovies] = useState([]);
  const [emailBody, setEmailBody] = useState('');

  // Handle movie search
  const handleSubmit = async (event) => {
    event.preventDefault();
    const query = event.target.search.value.trim();
    if (!query) return;

    try {
      const res = await getMovie(query);
      setResults(res.results || []);
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
    setEmailBody(updatedMovies.join('. ') + '.');
  };

  // Send email
  const sendEmail = async (event) => {
    event.preventDefault();
    const recipient = event.target.email.value;
    if (!recipient) return;

    alert('📧 Sending email...');

    const data = { recipient, txt: emailBody };

    try {
      const res = await send(data);
      if (res.status === 200) {
        alert('✅ Email was sent successfully!');
        setAddedMovies([]);
        setEmailBody('');
      } else {
        alert('⚠️ Unable to send Email. Please try again later.');
      }
    } catch (err) {
      console.error(err);
      alert('❌ Error sending email.');
    }
  };

  return (
    <div className="search-page">
      {/* Header */}
      <header className="header">
        <h1>🎥 Movie Finder</h1>
        <p>Search, build your playlist, and get updates by email ✨</p>
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
        <div className="playlist">
          <h2>📝 Your Playlist</h2>
          {addedMovies.length === 0 ? (
            <p className="empty">No movies added yet.</p>
          ) : (
            <ul>
              {addedMovies.map((movie) => (
                <li key={movie}>{movie}</li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Email Form */}
      <div className="email-section">
        <form onSubmit={sendEmail} className="email-form">
          <p>
            📧 Enter your email to receive info about your selected movies:
          </p>
          <input type="email" id="email" name="email" placeholder="you@example.com" required />
          <button type="submit">Send Email ✉️</button>
        </form>
      </div>
    </div>
  );
}

export default Search;
