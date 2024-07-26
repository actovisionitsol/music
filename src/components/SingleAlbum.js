// SingleAlbum.js
import React, { useEffect, useState } from 'react';
import './SingleAlbum.css';

const SingleAlbum = ({ albumId, onBack, onSongSelect }) => {
    const [album, setAlbum] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

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

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const renderPagination = (totalItems) => {
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        return (
            <div className="pagination">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                {[...Array(totalPages).keys()].map((page) => (
                    <button
                        key={page}
                        onClick={() => handlePageChange(page + 1)}
                        className={currentPage === page + 1 ? "active" : ""}
                    >
                        {page + 1}
                    </button>
                ))}
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        );
    };

    const displayItems = (items) => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return items.slice(startIndex, endIndex);
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
                        <div className="songs-grid">
                            {displayItems(album.songs).map((song) => (
                                <div key={song.id} className="song" onClick={() => handleSongClick(song)}>
                                    <img src={song.image[1].url} alt={song.name} />
                                    <h5>{truncateText(song.name, 12)}</h5>
                                    <p>By: {song.artists.primary.map(artist => artist.name).join(', ')}</p>
                                </div>
                            ))}
                        </div>
                        {album.songs.length > itemsPerPage && renderPagination(album.songs.length)}
                    </>
                )
            )}
        </div>
    );
};

export default SingleAlbum;
