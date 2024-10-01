import React from 'react';
import Link from 'next/link';
import Meta from '../components/Meta';
import Hero from '../components/Hero';
import TopPicksSuggester from '../components/TopPicksSuggester';
import { FaFilm, FaStar, FaSearch } from 'react-icons/fa';

const Home = () => {
  return (
    <div className="bg-gradient-to-b from-background to-background-dark min-h-screen text-white">
      <Meta title="MovieExplorer - Your Ultimate Movie Destination" />
      <Hero />
      <div className="container max-w-6xl mx-auto pb-20 px-4">
        <section className="mt-16 mb-20">
          <h1 className="text-5xl font-bold mb-6 text-center text-primary-light">Welcome to MovieExplorer</h1>
          <p className="text-xl mb-8 text-center max-w-3xl mx-auto">
            Discover the world of cinema with MovieExplorer. We bring you the latest and greatest in film, from blockbuster hits to indie gems.
          </p>
          <div className="flex justify-center space-x-6">
            <Link href="/movies">
              <a className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center">
                <FaFilm className="mr-2" /> Explore Movies
              </a>
            </Link>
            <Link href="/all">
              <a className="bg-secondary hover:bg-secondary-dark text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center">
                <FaSearch className="mr-2" /> Browse All
              </a>
            </Link>
          </div>
        </section>

        <section className="mb-20">
          <h2 className="text-3xl font-semibold mb-8 text-center text-accent">Why Choose MovieExplorer?</h2>
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
          <h2 className="text-3xl font-semibold mb-8 text-center text-accent">Top Picks for You</h2>
          <TopPicksSuggester />
        </section>

        <section className="text-center">
          <h2 className="text-3xl font-semibold mb-6 text-accent">Ready to Start Your Movie Journey?</h2>
          <p className="text-xl mb-8">
            Join MovieExplorer today and unlock a world of cinematic wonders!
          </p>
          <Link href="/signup">
            <a className="bg-accent hover:bg-accent-dark text-white font-bold py-3 px-8 rounded-lg transition-colors duration-200 inline-block">
              Sign Up Now
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