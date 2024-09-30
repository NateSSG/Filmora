import React, { useEffect, useState } from "react";
import axios from "axios";
import Meta from "../../../components/Meta";
import { server } from "../../../config";
import { useRouter } from "next/router";
import ReactPlayer from "react-player";
import Slider from "../../../components/Slider";
import Image from "next/image";

const BACKDROP_BASE_URL = "https://image.tmdb.org/t/p/original";

const Movie = ({ movie, trailer, watchProviders }) => {
  const router = useRouter();
  const [showPlayer, setShowPlayer] = useState(false);
  const [backdrops, setBackdrops] = useState([]);
  const [nextCardVisible, setNextCardVisible] = useState(false);

  const handlePlay = () => {
    setShowPlayer(true);
  };

  const handleGoBack = () => {
    const previousPage = sessionStorage.getItem("previousPage");
    if (previousPage) {
      router.push(previousPage);
    } else {
      router.back();
    }
  };

  const handleNextCard = () => {
    setNextCardVisible(true);
    setTimeout(() => setNextCardVisible(false), 1000); // Hide after 1 second
  };

  useEffect(() => {
    const fetchBackdrops = async () => {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/${movie.id}/images?include_image_language=en,null&api_key=7f4278b49b0dad56afbecf67d0b4a002`
      );
      const backdrops = response.data.backdrops.map(
        (backdrop) => `${BACKDROP_BASE_URL}${backdrop.file_path}`
      );
      setBackdrops(backdrops);
    };
    fetchBackdrops();
  }, [movie.id]);

  return (
    <div
      className={`container max-w-4xl overflow-hidden mx-auto pt-6 bg-black pb-6 rounded-2xl mt-8 transition-opacity duration-500 ${
        nextCardVisible ? "opacity-50" : "opacity-100"
      }`}
    >
      <Meta title={movie.title} />
      <div className="px-3">
        <Slider slides={backdrops} />
        <h1 className="font-bold text-xl text-red-600 my-2">{movie.title}</h1>
        {/* Replace the TypeAnimation with a simple paragraph */}
        <p className="text-white text-sm mb-4">{movie.overview}</p>

        <p className="mt-5 text-white -600 text-sm">
          Genres:{" "}
          <span className="font-bold">
            {movie.genres.map((genre) => genre.name).join(", ")}
          </span>
        </p>
        <p className="text-white text-sm">
          Release Date: <span className="font-bold">{movie.release_date}</span>
        </p>

        {/* Streaming Information */}
        <div className="mt-5">
          <h2 className="font-bold text-lg text-red-600 mb-2">Where to Watch</h2>
          {watchProviders ? (
            <div className="flex flex-wrap gap-2">
              {watchProviders.flatrate && watchProviders.flatrate.map((provider) => (
                <div key={provider.provider_id} className="flex items-center bg-gray-800 rounded-full px-3 py-1">
                  <img 
                    src={`https://image.tmdb.org/t/p/original${provider.logo_path}`} 
                    alt={provider.provider_name}
                    className="w-6 h-6 rounded-full mr-2"
                  />
                  <span className="text-white text-sm">{provider.provider_name}</span>
                </div>
              ))}
              {!watchProviders.flatrate && <p className="text-white text-sm">No streaming options found.</p>}
            </div>
          ) : (
            <p className="text-white text-sm">Streaming information not available.</p>
          )}
        </div>

        <h1 className="font-bold text-xl text-red-600 mt-6 my-2">
          Movie trailer:
        </h1>

        <div className="flex justify-center mt-5 rounded-xl">
          {trailer && trailer.key ? (
            <ReactPlayer
              url={`https://www.youtube.com/watch?v=${trailer.key}`}
              width={800}
              height={600}
              controls
              style={{ padding: 0 }}
            />
          ) : (
            <p className="text-white text-sm">Trailer not available.</p>
          )}
        </div>

        <div className="mt-5 flex justify-center">
          <button
            onClick={handleGoBack}
            className="px-4 py-2 rounded-md bg-black font-bold text-white hover:bg-red-700 flex items-center space-x-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span>Go back</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export async function getServerSideProps({ params }) {
  try {
    const API_URL = process.env.API_URL || 'https://api.themoviedb.org/3';
    const API_KEY = process.env.API_KEY;
    const { id } = params;

    const movieRes = await axios.get(`${API_URL}/movie/${id}?api_key=${API_KEY}&language=en-US`);
    const certificationRes = await axios.get(`${API_URL}/movie/${id}/release_dates?api_key=${API_KEY}`);
    const trailerRes = await axios.get(`${API_URL}/movie/${id}/videos?api_key=${API_KEY}&language=en-US`);

    const movie = movieRes.data;
    const releaseDates = certificationRes.data.results;
    const usRelease = releaseDates.find(r => r.iso_3166_1 === "US");
    const certification = usRelease && usRelease.release_dates[0] ? usRelease.release_dates[0].certification : "Not Rated";

    const trailers = trailerRes.data.results;
    const trailer = trailers.find(video => video.type === "Trailer") || null;

    return {
      props: { 
        movie: { ...movie, certification },
        trailer,
        watchProviders: null // You might want to fetch this data as well
      }
    };
  } catch (error) {
    console.error('Error fetching movie data:', error);
    return {
      props: { movie: null, trailer: null, watchProviders: null, error: error.message }
    };
  }
}

export default Movie;
