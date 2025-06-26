
import { useEffect, useState } from "react";
import { Connection, PublicKey } from "@solana/web3.js";

const connection = new Connection("https://api.devnet.solana.com");

function App() {
  const [balance, setBalance] = useState(null);
  const wallet = "INSERT_YOUR_PUBLIC_KEY_HERE";

  useEffect(() => {
    const fetchBalance = async () => {
      const pubKey = new PublicKey(wallet);
      const lamports = await connection.getBalance(pubKey);
      setBalance(lamports / 1e9);
    };
    fetchBalance();
  }, []);

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h1>RFT Coin Dashboard</h1>
      <p><strong>Wallet:</strong> {wallet}</p>
      <p><strong>SOL Balance:</strong> {balance ?? "Loading..."} SOL</p>
    </div>
  );
}

export default App;
