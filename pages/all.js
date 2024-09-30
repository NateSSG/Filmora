import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import MovieCard from '../components/MovieCard';
import Meta from '../components/Meta';
import Slider from 'react-slick';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const AllMovies = () => {
  const [allMovies, setAllMovies] = useState([]);
  const [categorizedMovies, setCategorizedMovies] = useState({});
  const [genres, setGenres] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchMovies = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await axios.get(`/api/movies?page=${page}`);
      setAllMovies(prevMovies => [...prevMovies, ...response.data.results]);
      setPage(prevPage => prevPage + 1);
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
    setLoading(false);
  };

  const fetchGenres = async () => {
    try {
      const response = await axios.get('/api/genres');
      setGenres(response.data.genres);
    } catch (error) {
      console.error('Error fetching genres:', error);
    }   
  };

  const fetchMoviesByGenre = async (genreId) => {
    try {
      const response = await axios.get(`/api/movies/genre/${genreId}`);
      return response.data.results;
    } catch (error) {
      console.error(`Error fetching movies for genre ${genreId}:`, error);
      return [];
    }
  };

  useEffect(() => {
    fetchMovies();
    fetchGenres();
  }, []);

  useEffect(() => {
    const fetchCategorizedMovies = async () => {
      const categorized = {};
      for (const genre of genres) {
        categorized[genre.name] = await fetchMoviesByGenre(genre.id);
      }
      setCategorizedMovies(categorized);
    };

    if (genres.length > 0) {
      fetchCategorizedMovies();
    }
  }, [genres]);

  const CategorySlider = ({ title, movies: initialMovies, isAllMovies, genreId }) => {
    const categorySliderRef = useRef(null);
    const [movies, setMovies] = useState(initialMovies);
    const [currentPage, setCurrentPage] = useState(1);

    const sliderSettings = {
      dots: false,
      infinite: true,
      speed: isAllMovies ? 5000 : 500,
      slidesToShow: 5,
      slidesToScroll: 1,
      autoplay: isAllMovies,
      autoplaySpeed: isAllMovies ? 0 : 3000,
      cssEase: isAllMovies ? "linear" : "ease-in-out",
      pauseOnHover: true,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1,
          }
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
          }
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
          }
        }
      ],
      beforeChange: (current, next) => {
        if (next + 5 >= movies.length - 5) {
          fetchMoreMovies();
        }
      }
    };

    const fetchMoreMovies = async () => {
      if (loading) return;
      setLoading(true);
      try {
        const nextPage = currentPage + 1;
        const response = await axios.get(isAllMovies ? `/api/movies?page=${nextPage}` : `/api/movies/genre/${genreId}?page=${nextPage}`);
        const newMovies = response.data.results;
        
        const uniqueNewMovies = newMovies.filter(newMovie => !movies.some(existingMovie => existingMovie.id === newMovie.id));
        
        if (uniqueNewMovies.length > 0) {
          setMovies(prevMovies => [...prevMovies, ...uniqueNewMovies]);
          setCurrentPage(nextPage);
        }
      } catch (error) {
        console.error('Error fetching more movies:', error);
      }
      setLoading(false);
    };

    return (
      <div className="mb-10">
        <h2 className="text-accent text-2xl font-bold mb-4">{title}</h2>
        <div className="relative">
          <Slider ref={categorySliderRef} {...sliderSettings} className="movie-slider">
            {movies.map(movie => (
              <div key={movie.id} className="px-2">
                <MovieCard movie={movie} />
              </div>
            ))}
          </Slider>
        </div>
        {loading && <p className="text-center mt-4 text-accent">Loading more movies...</p>}
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-b from-gray-900 to-black min-h-screen">
      <Meta title="All Movies" />
      <div className="container max-w-7xl mx-auto pt-16 pb-20 px-4">
        <h1 className="text-accent text-5xl font-bold mb-10 text-center">All Movies</h1>
        <CategorySlider title="All Movies" movies={allMovies} isAllMovies={true} genreId={null} />
        
        {Object.entries(categorizedMovies).map(([category, movies]) => (
          <CategorySlider 
            key={category} 
            title={category} 
            movies={movies} 
            isAllMovies={false} 
            genreId={genres.find(genre => genre.name === category)?.id}
          />
        ))}

        {loading && <p className="text-center mt-8 text-accent">Loading...</p>}
      </div>
    </div>
  );
};

export default AllMovies;