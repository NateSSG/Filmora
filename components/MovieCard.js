import Link from "next/link";
import { FaStar } from 'react-icons/fa';

const MovieCard = ({ movie }) => {
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';
  const posterUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

  return (
    <Link href={`/movie/${movie.id}`} shallow={true}>
      <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex flex-col w-full border border-gray-700">
        <div className="relative w-full h-[500px] md:h-[550px]"> {/* Increased height for the poster */}
          <img
            src={posterUrl}
            alt={movie.title}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/path/to/placeholder/image.jpg'; // Fallback image
            }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
            <p className="text-white text-center px-4 py-2 bg-primary rounded-full text-sm font-bold">
              View Details
            </p>
          </div>
        </div>
        <div className="p-4 flex flex-col">
          <h3 className="text-lg font-semibold text-white line-clamp-2 mb-2">{movie.title}</h3>
          <p className="text-sm text-gray-400 mb-1">{new Date(movie.release_date).getFullYear()}</p>
          <div className="flex items-center">
            <FaStar className="text-yellow-400 mr-1" />
            <span className="text-white font-bold">{rating}</span>
            <span className="text-gray-400 text-sm">/ 10</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
