// Slider.js
import React from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './Slider.css';

const PlaylistSlider = ({ playlists, onPlaylistClick }) => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1
    };

    return (
        <div className="playlist-slider">
            <Slider {...settings}>
                {playlists.map((playlist) => (
                    <div key={playlist.id} className="playlist" onClick={() => onPlaylistClick(playlist)}>
                        <img src={playlist.image[1].url} alt={playlist.name} />
                        <h5>{playlist.name}</h5>
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default PlaylistSlider;
