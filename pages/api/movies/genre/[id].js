import axios from "axios";

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    const API_URL = process.env.API_URL || 'https://api.themoviedb.org/3';
    const API_KEY = process.env.API_KEY;

    const response = await axios.get(
      `${API_URL}/discover/movie`,
      {
        params: {
          api_key: API_KEY,
          with_genres: id,
          language: "en-US",
          sort_by: "popularity.desc",
          page: 1,
        },
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching movies by genre:', error);
    res.status(500).json({ error: 'Error fetching movies by genre' });
  }
}
