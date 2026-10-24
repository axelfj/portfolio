// Keep internal demos on the current host so local and preview builds are playable.
export function demoLink(url: string) {
  const parsed = new URL(url)
  return parsed.origin === 'https://axelfernandez.vercel.app'
    ? parsed.pathname + parsed.search + parsed.hash
    : url
}
