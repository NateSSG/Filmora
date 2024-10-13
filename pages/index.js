import React, { useState, useEffect } from "react";
import Link from "next/link";
import Meta from "../components/Meta";
import Hero from "../components/Hero";
import axios from "axios";

const Home = () => {
  const [randomMovies, setRandomMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRandomMovies = async () => {
      try {
        const response = await axios.get("/api/movies?page=1");
        const shuffledMovies = response.data.results.sort(() => 0.5 - Math.random());
        setRandomMovies(shuffledMovies.slice(0, 3)); // Get 3 random movies
        setLoading(false);
      } catch (error) {
        console.error("Error fetching random movies:", error);
        setLoading(false);
      }
    };

    fetchRandomMovies();
  }, []);

  return (
    <div className="bg-gradient-to-b from-background to-background-dark min-h-screen text-white">
      <Meta
        title="MovieExplorer - Your Ultimate Movie Destination"
        description="Discover the world of cinema with MovieExplorer. We bring you the latest and greatest in film, from blockbuster hits to indie gems."
      />
      <Hero />
      <div className="container max-w-6xl mx-auto pb-20 px-4">
        <section className="mt-16 mb-20 text-center">
          <h1 className="text-5xl font-bold mb-6 text-primary-light">
            Discover Amazing Movies
          </h1>
          <p className="text-xl mb-8">
            Explore a selection of random movies that you might love!
          </p>
          <div className="flex flex-col md:flex-row md:justify-between md:gap-8">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary-light"></div>
              </div>
            ) : (
              randomMovies.map((movie) => (
                <Link key={movie.id} href={`/movie/${movie.id}`} passHref>
                  <div className="flex justify-center mb-4 md:mb-0 cursor-pointer">
                    <img
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      alt={movie.title}
                      width={300}
                      height={450}
                      className="rounded-lg shadow-lg transition-transform transform hover:scale-105"
                    />
                  </div>
                </Link>
              ))
            )}
          </div>
          <div className="text-center mt-8">
            <Link href="/all">
              <button className="bg-primary-light hover:bg-red-700 text-white py-3 px-6 rounded-full text-lg mt-6 font-bold transition duration-300 ease-in-out transform hover:scale-105">
                EXPLORE
              </button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
