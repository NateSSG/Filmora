import Image from "next/image";
import Link from "next/link";
import { FaStar } from 'react-icons/fa';

const MovieCard = ({ movie }) => {
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';
  const posterUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

  return (
    <Link href={`/movie/${movie.id}`} shallow={true}>
      <div className="bg-gradient-to-br from-background-light to-background rounded-xl overflow-hidden shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex flex-col w-full h-full border border-gray-800">
        <div className="relative w-full pb-[150%]">
          <Image
            src={posterUrl} // Use the Image component
            alt={movie.title}
            layout="fill" // Use layout fill for responsive images
            objectFit="cover" // Maintain aspect ratio
            className="transition-opacity duration-300"
            onError={(e) => {
              e.target.onerror = null; // prevents looping
              e.target.src = '/path/to/placeholder/image.jpg'; // fallback image
            }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-70 transition-all duration-300 flex items-center justify-center opacity-0 hover:opacity-100">
            <p className="text-white text-center px-4 py-2 hover:cursor-pointer bg-primary rounded-full text-sm font-bold">
              View Details
            </p>
          </div>
        </div>
        <div className="p-4 flex-grow flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white line-clamp-2 mb-2">{movie.title}</h3>
            <p className="text-sm text-gray-400">
              {new Date(movie.release_date).getFullYear()}
            </p>
          </div>
          <div className="mt-2">
            <div className="flex items-center">
              <div className="flex items-center mr-2">
                <FaStar className="text-yellow-400 mr-1" />
                <span className="text-white font-bold">{rating}</span>
              </div>
              <span className="text-gray-400 text-sm">/ 10</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;