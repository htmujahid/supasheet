export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    const isSupasheetDomain = url.hostname.endsWith('.supasheet.app')

    // Non-root paths with a file extension are static assets — never inject config.
    // For supasheet subdomains, strip the subdomain so ASSETS resolves the real file
    // instead of SPA-falling-back to index.html (which has the wrong MIME type for JS/CSS).
    if (url.pathname !== '/' && /\.\w+$/.test(url.pathname)) {
      if (isSupasheetDomain) {
        const mainOrigin = `https://${url.hostname.split('.').slice(1).join('.')}`
        return env.ASSETS.fetch(new Request(`${mainOrigin}${url.pathname}${url.search}`, request))
      }
      return env.ASSETS.fetch(request)
    }

    // Self-hosted (custom domain) or bare supasheet.app — no injection needed
    if (!isSupasheetDomain) {
      return env.ASSETS.fetch(request)
    }

    const projectRef = url.hostname.split('.')[0]
    const cache = caches.default
    const cacheKey = new Request(`https://cache.internal/${projectRef}`)

    const cached = await cache.match(cacheKey)
    if (cached) return cached

    const mainOrigin = `https://${url.hostname.split('.').slice(1).join('.')}`
    const indexResponse = await env.ASSETS.fetch(new Request(`${mainOrigin}/`))

    const publishableKey = await env.CONFIGS.get(projectRef)

    let html = await indexResponse.text()
    if (publishableKey) {
      const config = JSON.stringify({
        supabaseUrl: `https://${projectRef}.supabase.co`,
        anonKey: publishableKey,
      })
      html = html.replace('<head>', `<head><script>window.__CONFIG__=${config};</script>`)
    }

    const response = new Response(html, {
      status: indexResponse.status,
      headers: {
        'content-type': 'text/html;charset=UTF-8',
        'cache-control': 'public, max-age=3600',
      },
    })

    await cache.put(cacheKey, response.clone())
    return response
  },
}
