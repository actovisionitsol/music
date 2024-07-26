// MusicPlayer.js

import React, { useEffect, useRef, useState } from 'react';
import './MusicPlayer.css';

const MusicPlayer = ({ song }) => {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentSong, setCurrentSong] = useState(null);

    useEffect(() => {
        const savedSong = localStorage.getItem('currentSong');
        const savedTime = localStorage.getItem('currentTime');
        if (savedSong) {
            setCurrentSong(savedSong);
            audioRef.current.src = savedSong;
            if (savedTime) {
                audioRef.current.currentTime = parseFloat(savedTime);
            }
            audioRef.current.play();
            setIsPlaying(true);
        }
    }, []);

    useEffect(() => {
        if (song && song.downloadUrl && song.downloadUrl.length > 4 && song.downloadUrl[4].url !== currentSong) {
            setCurrentSong(song.downloadUrl[4].url);
            audioRef.current.src = song.downloadUrl[4].url;
            audioRef.current.play();
            setIsPlaying(true);
            localStorage.setItem('currentSong', song.downloadUrl[4].url);
            localStorage.setItem('currentTime', 0);
        }
    }, [song, currentSong]);

    const togglePlayPause = () => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleTimeUpdate = () => {
        localStorage.setItem('currentTime', audioRef.current.currentTime);
    };

    return (
        <div className="music-player">
            <div className="song-info">
                <h5>{song.name}</h5>
                <p>{song.artists.primary.map(artist => artist.name).join(', ')}</p>
            </div>
            <audio ref={audioRef} onTimeUpdate={handleTimeUpdate} controls controlsList="nodownload" class="audio" />
            <button onClick={togglePlayPause} className="play-pause-btn">
                {isPlaying ? 'Pause' : 'Play'}
            </button>
        </div>
    );
};

export default MusicPlayer;
