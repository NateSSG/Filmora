import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PopularMovie from '../components/PopularMovie';
import Meta from '../components/Meta';

export default function Movies({ initialMovies, genres }) {
  const [movies, setMovies] = useState(initialMovies);
  const [selectedGenre, setSelectedGenre] = useState(null);

  useEffect(() => {
    const fetchMoviesByGenre = async () => {
      if (selectedGenre) {
        const response = await axios.get(`/api/movies/genre/${selectedGenre}`);
        setMovies(response.data.results);
      } else {
        setMovies(initialMovies);
      }
    };

    fetchMoviesByGenre();
  }, [selectedGenre, initialMovies]);

  return (
    <div className="bg-gray-900 min-h-screen">
      <Meta title="Movies" />
      <div className="container max-w-6xl mx-auto pb-10 px-4">
        <h1 className="text-white text-2xl mt-8 mb-5">Popular Movies</h1>
        <div className="mb-8">
          <h2 className="text-white text-xl mb-3">Filter by Genre:</h2>
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
        <PopularMovie movies={movies} genres={genres} />
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  try {
    const API_URL = process.env.API_URL || 'https://api.themoviedb.org/3';
    const API_KEY = process.env.API_KEY || '7f4278b49b0dad56afbecf67d0b4a002';

    const movieResponse = await axios.get(`${API_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`);
    const genreResponse = await axios.get(`${API_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`);

    const movies = movieResponse.data.results;
    const genres = genreResponse.data.genres;

    return {
      props: { initialMovies: movies, genres }
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      props: { initialMovies: [], genres: [], error: error.message }
    };
  }
}