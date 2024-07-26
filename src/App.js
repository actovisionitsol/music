// App.js
import "./App.css";
import { useContext, useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import { MusicContext } from "./Context";
import MusicPlayer from "./components/MusicPlayer";
import ArtistSongs from "./components/ArtistSongs";
import SingleAlbum from "./components/SingleAlbum";
import Playlist from "./components/Playlist";
import PlaylistSlider from "./components/PlaylistSlider";
import './components/MusicPlayer.css';

function App() {
    const [keyword, setKeyword] = useState("");
    const [message, setMessage] = useState("");
    const [songs, setSongs] = useState([]);
    const [albums, setAlbums] = useState([]);
    const [playlists, setPlaylists] = useState([]); 
    const [error, setError] = useState(null);
    const [selectedSong, setSelectedSong] = useState(null);
    const [searchType, setSearchType] = useState("song");
    const [selectedArtist, setSelectedArtist] = useState(null);
    const [selectedAlbum, setSelectedAlbum] = useState(null);
    const [selectedPlaylist, setSelectedPlaylist] = useState(null);

    const musicContext = useContext(MusicContext);
    const isLoading = musicContext.isLoading;
    const setIsLoading = musicContext.setIsLoading;

    const fetchMusicData = async () => {
        setIsLoading(true);
        try {
            let endpoint = '';
            if (searchType === "song") {
                endpoint = `https://saavn.dev/api/search/songs?query=${keyword}`;
            } else if (searchType === "artist") {
                endpoint = `https://saavn.dev/api/search/artists?query=${keyword}`;
            } else if (searchType === "album") {
                endpoint = `https://saavn.dev/api/search/albums?query=${keyword}`;
            } else if (searchType === "playlist") {
                endpoint = `https://saavn.dev/api/search/playlists?query=${keyword}`;
            }
            
            const response = await fetch(endpoint);
            const data = await response.json();
            if (data.success && data.data && Array.isArray(data.data.results)) {
                if (searchType === "album") {
                    setAlbums(data.data.results);
                } else if (searchType === "playlist") {
                    setPlaylists(data.data.results);
                } else {
                    setSongs(data.data.results);
                }
            } else {
                console.error('Expected an array of results in the data.results key');
            }
        } catch (error) {
            setError('Error fetching data: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
            fetchMusicData();
        }
    };

    useEffect(() => {
        fetchMusicData();
    }, [searchType]);

    const handleArtistClick = (artist) => {
        setSelectedArtist(artist);
    };

    const handleAlbumClick = (album) => {
        setSelectedAlbum(album);
    };

    const handlePlaylistClick = (playlist) => {
        setSelectedPlaylist(playlist);
    };

    const handleBack = () => {
        setSelectedArtist(null);
        setSelectedAlbum(null);
        setSelectedPlaylist(null);
    };

    const truncateText = (text, maxLength) => {
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };

    return (
        <>
            <Navbar
                keyword={keyword}
                setKeyword={setKeyword}
                handleKeyPress={handleKeyPress}
                fetchMusicData={fetchMusicData}
            />
            <div className="search-type-toggle">
                <button onClick={() => setSearchType("song")} className={searchType === "song" ? "active" : ""}>Search by Song</button>
                <button onClick={() => setSearchType("artist")} className={searchType === "artist" ? "active" : ""}>Search by Artist</button>
                <button onClick={() => setSearchType("album")} className={searchType === "album" ? "active" : ""}>Search by Album</button>
                <button onClick={() => setSearchType("playlist")} className={searchType === "playlist" ? "active" : ""}>Search by Playlist</button>
            </div>
            <div className="container">
                {error && <p>{error}</p>}
                <div className={`row ${isLoading ? "" : "d-none"}`}>
                    <div className="col-12 py-5 text-center">
                        <div className="spinner-border" style={{ width: "3rem", height: "3rem" }} role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                </div>
                {!selectedArtist && !selectedAlbum && !selectedPlaylist ? (
                    <>
                        {playlists.length > 0 && (
                            <PlaylistSlider playlists={playlists} onPlaylistClick={handlePlaylistClick} />
                        )}
                        <div id="results-container" className="results-container">
                            {searchType === "album" ? (
                                <div className="album-grid">
                                    {albums.map((album) => (
                                        <div key={album.id} className="album" onClick={() => handleAlbumClick(album)}>
                                            <h5>{truncateText(album.name, 12)}</h5>
                                            <img src={album.image[1].url} alt={album.name} />
                                        </div>
                                    ))}
                                </div>
                            ) : searchType === "playlist" ? (
                                <div className="playlist-grid">
                                    {playlists.map((playlist) => (
                                        <div key={playlist.id} className="playlist" onClick={() => handlePlaylistClick(playlist)}>
                                            <h5>{truncateText(playlist.name, 12)}</h5>
                                            <img src={playlist.image[1].url} alt={playlist.name} />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="song-list">
                                    {songs.map((item) => (
                                        <div key={item.id} className="song" onClick={() => searchType === "song" ? setSelectedSong(item) : handleArtistClick(item)}>
                                            <h3>{item.name}</h3>
                                            <img src={item.image[1].url} alt={item.name} />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    selectedArtist ? (
                        <ArtistSongs artistId={selectedArtist.id} onBack={handleBack} />
                    ) : selectedAlbum ? (
                        <SingleAlbum albumId={selectedAlbum.id} onBack={handleBack} onSongSelect={setSelectedSong} />
                    ) : (
                        <Playlist playlistId={selectedPlaylist.id} onBack={handleBack} onSongSelect={setSelectedSong} />
                    )
                )}
            </div>
            {selectedSong && <MusicPlayer song={selectedSong} />}
        </>
    );
}

export default App;
