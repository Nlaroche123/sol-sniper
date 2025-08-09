import 'dotenv/config'
import { Connection, Keypair, VersionedTransaction } from '@solana/web3.js'

const HTTP_RPC = process.env.HTTP_RPC!
const SECRET = Uint8Array.from(JSON.parse(process.env.SECRET_KEY!))
const BUY_SIZE_SOL = Number(process.env.BUY_SIZE_SOL || '0.02') // tiny

const WSOL = 'So11111111111111111111111111111111111111112'
const USDC = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'

async function main() {
  const conn = new Connection(HTTP_RPC, 'confirmed')
  const wallet = Keypair.fromSecretKey(SECRET)
  const amountLamports = Math.floor(BUY_SIZE_SOL * 1e9)

  // 1) Quote
  const q = await fetch(`https://quote-api.jup.ag/v6/quote?inputMint=${WSOL}&outputMint=${USDC}&amount=${amountLamports}&slippageBps=300`).then(r=>r.json())

  // 2) Swap tx to sign
  const swap = await fetch('https://quote-api.jup.ag/v6/swap', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ userPublicKey: wallet.publicKey.toBase58(), quoteResponse: q })
  }).then(r=>r.json())

  const tx = VersionedTransaction.deserialize(Buffer.from(swap.swapTransaction, 'base64'))
  tx.sign([wallet])

  // 3) Send
  const sig = await conn.sendTransaction(tx, { skipPreflight: true, maxRetries: 3 })
  console.log('Swap sent, sig:', sig)
}
main().catch(console.error)
