// SingleAlbum.js
import React, { useEffect, useState } from 'react';
import './SingleAlbum.css';

const SingleAlbum = ({ albumId, onBack, onSongSelect }) => {
    const [album, setAlbum] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchAlbumDetails = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`https://saavn.dev/api/albums?id=${albumId}`);
                const data = await response.json();
                if (data.success && data.data) {
                    setAlbum(data.data);
                } else {
                    console.error('Error fetching album details');
                }
            } catch (error) {
                setError('Error fetching data: ' + error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAlbumDetails();
    }, [albumId]);

    const handleSongClick = (song) => {
        onSongSelect(song);
    };

    const truncateText = (text, maxLength) => {
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };

    return (
        <div className="single-album-container">
            <button onClick={onBack} className="back-button">Back</button>
            {error && <p>{error}</p>}
            {isLoading ? (
                <div className="spinner">
                    <div className="spinner-border" style={{ width: "3rem", height: "3rem" }} role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : (
                album && (
                    <>
                        <div className="album-details">
                            <h2>{album.name}</h2>
                            <img src={album.image[1].url} alt={album.name} />
                            <p>{album.description}</p>
                        </div>
                        <div className="songs-list">
                            {album.songs.map((song) => (
                                <div key={song.id} className="song" onClick={() => handleSongClick(song)}>
                                    <h5>{truncateText(song.name, 12)}</h5>
                                    <p>By: {song.artists.primary.map(artist => artist.name).join(', ')}</p>
                                </div>
                            ))}
                        </div>
                    </>
                )
            )}
        </div>
    );
};

export default SingleAlbum;
