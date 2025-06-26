
// RFT-Coin dApp: Token viewer & transfer UI
// Framework: React + Tailwind CSS
// Wallet adapter: Solana + Phantom

import { useEffect, useState } from "react";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { getAssociatedTokenAddress, getAccount, createTransferInstruction } from "@solana/spl-token";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import { useConnection } from "@solana/wallet-adapter-react";

const TOKEN_MINT = new PublicKey("GzRtDuvV1JEDFXKsXVVmCpuX37cvwYJoqXrsTGUjag8q");

export default function RFTApp() {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const [balance, setBalance] = useState(null);
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    if (!publicKey) return;
    (async () => {
      try {
        const ata = await getAssociatedTokenAddress(TOKEN_MINT, publicKey);
        const account = await getAccount(connection, ata);
        setBalance(Number(account.amount));
      } catch (e) {
        setBalance(0);
      }
    })();
  }, [publicKey, connection]);

  const transfer = async () => {
    try {
      const fromATA = await getAssociatedTokenAddress(TOKEN_MINT, publicKey);
      const toPubkey = new PublicKey(recipient);
      const toATA = await getAssociatedTokenAddress(TOKEN_MINT, toPubkey);

      const tx = await createTransferInstruction(fromATA, toATA, publicKey, Number(amount));
      const txid = await sendTransaction({ instructions: [tx] }, connection);
      alert("Transfer sent! Tx ID: " + txid);
    } catch (err) {
      alert("Transfer failed: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-800 text-white p-6 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">RFT-Coin Dashboard</h1>
      <WalletMultiButton className="mb-6" />

      {publicKey && (
        <div className="text-center">
          <p className="text-lg mb-2">Connected Wallet: {publicKey.toBase58()}</p>
          <p className="text-xl mb-4">RFT Balance: {balance}</p>

          <input
            className="p-2 rounded bg-gray-700 text-white mb-2 w-80"
            placeholder="Recipient Address"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
          />

          <input
            className="p-2 rounded bg-gray-700 text-white mb-2 w-80"
            placeholder="Amount to send"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <button onClick={transfer} className="bg-blue-600 hover:bg-blue-800 px-4 py-2 rounded text-white">
            Send RFT
          </button>
        </div>
      )}
    </div>
  );
}
