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

  useEffect(() => {
    const savedGenre = sessionStorage.getItem('selectedGenre');
    if (savedGenre) {
      const genreId = parseInt(savedGenre, 10);
      setSelectedGenre(isNaN(genreId) ? null : genreId); // Default to null if NaN
      fetchMovies(); // Fetch movies immediately after setting the genre
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem('selectedGenre', selectedGenre); // Store the selected genre in sessionStorage
    setAllMovies([]); // Clear all movies
    setCategorizedMovies({}); // Clear categorized movies
    setPage(1); // Reset page to 1
    fetchMovies(); // Fetch movies based on the selected genre
  }, [selectedGenre]);

  const fetchMovies = async () => {
    if (loading) return; // Prevent multiple fetch calls
    setLoading(true); // Set loading to true before fetching
    try {
      let allFetchedMovies = [];
      let currentPage = page; // Start from the current page
      let totalFetched = 0;

      // Fetch movies until we have at least 70 or there are no more pages
      while (totalFetched < 70) {
        const response = await axios.get(`/api/movies`, {
          params: {
            page: currentPage,
            with_genres: selectedGenre ? selectedGenre : undefined
          }
        });

        // Add the fetched movies to the array
        allFetchedMovies = [...allFetchedMovies, ...response.data.results];
        totalFetched += response.data.results.length;

        // Break if there are no more movies to fetch
        if (response.data.results.length < 20) break; // If less than 20 results, stop fetching

        currentPage++; // Move to the next page
      }

   

      if (selectedGenre) {
        // Set categorized movies only for the selected genre
        setCategorizedMovies(prevState => ({
          ...prevState,
          [genres.find(genre => genre.id === selectedGenre)?.name]: allFetchedMovies
        }));
        setAllMovies([]); // Clear allMovies when a genre is selected
      } else {
        setAllMovies(prevMovies => [...new Set([...prevMovies, ...allFetchedMovies])]);
      }
      setPage(currentPage); // Update the page state
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false); // Reset loading state after fetching
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
      return response.data.results; // Ensure this returns the correct movie data
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
        try {
            for (const genre of genres) {
                categorized[genre.name] = await fetchMoviesByGenre(genre.id);
            }
            setCategorizedMovies(categorized);
        } catch (error) {
            console.error('Error fetching categorized movies:', error);
        }
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
    const isMounted = useRef(true); // Track if the component is mounted

    useEffect(() => {
      isMounted.current = true; // Set to true when the component mounts

      return () => {
        isMounted.current = false; // Set to false when the component unmounts
      };
    }, []);

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
          if (isMounted.current) { // Check if the component is still mounted
            setMovies(prevMovies => [...prevMovies, ...uniqueNewMovies]);
            setCurrentPage(nextPage);
          }
        } else {
          console.log('No new unique movies found');
        }
      } catch (error) {
        console.error('Error fetching more movies:', error);
      } finally {
        if (isMounted.current) { // Check if the component is still mounted
          setLoading(false);
        }
      }
    };

    useEffect(() => {
      setMovies(initialMovies); // Update movies when initialMovies changes
    }, [initialMovies]);

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
              } text-sm md:text-base`} // Adjust text size for mobile
            >
              All
            </button>
            {genres.map((genre) => (
              <button
                key={genre.id}
                onClick={() => setSelectedGenre(genre.id)}
                className={`px-4 py-2 rounded ${
                  selectedGenre === genre.id ? 'bg-primary text-white' : 'bg-gray-700 text-gray-300'
                } text-sm md:text-base`} // Adjust text size for mobile
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