import axios from "axios";
import validateApiRequest from '../../utils/validator';

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      const movies = await axios.get(
        `https://api.themoviedb.org/3/movie/popular`,
        {
          params: {
            api_key: "7f4278b49b0dad56afbecf67d0b4a002",
            page: req.query.page,
            language: "en-US",
          },
        }
      );

      res.status(200).json(movies.data);
      return;
    case "POST":
      const { isValid, errors } = validateApiRequest(req.body);
      if (!isValid) {
        return res.status(400).json({ errors });
      }

      // Proceed with saving the movie data
      res.status(200).json(req.body);
      return;
    default:
      res.status(405).json({
        error: `Request method ${req.method} not allowed.`,
      });
      return;
  }
}
