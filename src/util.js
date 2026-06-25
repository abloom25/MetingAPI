export function format(lyric, tlyric) {
  const lyricArray = trimLyric(lyric)
  const tlyricArray = trimLyric(tlyric)
  if (tlyricArray.length === 0) {
    return lyric
  }
  const result = []
  for (let i = 0, j = 0; i < lyricArray.length && j < tlyricArray.length; i += 1) {
    const time = lyricArray[i].time
    let text = lyricArray[i].text
    while (time > tlyricArray[j].time && j + 1 < tlyricArray.length) {
      j += 1
    }
    if (time === tlyricArray[j].time && tlyricArray[j].text.length) {
      text = `${text} (${tlyricArray[j].text})`
    }
    result.push({
      time,
      text
    })
  }
  return result
    .map(x => {
      const minus = Math.floor(x.time / 60000).toString().padStart(2, '0')
      const second = Math.floor((x.time % 60000) / 1000).toString().padStart(2, '0')
      const millisecond = Math.floor((x.time % 1000)).toString().padStart(3, '0')
      return `[${minus}:${second}.${millisecond}]${x.text}`
    })
    .join('\n')
}

const trimLyric = (lyric) => {
  const result = []
  const lines = lyric.split('\n')
  for (const line of lines) {
    const match = line.match(/^\[(\d{2}):(\d{2}\.\d*)\](.*)$/)
    if (match) {
      result.push({
        time: parseInt(parseInt(match[1], 10) * 60 * 1000 + parseFloat(match[2]) * 1000),
        text: match[3]
      })
    }
  }
  return result.sort((a, b) => a.time - b.time)
}

export const getPathFromURL = (url, strict = true) => {
  const queryIndex = url.indexOf("?");
  const result = url.substring(url.indexOf("/", 8), queryIndex === -1 ? url.length : queryIndex);
  if (strict === false && result.endsWith("/")) {
    return result.slice(0, -1);
  }
  return result;
};

const getFirstHeaderValue = (value) => {
  if (!value) return ''
  return value.split(',')[0].trim()
}

const isPrivateIpv4 = (hostname) => {
  const match = hostname.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/)
  if (!match) return false

  const parts = match.slice(1).map(Number)
  if (parts.some(part => part < 0 || part > 255)) return false

  const [a, b] = parts
  return (
    a === 10 ||
    a === 127 ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    (a === 169 && b === 254) ||
    (a === 0 && b === 0)
  )
}

const isLocalOrPrivateHost = (hostname) => {
  const host = hostname.replace(/^\[|\]$/g, '').toLowerCase()
  return (
    host === 'localhost' ||
    host === '::1' ||
    host.endsWith('.localhost') ||
    isPrivateIpv4(host)
  )
}

export const upgradeHttpToHttps = (value) => {
  if (typeof value !== 'string' || !value.startsWith('http://')) {
    return value
  }

  try {
    const url = new URL(value)
    if (url.protocol !== 'http:' || isLocalOrPrivateHost(url.hostname)) {
      return value
    }

    url.protocol = 'https:'
    return url.toString()
  } catch {
    return value.replace(/^http:\/\//, 'https://')
  }
}

export const get_runtime = () => {

  if (globalThis?.process?.env?.RUNTIME) {
    return globalThis?.process?.env?.RUNTIME
  }

  if (globalThis?.Deno !== undefined) {
    return 'deno'
  }

  if (globalThis?.Bun !== undefined) {
    return 'bun'
  }

  if (typeof globalThis?.WebSocketPair === 'function') {
    return 'cloudflare'
  }

  if (globalThis?.fastly !== undefined) {
    return 'fastly'
  }

  if (typeof globalThis?.EdgeRuntime === 'string') {
    return 'vercel'
  }

  if (globalThis?.process?.release?.name === 'node') {
    return 'node'
  }

  if (globalThis?.__lagon__ !== undefined) {
    return 'lagon'
  }

  return 'other'
}

export const get_url = (ctx) => {
  const runtime = get_runtime()
  const forwardedUrl = getFirstHeaderValue(ctx.req.header('X-Forwarded-Url'))
  const currentUrl = new URL(ctx.req.url)

  if (forwardedUrl) {
    const reqUrl = forwardedUrl.startsWith('http')
      ? new URL(forwardedUrl)
      : new URL(`http://${forwardedUrl}`)

    reqUrl.pathname = currentUrl.pathname
    reqUrl.search = ''
    reqUrl.hash = ''
    return upgradeHttpToHttps(reqUrl.toString())
  }

  const host = getFirstHeaderValue(ctx.req.header('X-Forwarded-Host')) || currentUrl.host
  const forwardedProto = getFirstHeaderValue(
    ctx.req.header('X-Forwarded-Proto') ||
    ctx.req.header('X-Forwarded-Protocol') ||
    ctx.req.header('X-Url-Scheme')
  )
  const protocol = forwardedProto || currentUrl.protocol.replace(':', '') || 'http'
  const reqUrl = new URL(`${protocol}://${host}`)

  reqUrl.pathname = currentUrl.pathname

  if (runtime === 'vercel' || runtime === 'cloudflare' || runtime === 'fastly') {
    return upgradeHttpToHttps(reqUrl.toString())
  }

  return upgradeHttpToHttps(reqUrl.toString())
}
