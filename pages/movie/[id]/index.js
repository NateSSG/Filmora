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
    setTimeout(() => setNextCardVisible(false), 1000);
  };

  useEffect(() => {
    const fetchBackdrops = async () => {
      if (movie && movie.id) { // Check if movie and movie.id are defined
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/${movie.id}/images?include_image_language=en,null&api_key=7f4278b49b0dad56afbecf67d0b4a002`
        );
        const backdrops = response.data.backdrops.map(
          (backdrop) => `${BACKDROP_BASE_URL}${backdrop.file_path}`
        );
        setBackdrops(backdrops);
      }
    };
    fetchBackdrops();
  }, [movie]); // Depend on movie object

  const renderProviders = (providers, title) => {
    if (!providers || providers.length === 0) return null;
    return (
      <div className="mt-3">
        <h3 className="text-white text-lg font-semibold mb-2">{title}</h3>
        <div className="flex flex-wrap gap-2">
          {providers.map((provider) => (
            <div key={provider.provider_id} className="flex items-center bg-gray-800 rounded-full px-3 py-1">
              <img
                src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                alt={provider.provider_name}
                className="w-6 h-6 rounded-full mr-2"
              />
              <span className="text-white text-sm">{provider.provider_name}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-b from-background to-background-dark min-h-screen py-12">
      <Meta title={movie.title} />
      <div className="container max-w-6xl mx-auto px-4">
        <div className="bg-background-light rounded-xl overflow-hidden shadow-2xl">
          <div className="relative h-96">
            <Slider slides={backdrops} />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-6">
              <h1 className="text-4xl font-bold text-white mb-2">{movie.title}</h1>
              <p className="text-gray-300 text-sm">
                {movie.release_date} | {movie.genres.map((genre) => genre.name).join(", ")}
              </p>
            </div>
          </div>
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-2/3">
                <h2 className="text-2xl font-semibold text-primary-light mb-4">Overview</h2>
                <p className="text-gray-300 mb-6">{movie.overview}</p>
                <h2 className="text-2xl font-semibold text-primary-light mb-4">Where to Watch</h2>
                {watchProviders && watchProviders.results && watchProviders.results.US ? (
                  <>
                    {renderProviders(watchProviders.results.US.flatrate, "Stream")}
                    {renderProviders(watchProviders.results.US.rent, "Rent")}
                    {renderProviders(watchProviders.results.US.buy, "Buy")}
                    {!watchProviders.results.US.flatrate && !watchProviders.results.US.rent && !watchProviders.results.US.buy && (
                      <p className="text-white text-sm">No streaming options found.</p>
                    )}
                  </>
                ) : (
                  <p className="text-white text-sm">Streaming information not available.</p>
                )}
              </div>
            </div>
          </div>
          <h1 className="font-bold text-xl ml-5 text-primary-light  mt-6 my-2">
            Movie trailer:
          </h1>
          <div className="relative w-full" style={{ paddingTop: '56.25%' }}> {/* 16:9 Aspect Ratio */}
            {trailer && trailer.key ? (
              <ReactPlayer
                url={`https://www.youtube.com/watch?v=${trailer.key}`}
                width="100%"
                height="100%" // Set height to 100% to fill the wrapper
                style={{ position: 'absolute', top: 0, left: 0 }} // Positioning to fill the wrapper
                controls
              />
            ) : (
              <p className="text-white text-sm">Trailer not available.</p>
            )}
          </div>
          <div className="mt-8 mb-10 flex justify-center">
            <button
              onClick={handleGoBack}
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-primary to-secondary p-0.5 text-sm font-medium text-white hover:text-white focus:outline-none focus:ring-4 focus:ring-primary"
            >
              <span className="relative flex items-center space-x-2 rounded-full bg-background px-28 py-2.5 transition-all duration-75 ease-in group-hover:bg-opacity-0">
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
              </span>
            </button>
          </div>
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
    const watchProvidersResponse = await axios.get(`${API_URL}/movie/${id}/watch/providers?api_key=${API_KEY}`);
    const watchProviders = watchProvidersResponse.data;

    const movie = movieRes.data;
    const releaseDates = certificationRes.data.results;
    const usRelease = releaseDates.find(r => r.iso_3166_1 === "US");
    const certification = usRelease && usRelease.release_dates[0] ? usRelease.release_dates[0].certification : "Not Rated";

    const trailers = trailerRes.data.results;
    const trailer = trailers.find(video => video.type === "Trailer") || null;

    return {
      props: { movie, trailer, watchProviders }
    };
  } catch (error) {
    console.error('Error fetching movie data:', error);
    return {
      props: { movie: null, trailer: null, watchProviders: null, error: error.message }
    };
  }
}

export default Movie;