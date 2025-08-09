import 'dotenv/config'
import { Connection, Keypair } from '@solana/web3.js'

const HTTP_RPC = process.env.HTTP_RPC!
const SECRET = Uint8Array.from(JSON.parse(process.env.SECRET_KEY!))

async function main() {
  const conn = new Connection(HTTP_RPC, 'confirmed')
  const wallet = Keypair.fromSecretKey(SECRET)
  const [slot, bal] = await Promise.all([
    conn.getSlot(),
    conn.getBalance(wallet.publicKey)
  ])
  console.log('Connected. Slot:', slot)
  console.log('Wallet:', wallet.publicKey.toBase58())
  console.log('Balance SOL:', bal / 1e9)
}
main().catch(console.error)
