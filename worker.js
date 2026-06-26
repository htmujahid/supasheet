const HOSTED_DOMAIN = 'supasheet.app'

export default {
  async fetch(request, env) {
    const url = new URL(request.url)

    // Static assets (hashed filenames) — serve directly, ASSETS handles caching
    if (url.pathname !== '/' && /\.\w+$/.test(url.pathname)) {
      return env.ASSETS.fetch(request)
    }

    const hostname = url.hostname
    const isHosted = hostname === HOSTED_DOMAIN || hostname.endsWith(`.${HOSTED_DOMAIN}`)

    // Self-hosted — serve as-is, env vars handled by the user's own setup
    if (!isHosted) {
      return env.ASSETS.fetch(request)
    }

    const cacheKey = new Request(`https://cache.internal/${hostname}`)
    const cached = await caches.default.match(cacheKey)
    if (cached) return cached

    const projectRef = hostname.split('.')[0]
    const indexResponse = await env.ASSETS.fetch(new Request(`${url.origin}/`))
    const anonKey = await env.CONFIGS.get(projectRef)
    const supabaseUrl = `https://${projectRef}.supabase.co`

    let html = await indexResponse.text()
    if (anonKey) {
      const config = JSON.stringify({ supabaseUrl, anonKey })
      html = html.replace('<head>', `<head><script>window.__CONFIG__=${config};</script>`)
    }

    const response = new Response(html, {
      status: indexResponse.status,
      headers: {
        'content-type': 'text/html;charset=UTF-8',
        'cache-control': 'public, max-age=3600',
      },
    })

    await caches.default.put(cacheKey, response.clone())
    return response
  },
}
