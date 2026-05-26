export async function GET() {
  const encoder = new TextEncoder()
  const { readable, writable } = new TransformStream()
  const writer = writable.getWriter()

  ;(async () => {
    for (let i = 1; i <= 5; i++) {
      await writer.write(encoder.encode(`chunk ${i}\n`))
      await new Promise(r => setTimeout(r, 500))
    }
    writer.close()
  })()

  return new Response(readable, {
    headers: { 'Content-Type': 'text/plain', 'X-Accel-Buffering': 'no' }
  })
}
