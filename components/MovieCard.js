import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { TypeAnimation } from "react-type-animation";

const MovieCard = ({ movie }) => {
  const [rating, setRating] = useState(movie.vote_average);

  useEffect(() => {
    async function fetchRating() {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${movie.id}?api_key=7f4278b49b0dad56afbecf67d0b4a002&language=en-US`
        );
        if (response.ok) {
          const data = await response.json();
          setRating(data.vote_average);
        }
      } catch (error) {
        console.error("Error fetching movie rating:", error);
      }
    }
    fetchRating();
  }, [movie.id]);

  const handleCardClick = (movieId) => {
    sessionStorage.setItem("scrollPosition", window.pageYOffset);
    sessionStorage.setItem("previousPage", window.location.href); // Store the current URL
    console.log("Movie clicked with ID:", movieId);
  };

  // Calculate rating percentage (0-100)
  const ratingPercentage = rating * 10;

  // Generate star rating element based on rating percentage
  const starRating = (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          xmlns="http://www.w3.org/2000/svg"
          className={`h-4 w-4 fill-current ${
            ratingPercentage >= (i + 1) * 20
              ? "text-yellow-400"
              : "text-gray-400"
          }`}
          viewBox="0 0 20 20"
        >
          <path d="M10 0l3.09 6.75 7.01.96-5.36 5.2 1.27 7.37-6.61-3.48L3.59 20l1.27-7.37L0 8.71l7.01-.96L10 0z" />
        </svg>
      ))}
    </div>
  );

  const releaseDate = movie.release_date
    ? new Date(movie.release_date).toLocaleDateString("FI")
    : "Release date not available";

  return (
    <Link href={`/movie/${movie.id}`} passHref>
      <div
        className="shadow-sm rounded-2xl cursor-pointer relative group"
        onClick={handleCardClick}
      >
        <Image
          className="w-full rounded-2xl h-48 object-cover transform group-hover:scale-x-50 transition-transform duration-300 ease-in-out"
          src={`https://image.tmdb.org/t/p/w500${
            movie.poster_path || "/no-poster.jpg"
          }`}
          width={700}
          height={850}
          alt={movie.title}
        />
        <div
          className="absolute top-0 left-0 w-full h-96 backdrop-filter backdrop-blur opacity-0 transition-opacity duration-500 ease-in-out group-hover:opacity-100"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}
        >
          <div className="flex items-center justify-center h-full">
            <TypeAnimation
              className="font-bold text-white text-2xl"
              sequence={[movie.title, 1000, "Movie", 1000]}
              wrapper="span"
              cursor={true}
              repeat={Infinity}
              style={{
                fontSize: "2em",
                display: "inline-block",
                color: "white",
              }}
            />
          </div>
        </div>
        <div className="px-6 py-2 text-white">
          <div className="flex items-center mb-1">{starRating}</div>
          <p className="text-white text-base font-cursive mb-1">
            {new Date(movie.release_date).toLocaleDateString("FI")}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
