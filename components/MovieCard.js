import Image from "next/image";
import Link from "next/link";

const MovieCard = ({ movie }) => {
  const rating = Math.round((movie.vote_average / 2) * 2) / 2;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  return (
    <Link href={`/movie/${movie.id}`}>
      <div className="movie-card bg-gray-900 rounded-lg overflow-hidden shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex flex-col w-full h-full">
        <div className="relative w-full pb-[120%]"> {/* Reduced from 150% to 120% */}
          <Image
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            layout="fill"
            objectFit="cover"
            className="transition-opacity duration-300"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 hover:cursor-pointer hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center opacity-0 hover:opacity-100">
            <p className="text-white text-center px-4 py-2 bg-red-600 rounded-md text-sm font-bold">
              View Details
            </p>
          </div>
        </div>
        <div className="p-4 pb-6 flex-grow flex flex-col justify-between"> {/* Added pb-6 for extra bottom padding */}
          <div>
            <h3 className="text-lg font-semibold text-white line-clamp-2">{movie.title}</h3>
            <p className="text-sm text-gray-400 mt-1">
              {movie.release_date} 
              {movie.certification && (
                <span className="ml-2 px-1 py-0.5 bg-blue-600 text-white text-xs rounded">
                  {movie.certification}
                </span>
              )}
            </p>
          </div>
          <div className="bg-blue-900 rounded-md px-2 py-1 mt-2 inline-block">
            <div className="flex items-center">
              {[...Array(5)].map((_, index) => (
                <span key={index} className="text-yellow-400 text-xl">
                  {index < fullStars ? "★" : index === fullStars && hasHalfStar ? "½" : "☆"}
                </span>
              ))}
              <span className="ml-2 text-sm text-white">({movie.vote_average.toFixed(1)})</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;