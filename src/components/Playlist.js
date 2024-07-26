// Playlist.js
import React, { useEffect, useState } from 'react';
import './Playlist.css';

const Playlist = ({ playlistId, onBack, onSongSelect }) => {
    const [playlist, setPlaylist] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchPlaylistDetails = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`https://saavn.dev/api/playlists?id=${playlistId}`);
                const data = await response.json();
                if (data.success && data.data) {
                    setPlaylist(data.data);
                } else {
                    console.error('Error fetching playlist details');
                }
            } catch (error) {
                setError('Error fetching data: ' + error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPlaylistDetails();
    }, [playlistId]);

    const handleSongClick = (song) => {
        onSongSelect(song);
    };

    return (
        <div className="playlist-container">
            <button onClick={onBack} className="back-button">Back</button>
            {error && <p>{error}</p>}
            {isLoading ? (
                <div className="spinner">
                    <div className="spinner-border" style={{ width: "3rem", height: "3rem" }} role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : (
                playlist && (
                    <>
                        <div className="playlist-details">
                            <h3>{playlist.name}</h3>
                            <img src={playlist.image[1].url} alt={playlist.name} />
                            <p>{playlist.description}</p>
                        </div>
                        <div className="songs-list">
                            {playlist.songs.map((song) => (
                                <div key={song.id} className="song" onClick={() => handleSongClick(song)}>
                                    <h5>{song.name}</h5>
                                    <p>{console.log(song.artists)}</p>
                                    <p>{song.album.name}</p>
                                </div>
                            ))}
                        </div>
                    </>
                )
            )}
        </div>
    );
};

export default Playlist;
