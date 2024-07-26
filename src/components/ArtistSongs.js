
import React, { useEffect, useState } from 'react';
import './ArtistSongs.css'; // Import the CSS file for styling

const ArtistSongs = ({ artistId, onBack }) => {
  const [songs, setSongs] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchArtistSongs = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`https://saavn.dev/api/artists/${artistId}`);
        const data = await response.json();
        if (data.success && data.data && Array.isArray(data.data.topSongs)) {
          setSongs(data.data.topSongs);
        } else {
          console.error('Expected an array of songs in the data.topSongs key');
        }
      } catch (error) {
        setError('Error fetching data: ' + error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArtistSongs();
  }, [artistId]);

  return (
    <div className="artist-songs-container">
      <button onClick={onBack} className="back-button">Back</button>
      {error && <p>{error}</p>}
      <div className={`row ${isLoading ? "" : "d-none"}`}>
        <div className="col-12 py-5 text-center">
          <div className="spinner-border" style={{ width: "3rem", height: "3rem" }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
      <div className="songs-container">
        {songs.map((song) => (
          <div key={song.id} className="song">
            <h3>{song.name}</h3>
            <p>{song.album.name}</p>
            <img src={song.image[1].url} alt={song.name} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArtistSongs;
