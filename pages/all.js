import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import validateApiRequest from '../utils/validator'; // Import the validator
import MovieCard from '../components/MovieCard';
import Meta from '../components/Meta';
import Slider from 'react-slick';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useRouter } from 'next/router';

const AllMovies = () => {
  const [allMovies, setAllMovies] = useState([]);
  const [displayedMovies, setDisplayedMovies] = useState([]); // New state for displayed movies
  const [categorizedMovies, setCategorizedMovies] = useState({});
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Slider settings for react-slick
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  useEffect(() => {
    fetchMovies();
    fetchGenres();
  }, []);

  const fetchMovies = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await axios.get('/api/movies');
      setAllMovies(response.data.results); // Store all fetched movies
      setDisplayedMovies(response.data.results); // Set displayed movies to all initially
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGenres = async () => {
    try {
      const response = await axios.get('/api/genres');
      setGenres(response.data.genres);
    } catch (error) {
      console.error('Error fetching genres:', error);
    }
  };

  const handleGenreSelect = async (genreId) => {
    setSelectedGenre(genreId);
    if (genreId === null) {
      // If "All" is selected, display random movies from all genres
      const randomMovies = getRandomMovies(allMovies, 10); // Change 10 to the number of random movies you want
      setDisplayedMovies(randomMovies);
    } else if (categorizedMovies[genreId]) {
      // If movies for the selected genre are already fetched, use them
      setDisplayedMovies(categorizedMovies[genreId]);
    } else {
      // Fetch movies for the selected genre if not already fetched
      const response = await axios.get(`/api/movies/genre/${genreId}`);
      setCategorizedMovies(prev => ({ ...prev, [genreId]: response.data.results }));
      setDisplayedMovies(response.data.results);
    }
  };

  const getRandomMovies = (movies, count) => {
    const shuffled = movies.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  return (
    <div className="bg-gradient-to-b from-gray-900 to-black min-h-screen">
      <Meta title="All Movies" />
      <div className="container max-w-7xl mx-auto pt-16 pb-20 px-4">
        <h1 className="text-accent text-5xl font-bold mb-10 text-center">Movies</h1>
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-accent mb-4">Filter by Genre:</h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleGenreSelect(null)}
              className={`px-4 py-2 rounded ${!selectedGenre ? 'bg-primary text-white' : 'bg-gray-700 text-gray-300'}`}
            >
              All
            </button>
            {genres.map((genre) => (
              <button
                key={genre.id}
                onClick={() => handleGenreSelect(genre.id)}
                className={`px-4 py-2 rounded ${selectedGenre === genre.id ? 'bg-primary text-white' : 'bg-gray-700 text-gray-300'}`}
              >
                {genre.name}
              </button>
            ))}
          </div>
        </div>
        <Slider {...sliderSettings} className="movie-slider">
          {displayedMovies.map(movie => (
            <div key={movie.id} className="px-2">
              <MovieCard movie={movie} />
            </div>
          ))}
        </Slider>
        {loading && <p className="text-center mt-8 text-accent">Loading...</p>}
      </div>
    </div>
  );
};

export default AllMovies;