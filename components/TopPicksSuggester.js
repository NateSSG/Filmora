import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { server } from '../config';
import Link from 'next/link';
import Slider from 'react-slick';
import MovieCard from './MovieCard'; // Ensure this import is correct
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const TopPicksSuggester = () => {
  const [topPicks, setTopPicks] = useState([]);

  useEffect(() => {
    const fetchTopPicks = async () => {
      try {
        const response = await axios.get(
          `${server}/top_rated?api_key=7f4278b49b0dad56afbecf67d0b4a002&language=en-US&page=1`
        );
        const shuffled = response.data.results.sort(() => 0.5 - Math.random());
        setTopPicks(shuffled.slice(0, 10));
      } catch (error) {
        console.error('Error fetching top picks:', error);
      }
    };

    fetchTopPicks();
  }, []);

  const settings = {
    dots: false, // Set this to false to remove the dots
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 4,
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        }
      }
    ]
  };

  return (
    <div className="bg-black text-white p-6 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-6">Top Picks</h2>
      <Slider {...settings}>
        {topPicks.map((movie) => (
          <div key={movie.id} className="px-3">
            <Link href={`/movie/${movie.id}`} passHref>
              <MovieCard movie={movie} />
            </Link>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default TopPicksSuggester;
