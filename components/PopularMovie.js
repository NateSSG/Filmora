import React, { useState, useEffect } from "react";
import MovieCard from "./MovieCard";
import Slider from "./Slider";

const PopularMovie = ({ initialMovies, genres }) => {
  const [categories, setCategories] = useState({});

  useEffect(() => {
    if (!Array.isArray(genres) || genres.length === 0 || !Array.isArray(initialMovies) || initialMovies.length === 0) {
      console.error('Genres or movies data is missing or invalid');
      return;
    }

    const genreMap = genres.reduce((acc, genre) => {
      if (genre && genre.id) {
        acc[genre.id] = genre.name;
      }
      return acc;
    }, {});

    const categorizedMovies = initialMovies.reduce((acc, movie) => {
      if (movie && movie.genre_ids && Array.isArray(movie.genre_ids)) {
        movie.genre_ids.forEach(genreId => {
          const genreName = genreMap[genreId];
          if (genreName) {
            if (!acc[genreName]) {
              acc[genreName] = [];
            }
            if (acc[genreName].length < 10) {
              acc[genreName].push(movie);
            }
          }
        });
      }
      return acc;
    }, {});

    setCategories(categorizedMovies);
  }, [initialMovies, genres]);

  return (
    <div className="bg-black container max-w-7xl mt-7 pt-1 mx-auto rounded-2xl pb-10 px-4">
      {Object.entries(categories).map(([category, categoryMovies]) => (
        <div key={category} className="mb-8">
          <h2 className="text-accent text-2xl font-bold mb-4">{category}</h2>
          <Slider>
            {categoryMovies.map((movie) => (
              <div key={movie.id} className="w-48 mr-4">
                <MovieCard movie={movie} />
              </div>
            ))}
          </Slider>
        </div>
      ))}
    </div>
  );
};

export default PopularMovie;
