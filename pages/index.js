import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Meta from '../components/Meta';
import Hero from '../components/Hero';
import TopPicksSuggester from '../components/TopPicksSuggester';
import { FaSearch, FaStar, FaFilm, FaUserPlus } from 'react-icons/fa';
import PopularMovie from '../components/PopularMovie';
import axios from 'axios';

const Home = () => {
  const [popularMovies, setPopularMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopularMovies = async () => {
      try {
        const response = await axios.get('/api/movies?page=1');
        setPopularMovies(response.data.results);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching popular movies:', error);
        setLoading(false);
      }
    };

    fetchPopularMovies();
  }, []);

  return (
    <div className="bg-gradient-to-b from-background to-background-dark min-h-screen text-white">
      <Meta title="MovieExplorer - Your Ultimate Movie Destination" description="Discover the world of cinema with MovieExplorer. We bring you the latest and greatest in film, from blockbuster hits to indie gems." />
      <Hero />
      <div className="container max-w-6xl mx-auto pb-20 px-4">
        <section className="mt-16 mb-20">
          <h1 className="text-5xl font-bold mb-6 text-center text-primary-light">Welcome to Filmiora</h1>
          <p className="text-xl mb-8 text-center max-w-3xl mx-auto">
            Discover the world of cinema with Filmiora. We bring you the latest and greatest in film, from blockbuster hits to indie gems.
          </p>
          <div className="flex justify-center">
            <Link href="/all">
              <a className="bg-secondary hover:bg-secondary-dark text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center">
                <FaSearch className="mr-2" /> Browse All Movies
              </a>
            </Link>
          </div>
        </section>

        <section className="mb-20">
          <h2 className="text-3xl font-semibold mb-8 text-center text-accent">Why Choose Filmiora?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<FaFilm className="text-4xl mb-4 text-primary-light" />}
              title="Extensive Library"
              description="Access thousands of movies across all genres and eras."
            />
            <FeatureCard 
              icon={<FaStar className="text-4xl mb-4 text-primary-light" />}
              title="Personalized Recommendations"
              description="Get movie suggestions tailored to your taste and viewing history."
            />
            <FeatureCard 
              icon={<FaSearch className="text-4xl mb-4 text-primary-light" />}
              title="Advanced Search"
              description="Find exactly what you're looking for with our powerful search tools."
            />
          </div>
        </section>

        <section className="mb-20">
          <h2 className="text-3xl font-semibold mb-8 text-center text-accent">Popular Movies</h2>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary-light"></div>
            </div>
          ) : (
            popularMovies.length > 0 ? (
              <PopularMovie movies={popularMovies} />
            ) : (
              <p className="text-center text-white">No popular movies found.</p>
            )
          )}
          <div className="text-center mt-8">
            <Link href="/all">
              <a className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 inline-flex items-center">
                View All Movies <FaFilm className="ml-2" />
              </a>
            </Link>
          </div>
        </section>

        <section className="mb-20">
          <h2 className="text-3xl font-semibold mb-8 text-center text-accent">Top Picks for You</h2>
          <TopPicksSuggester />
        </section>

        <section className="text-center">
          <h2 className="text-3xl font-semibold mb-6 text-accent">Ready to Start Your Movie Journey?</h2>
          <p className="text-xl mb-8">
            Join Filmiora today and unlock a world of cinematic wonders!
          </p>
          <Link href="/signup">
            <a className="bg-accent hover:bg-accent-dark text-white font-bold py-3 px-8 rounded-lg transition-colors duration-200 inline-flex items-center">
              <FaUserPlus className="mr-2" /> Sign Up Now
            </a>
          </Link>
        </section>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-background-light p-6 rounded-lg shadow-lg text-center">
    {icon}
    <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
    <p className="text-gray-300">{description}</p>
  </div>
);

export default Home;