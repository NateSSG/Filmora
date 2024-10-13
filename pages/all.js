import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import MovieCard from '../components/MovieCard';
import Meta from '../components/Meta';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useRouter } from 'next/router';

const AllMovies = () => {
  const [allMovies, setAllMovies] = useState([]);
  const [displayedMovies, setDisplayedMovies] = useState([]);
  const [categorizedMovies, setCategorizedMovies] = useState({});
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [loading, setLoading] = useState(false);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  useEffect(() => {
    const fetchMoviesAndGenres = async () => {
      setLoading(true);
      try {
        const [moviesResponse, genresResponse] = await Promise.all([
          axios.get('/api/movies'),
          axios.get('/api/genres'),
        ]);
        setAllMovies(moviesResponse.data.results);
        setGenres(genresResponse.data.genres);
        setDisplayedMovies(moviesResponse.data.results.slice(0, 10)); // Display only 10 initially
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMoviesAndGenres();
  }, []);

  const handleGenreSelect = async (genreId) => {
    setSelectedGenre(genreId);
    if (genreId === null) {
      setDisplayedMovies(getRandomMovies(allMovies, 10));
    } else if (categorizedMovies[genreId]) {
      setDisplayedMovies(categorizedMovies[genreId]);
    } else {
      const response = await axios.get(`/api/movies/genre/${genreId}`);
      setCategorizedMovies(prev => ({ ...prev, [genreId]: response.data.results }));
      setDisplayedMovies(response.data.results);
    }
  };

  const getRandomMovies = (movies, count) => {
    if (movies.length === 0) return [];
    const shuffled = [...movies].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const preloadImages = () => {
    const imagesToPreload = displayedMovies.slice(0, 3).map(movie => `https://image.tmdb.org/t/p/w500${movie.poster_path}`);
    imagesToPreload.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    });
  };

  useEffect(() => {
    if (displayedMovies.length > 0) {
      preloadImages();
    }
  }, [displayedMovies]);

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
        {loading ? (
          <p className="text-center mt-8 text-accent">Loading movies...</p>
        ) : (
          <Slider {...sliderSettings} className="movie-slider">
            {displayedMovies.map(movie => (
              <div key={movie.id} className="px-2">
                <MovieCard movie={movie} />
              </div>
            ))}
          </Slider>
        )}
      </div>
    </div>
  );
};

export default AllMovies;
