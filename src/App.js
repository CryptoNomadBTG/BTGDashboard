import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [blockchainInfo, setBlockchainInfo] = useState(null);
  const [networkInfo, setNetworkInfo] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to call the backend proxy
  const callRPC = async (method, params = []) => {
    try {
      const response = await axios.post("http://localhost:4000/rpc", {
        jsonrpc: "2.0",
        id: 1,
        method,
        params,
      });

      // Debug log to see full RPC response
      console.log(`RPC ${method} response:`, response.data);

      // Return the actual result field
      return response.data.result;
    } catch (err) {
      console.error(`RPC Error (${method}):`, err.message);
      setError(err.message);
      return null;
    }
  };

  // Fetch blockchain and network info on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const bcInfo = await callRPC("getblockchaininfo");
      const netInfo = await callRPC("getnetworkinfo");

      setBlockchainInfo(bcInfo);
      setNetworkInfo(netInfo);

      setLoading(false);
    };

    fetchData();
  }, []);

  if (error) {
    return (
      <div style={{ padding: "20px", color: "red" }}>
        Error: {error}
      </div>
    );
  }

  if (loading || !blockchainInfo || !networkInfo) {
    return <div style={{ padding: "20px" }}>Loading Bitcoin Gold data...</div>;
  }

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Bitcoin Gold Dashboard</h1>

      <section style={{ marginBottom: "20px" }}>
        <h2>Blockchain Info</h2>
        <p><strong>Chain:</strong> {blockchainInfo.chain}</p>
        <p><strong>Blocks:</strong> {blockchainInfo.blocks}</p>
        <p><strong>Difficulty:</strong> {blockchainInfo.difficulty}</p>
        <p><strong>Best Block Hash:</strong> {blockchainInfo.bestblockhash}</p>
        <p><strong>Median Time:</strong> {blockchainInfo.mediantime}</p>
        <p><strong>Verification Progress:</strong> {blockchainInfo.verificationprogress}</p>
      </section>

      <section>
        <h2>Network Info</h2>
        <p><strong>Version:</strong> {networkInfo.version}</p>
        <p><strong>Protocol Version:</strong> {networkInfo.protocolversion}</p>
        <p><strong>Connections:</strong> {networkInfo.connections}</p>
        <p><strong>Relay Fee:</strong> {networkInfo.relayfee}</p>
        <p><strong>Local Services:</strong> {networkInfo.localservices}</p>
        <p><strong>Time Offset:</strong> {networkInfo.timeoffset}</p>
      </section>

      {/* Optional: debug raw JSON */}
      <section style={{ marginTop: "20px" }}>
        <h2>Raw Data (Debug)</h2>
        <pre>{JSON.stringify({ blockchainInfo, networkInfo }, null, 2)}</pre>
      </section>
    </div>
  );
}

export default App;
