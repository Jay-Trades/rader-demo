export default function handler(req, res) {
  if (req.method === "GET") {
    res
      .status(200)
      .json({ success: true, message: "GET endpoint is working!" });
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
