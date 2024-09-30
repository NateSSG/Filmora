import React, { useState, useEffect } from "react";
import { useRouter } from "next/router"; // Import useRouter from Next.js
import MovieCard from "./MovieCard";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const PopularMovie = ({ movies, genres }) => {
  console.log("PopularMovie component. Movies:", movies ? movies.length : 'undefined', "Genres:", genres ? genres.length : 'undefined');

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMovies, setFilteredMovies] = useState([]);
  const router = useRouter(); // Initialize the router
  const [categories, setCategories] = useState({});

  useEffect(() => {
    console.log("useEffect triggered");
    if (!Array.isArray(genres) || genres.length === 0 || !Array.isArray(movies) || movies.length === 0) {
      console.error('Genres or movies data is missing or invalid');
      console.log("Movies:", movies);
      console.log("Genres:", genres);
      return;
    }

    // Create a map of genre IDs to names
    const genreMap = genres.reduce((acc, genre) => {
      acc[genre.id] = genre.name;
      return acc;
    }, {});

    console.log("Genre Map:", genreMap);

    // Categorize movies
    const categorizedMovies = movies.reduce((acc, movie) => {
      if (movie.genre_ids && Array.isArray(movie.genre_ids)) {
        movie.genre_ids.forEach(genreId => {
          const genreName = genreMap[genreId];
          if (genreName) {
            if (!acc[genreName]) {
              acc[genreName] = [];
            }
            acc[genreName].push(movie);
          }
        });
      }
      return acc;
    }, {});

    console.log("Categorized Movies:", categorizedMovies);

    setCategories(categorizedMovies);
    setFilteredMovies(movies);
  }, [movies, genres]);

  const handleSearchChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    if (value) {
      const filtered = movies.filter(movie =>
        movie.title.toLowerCase().startsWith(value)
      );
      setFilteredMovies(filtered);
    } else {
      setFilteredMovies(movies);
    }
  };

  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 5,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        } 
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
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
    variableWidth: true,
  };

  console.log("Rendering. Categories:", categories);
  console.log("Filtered Movies:", filteredMovies);

  if (!movies || !genres) {
    return <div className="text-white">No movie or genre data available.</div>;
  }

  if (Object.keys(categories).length === 0) {
    return <div className="text-white">Categorizing movies...</div>;
  }

  if (!genres || genres.length === 0) {
    return <div className="text-white">No genre data available. Please check your API key and connection.</div>;
  }

  return (
    <div className="bg-black container max-w-7xl mt-7 pt-1 mx-auto rounded-2xl pb-10 px-4">
      <div className="mb-4 flex justify-center">
        <input
          type="text"
          placeholder="Search movies..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="px-4 py-2 rounded-md bg-black border border-gray-600 text-white mb-8 w-full max-w-md"
        />
      </div>
      
      {searchTerm ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredMovies.map((movie) => (
            <div key={movie.id}>
              <MovieCard movie={movie} />
              <p className="text-white text-sm mt-2">Age: {movie.certification}</p>
            </div>
          ))}
        </div>
      ) : (
        Object.entries(categories).map(([category, categoryMovies]) => (
          <div key={category} className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">{category}</h2>
            <Slider {...sliderSettings} className="left-aligned-slider">
              {categoryMovies.map((movie) => (
                <div key={movie.id} className="pr-4">
                  <MovieCard movie={movie} />
                  <p className="text-white text-sm mt-2">Age: {movie.certification}</p>
                </div>
              ))}
            </Slider>
          </div>
        ))
      )}
    </div>
  );
};

export default PopularMovie;
