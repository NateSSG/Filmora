import React, { useState } from 'react';

const YouTubeFacade = ({ videoId }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const handleLoadPlayer = () => {
    setIsLoaded(true);
  };

  // Construct the maximum resolution thumbnail URL using the video ID
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  return (
    <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
      {!isLoaded ? (
        <div
          className="absolute inset-0 flex items-center justify-center cursor-pointer group"
          onClick={handleLoadPlayer}
        >
          <img
            src={thumbnailUrl}
            alt="YouTube Trailer Thumbnail"
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
            onError={(e) => {
              // Fallback to a lower quality thumbnail if maxresdefault is not available
              e.target.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
            }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300 opacity-0 group-hover:opacity-100">
            <span className="text-white text-lg font-bold flex items-center justify-center h-full">Play Video</span>
          </div>
        </div>
      ) : (
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute top-0 left-0 w-full h-full"
        ></iframe>
      )}
    </div>
  );
};

export default YouTubeFacade; // Ensure this is a default export
