import React, { useState, useEffect } from 'react';

function SongFetcher() {
  const [songs, setSongs] = useState([]);
  const [error, setError] = useState(null);

  const fetchSongs = async () => {
    try {
      const response = await fetch('https://saavn.dev/api/search/songs?query=neekosam');
      const data = await response.json();
      if (data.success && data.data && Array.isArray(data.data.results)) {
        setSongs(data.data.results);
      } else {
        console.error('Expected an array of songs in the data.results key');
      }
    } catch (error) {
      setError('Error fetching data: ' + error.message);
    }
  };

  useEffect(() => {
    fetchSongs();
  }, []);

  return (
    <div id="songs-container">
      {error && <p>{error}</p>}
      {songs.map((song) => (
        <div key={song.id} className="song">
          <h3>{song.name}</h3>
          <audio src={song.downloadUrl[4].url} controls></audio>
          <img src={song.image[1].url} alt={song.name} />
        </div>
      ))}
    </div>
  );
}

export default SongFetcher;
