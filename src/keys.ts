import fs from 'fs'
import path from 'path'

export function loadSecret(): Uint8Array {
  // Prefer keypair.out (SECRET: [ ... ])
  const kp = path.resolve('keypair.out')
  if (fs.existsSync(kp)) {
    const txt = fs.readFileSync(kp, 'utf8')
    const m = txt.match(/SECRET:\s*(\[[^\]]+\])/)
    if (m) {
      const arr = JSON.parse(m[1])
      if (Array.isArray(arr) && arr.length === 64) return new Uint8Array(arr)
    }
  }

  // Next: secret.json (just [ ... ])
  const sj = path.resolve('secret.json')
  if (fs.existsSync(sj)) {
    const arr = JSON.parse(fs.readFileSync(sj, 'utf8'))
    if (Array.isArray(arr) && arr.length === 64) return new Uint8Array(arr)
  }

  // Fallback: SECRET_KEY in .env
  if (process.env.SECRET_KEY) {
    const arr = JSON.parse(process.env.SECRET_KEY)
    if (Array.isArray(arr) && arr.length === 64) return new Uint8Array(arr)
  }

  throw new Error(
    'No valid 64-byte secret key found. Provide keypair.out (with "SECRET: [...]"), secret.json ([...]), or SECRET_KEY in .env'
  )
}
