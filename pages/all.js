import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import MovieCard from '../components/MovieCard';
import Meta from '../components/Meta';
import Slider from 'react-slick';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useRouter } from 'next/router';

const AllMovies = () => {
  const [allMovies, setAllMovies] = useState([]);
  const [categorizedMovies, setCategorizedMovies] = useState({});
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const savedScrollPosition = sessionStorage.getItem('scrollPosition');
    if (savedScrollPosition) {
      setScrollPosition(parseInt(savedScrollPosition));
      window.scrollTo(0, parseInt(savedScrollPosition));
    }
    
    const savedPage = sessionStorage.getItem('currentPage');
    if (savedPage) {
      setPage(parseInt(savedPage));
    }

    fetchMovies();
    fetchGenres();

    const handleRouteChange = () => {
      sessionStorage.setItem('scrollPosition', window.pageYOffset.toString());
      sessionStorage.setItem('currentPage', page.toString());
    };

    router.events.on('routeChangeStart', handleRouteChange);

    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, []);


  const fetchMovies = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await axios.get(`/api/movies`, {
        params: {
          page: page,
          with_genres: selectedGenre
        }
      });
      if (selectedGenre) {
        setCategorizedMovies(prevState => ({
          ...prevState,
          [genres.find(genre => genre.id === selectedGenre)?.name]: response.data.results
        }));
      } else {
        setAllMovies(prevMovies => [...new Set([...prevMovies, ...response.data.results])]);
      }
      setPage(prevPage => prevPage + 1);
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

  useEffect(() => {
    setAllMovies([]);
    setCategorizedMovies({});
    setPage(1);
    fetchMovies();
  }, [selectedGenre]);

  useEffect(() => {
    setAllMovies([]);
    setPage(1);
    fetchMovies();
  }, [selectedGenre]);

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
        if (next + 5 >= movies.length - 5 && !loading) {
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
        } else {
          console.log('No new unique movies found');
        }
      } catch (error) {
        console.error('Error fetching more movies:', error);
      } finally {
        setLoading(false);
      }
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
        <h1 className="text-accent text-5xl font-bold mb-10 text-center">Movies</h1>
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-accent mb-4">Filter by Genre:</h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedGenre(null)}
              className={`px-4 py-2 rounded ${
                !selectedGenre ? 'bg-primary text-white' : 'bg-gray-700 text-gray-300'
              }`}
            >
              All
            </button>
            {genres.map((genre) => (
              <button
                key={genre.id}
                onClick={() => setSelectedGenre(genre.id)}
                className={`px-4 py-2 rounded ${
                  selectedGenre === genre.id ? 'bg-primary text-white' : 'bg-gray-700 text-gray-300'
                }`}
              >
                {genre.name}
              </button>
            ))}
          </div>
        </div>
        {!selectedGenre && (
          <CategorySlider title="All Movies" movies={allMovies} isAllMovies={true} genreId={null} />
        )}
        {selectedGenre && (
          <CategorySlider 
            title={genres.find(genre => genre.id === selectedGenre)?.name || "Selected Genre"}
            movies={categorizedMovies[genres.find(genre => genre.id === selectedGenre)?.name] || []}
            isAllMovies={false}
            genreId={selectedGenre}
          />
        )}
        {loading && <p className="text-center mt-8 text-accent">Loading...</p>}
      </div>
    </div>
  );
};


export default AllMovies;