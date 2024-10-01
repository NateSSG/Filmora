import React from 'react';
import axios from 'axios';
import PopularMovie from '../components/PopularMovie';
import Meta from '../components/Meta';

export default function Movies({ movies, genres }) {
  return (
    <div className="bg-gray-900 min-h-screen">
      <Meta title="Movies" />
      <div className="container max-w-6xl mx-auto pb-10 px-4"> {/* Reduced max width */}
        <h1 className="text-white text-2xl mt-8 mb-5">Popular Movies</h1>
        <PopularMovie movies={movies} genres={genres} />
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  try {
    const API_URL = process.env.API_URL || 'https://api.themoviedb.org/3';
    const API_KEY = process.env.API_KEY;

    // Fetch popular movies
    const movieResponse = await axios.get(`${API_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`);
    let movies = movieResponse.data.results;

    // Fetch genres
    const genreResponse = await axios.get(`${API_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`);
    const genres = genreResponse.data.genres;

    // Fetch certification for each movie
    const moviePromises = movies.map(movie => 
      axios.get(`${API_URL}/movie/${movie.id}/release_dates?api_key=${API_KEY}`)
    );
    const movieDetailsResponses = await Promise.all(moviePromises);

    // Add certification to each movie
    movies = movies.map((movie, index) => {
      const releaseDates = movieDetailsResponses[index].data.results;
      const usRelease = releaseDates.find(r => r.iso_3166_1 === "US");
      const certification = usRelease && usRelease.release_dates[0] ? usRelease.release_dates[0].certification : "Not Rated";
      return { ...movie, certification };
    });

    return {
      props: { movies, genres }
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      props: { movies: [], genres: [], error: error.message }
    };
  }
}