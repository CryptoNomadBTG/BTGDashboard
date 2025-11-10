const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

// Allow React app to call Node server
app.use(cors({
  origin: "http://localhost:3000",  // React dev server
  methods: ["GET","POST","OPTIONS"], // allow preflight
  allowedHeaders: ["Content-Type","Authorization"] // important
}));

app.use(express.json());

app.post("/rpc", async (req, res) => {
  try {
    const response = await axios.post(
      "http://localhost:8332", // your BTG node RPC port
      req.body,
      {
        auth: {
          username: "Admin",
          password: "StrongPassword1234",
        },
      }
    );
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(4000, () => console.log("Server running on port 4000"));
