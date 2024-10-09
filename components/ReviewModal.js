import React from 'react';

const ReviewModal = ({ isOpen, onClose, review }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-gray-800 p-4 rounded-lg shadow-lg max-w-3xl w-full max-h-[80vh] overflow-auto">
        <h3 className="font-bold text-lg text-white">{review.author}</h3>
        <p className="mt-2 text-gray-300">{review.content}</p>
        <button onClick={onClose} className="mt-4 bg-red-600 text-white px-4 py-2 rounded">
          Close
        </button>
      </div>
    </div>
  );
};

export default ReviewModal;
