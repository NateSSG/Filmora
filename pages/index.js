import React from 'react';
import Link from 'next/link';
import Meta from '../components/Meta';

export default function Home() {
  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <Meta title="Home" />
      {/* Removed the extra Navbar component from here */}
      <div className="container max-w-4xl mx-auto pb-10 px-4">
        <h1 className="text-4xl font-bold mt-8 mb-5">Welcome to MovieExplorer</h1>
        <p className="text-xl mb-5">
          Discover the world of cinema with MovieExplorer. We bring you the latest and greatest in film, from blockbuster hits to indie gems.
        </p>
        <h2 className="text-2xl font-semibold mt-8 mb-3">About Our Site</h2>
        <p className="mb-5">
          MovieExplorer is your go-to destination for all things movies. We offer:
        </p>
        <ul className="list-disc list-inside mb-5">
          <li>Comprehensive movie information</li>
          <li>Latest movie trailers</li>
          <li>User ratings and reviews</li>
          <li>Personalized movie recommendations</li>
        </ul>
        <p className="mb-5">
          Whether you're a casual moviegoer or a die-hard cinephile, MovieExplorer has something for everyone.
        </p>
        <Link href="/movies">
          <a className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Explore Movies
          </a>
        </Link>
      </div>
    </div>
  );
}
