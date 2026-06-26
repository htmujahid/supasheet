export default {
  async fetch(request, env) {
    const url = new URL(request.url)

    // Static assets (hashed filenames) — serve directly, ASSETS handles caching
    if (/\.\w+$/.test(url.pathname)) {
      return env.ASSETS.fetch(request)
    }

    const projectRef = url.hostname.split('.')[0]
    const cache = caches.default
    const cacheKey = new Request(`https://cache.internal/${projectRef}`)

    const cached = await cache.match(cacheKey)
    if (cached) return cached

    // SPA fallback: ASSETS returns index.html for any unmatched route
    const asset = await env.ASSETS.fetch(new Request(new URL('/', url), request))
    const configStr = await env.CONFIGS.get(projectRef)

    let html = await asset.text()
    if (configStr) {
      html = html.replace('<head>', `<head><script>window.__CONFIG__=${configStr};</script>`)
    }

    const response = new Response(html, {
      status: asset.status,
      headers: {
        'content-type': 'text/html;charset=UTF-8',
        'cache-control': 'public, max-age=3600',
      },
    })

    await cache.put(cacheKey, response.clone())
    return response
  },
}
