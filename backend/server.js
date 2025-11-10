const express = require('express');
const axios = require('axios');
const app = express();
const port = 4000;

app.use(express.json());

// Replace with your RPC credentials
const rpcUsername = 'Admin';
const rpcPassword = 'StrongPassword1234';
const rpcUrl = 'http://127.0.0.1:8332';

app.post('/rpc', async (req, res) => {
  const { method, params } = req.body;

  try {
    const response = await axios.post(
      rpcUrl,
      {
        jsonrpc: '1.0',
        id: 'btg-dashboard',
        method,
        params: params || [],
      },
      {
        auth: { username: rpcUsername, password: rpcPassword },
        headers: { 'Content-Type': 'text/plain' },
      }
    );

    res.json(response.data.result);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`BTG proxy backend listening at http://localhost:${port}`);
});
