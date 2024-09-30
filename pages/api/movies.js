import axios from "axios";

export default async function (req, res) {
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
    default:
      res.status(405).json({
        error: `Request method ${req.method} not allowed.`,
      });
      return;
  }
}
