import 'dotenv/config'
import { Connection } from '@solana/web3.js'

const WS = process.env.RPC_URL!
async function main() {
  const conn = new Connection(WS, { commitment: 'confirmed' })
  console.log('Listener booted. Subscribing to slot updates...')
  const sub = await conn.onSlotUpdate((u) => {
    if (u.type === 'firstShredReceived') console.log('Slot', u.slot)
  })
  process.on('SIGINT', async () => {
    await conn.removeSlotUpdateListener(sub)
    process.exit(0)
  })
}
main().catch(console.error)
