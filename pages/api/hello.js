export default function handler(req, res) {
  switch (req.method) {
    case "GET":
      res.status(200).json([
        {
          name: "Nate",
          age: 242443383,
        },
        {
          name: "Nate",
          age: 242443383,
        },
        {
          name: "Nate",
          age: 242443383,
        },
        {
          name: "Nate",
          age: 242443383,
        },
        {
          name: "Nate",
          age: 242443383,
        },
        {
          name: "Nate",
          age: 242443383,
        },
      ]);
      return;
    case "POST":
      res.status(200).json(req.body);
      return;
    default:
      res.status(405).json({
        error: `Request method ${req.method} not allowed.`,
      });
      return;
  }
}
