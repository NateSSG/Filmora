import React, { useEffect, useState } from "react";
import axios from "axios";
import Meta from "../../../components/Meta";
import { server } from "../../../config";
import { useRouter } from "next/router";
import ReactPlayer from "react-player";
import Slider from "../../../components/Slider";
import Image from "next/image";
import ReviewModal from '../../../components/ReviewModal';

const BACKDROP_BASE_URL = "https://image.tmdb.org/t/p/original";

const Movie = ({ movie, trailer, watchProviders }) => {
  const router = useRouter();
  const [showPlayer, setShowPlayer] = useState(false);
  const [backdrops, setBackdrops] = useState([]);
  const [nextCardVisible, setNextCardVisible] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [selectedReview, setSelectedReview] = useState(null); // State for the selected review
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const [visibleReviews, setVisibleReviews] = useState(3); // State to control the number of visible reviews

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

  const openModal = (review) => {
    setSelectedReview(review);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedReview(null);
  };

  const loadMoreReviews = () => {
    setVisibleReviews((prev) => prev + 3); // Increase the number of visible reviews by 3
  };

  useEffect(() => {
    const fetchBackdrops = async () => {
      if (movie && movie.id) {
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/${movie.id}/images?include_image_language=en,null&api_key=7f4278b49b0dad56afbecf67d0b4a002`
        );
        const backdrops = response.data.backdrops
          .slice(0, 3) // Limit to 3 backdrops
          .map((backdrop) => `${BACKDROP_BASE_URL}${backdrop.file_path}`);
        setBackdrops(backdrops);
      }
    };

    const fetchReviews = async () => {
      if (movie && movie.id) {
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/${movie.id}/reviews?api_key=7f4278b49b0dad56afbecf67d0b4a002&language=en-US`
        );
        const limitedReviews = response.data.results.slice(0, 5); // Limit to 5 reviews
        setReviews(limitedReviews);
      }
    };

    fetchBackdrops();
    fetchReviews();
  }, [movie]);

  const renderProviders = (providers, title) => {
    if (!providers || providers.length === 0) return null;
    return (
      <div className="mt-3">
        <h3 className="text-white text-lg font-semibold mb-2">{title}</h3>
        <div className="flex flex-wrap gap-2">
          {providers.map((provider) => (
            <div key={provider.provider_id} className="flex items-center bg-gray-800 rounded-full px-3 py-1">
              <Image
                src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                alt={provider.provider_name}
                width={24} // Set appropriate width
                height={24} // Set appropriate height
                className="rounded-full mr-2"
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
                    {renderProviders(watchProviders.results.US.buy, "Buy")}
                    {!watchProviders.results.US.flatrate && !watchProviders.results.US.buy && (
                      <p className="text-white text-sm">No streaming options found.</p>
                    )}
                  </>
                ) : (
                  <p className="text-white text-sm">Streaming information not available.</p>
                )}
              </div>
            </div>
          </div>
          <h1 className="font-bold text-xl ml-5 text-primary-light mt-6 my-2">Movie trailer:</h1>
          <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
            {trailer && trailer.key ? (
              <ReactPlayer
                url={`https://www.youtube.com/watch?v=${trailer.key}`}
                width="100%"
                height="100%"
                style={{ position: 'absolute', top: 0, left: 0 }}
                controls
              />
            ) : (
              <p className="text-white text-sm">Trailer not available.</p>
            )}
          </div>

          <div className="p-6">
            <h2 className="text-2xl font-semibold text-primary-light mb-4">User Reviews</h2>
            {reviews.length > 0 ? (
              reviews.slice(0, visibleReviews).map((review) => (
                <button
                  key={review.id}
                  className="mb-4 p-4 border border-gray-700 rounded-lg bg-gradient-to-r from-slate-800 to-neutral-600 shadow-lg transition-transform transform hover:scale-105 w-full text-left"
                  onClick={() => openModal(review)}
                >
                  <h3 className="font-bold text-blue-400 text-lg">{review.author}</h3>
                  <p className="text-gray-200 mb-2">
                    {review.content.length > 100 ? review.content.substring(0, 100) + '...' : review.content}
                  </p>
                  <div className="flex items-center">
                    <span className="text-yellow-400 mr-1">{'★'.repeat(Math.round(review.rating || 0))}</span>
                    <span className="text-gray-300 text-sm mt-3">Read more</span>
                  </div>
                </button>
              ))
            ) : (
              <p className="text-white">No reviews available for this movie.</p>
            )}
            <div className="flex justify-between mt-4">
              {visibleReviews < reviews.length && (
                <button
                  onClick={loadMoreReviews}
                  className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
                >
                  Load More
                </button>
              )}
              {/* Back Button Aligned to the Right Below Reviews */}
              <button
                onClick={handleGoBack}
                className="bg-primary text-white p-4 rounded-full shadow-lg hover:bg-primary-dark transition text-lg"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
      <ReviewModal isOpen={isModalOpen} onClose={closeModal} review={selectedReview} />
    </div>
  );
};

export async function getServerSideProps({ params }) {
  try {
    const API_URL = process.env.API_URL || 'https://api.themoviedb.org/3';
    const API_KEY = process.env.API_KEY || '7f4278b49b0dad56afbecf67d0b4a002';
    const { id } = params;

    const movieRes = await axios.get(`${API_URL}/movie/${id}?api_key=${API_KEY}&language=en-US`);
    const trailerRes = await axios.get(`${API_URL}/movie/${id}/videos?api_key=${API_KEY}&language=en-US`);
    const watchProvidersResponse = await axios.get(`${API_URL}/movie/${id}/watch/providers?api_key=${API_KEY}`);
    const watchProviders = watchProvidersResponse.data;

    const movie = movieRes.data;
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