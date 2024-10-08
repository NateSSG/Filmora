const validateApiRequest = (data) => {
  const errors = {};

  // Example validation rules
  if (!data.title || typeof data.title !== 'string') {
    errors.title = 'Title is required and must be a string.';
  }

  if (!data.release_date || !isValidDate(data.release_date)) {
    errors.release_date = 'Release date is required and must be a valid date.';
  }

  if (!data.genres || !Array.isArray(data.genres) || data.genres.length === 0) {
    errors.genres = 'At least one genre is required.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

const isValidDate = (dateString) => {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};

export default validateApiRequest;
