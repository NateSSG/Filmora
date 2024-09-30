import axios from "axios";

export default async function handler(req, res) {
  try {
    const API_URL = process.env.API_URL || 'https://api.themoviedb.org/3';
    const API_KEY = process.env.API_KEY || '1234567890';

    const response = await axios.get(
      `${API_URL}/genre/movie/list`,
      {
        params: {
          api_key: API_KEY,
          language: "en-US",
        },
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching genres:', error);
    res.status(500).json({ error: 'Error fetching genres' });
  }
}
