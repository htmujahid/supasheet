export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    const isSupasheetDomain = url.hostname.endsWith('.supasheet.app')

    if (url.pathname !== '/' && /\.\w+$/.test(url.pathname)) {
      if (isSupasheetDomain) {
        const mainOrigin = `https://${url.hostname.split('.').slice(1).join('.')}`
        return env.ASSETS.fetch(new Request(`${mainOrigin}${url.pathname}${url.search}`, request))
      }
      return env.ASSETS.fetch(request)
    }

    if (!isSupasheetDomain) {
      return env.ASSETS.fetch(request)
    }

    const projectRef = url.hostname.split('.')[0]
    const cache = caches.default
    const cacheKey = new Request(`https://cache.internal/${projectRef}`)

    const cached = await cache.match(cacheKey)
    if (cached) return cached

    const publishableKey = await env.CONFIGS.get(projectRef)

    if (!publishableKey) {
      return env.ASSETS.fetch(request)
    }

    const mainOrigin = `https://${url.hostname.split('.').slice(1).join('.')}`
    const indexResponse = await env.ASSETS.fetch(new Request(`${mainOrigin}/`))

    const config = JSON.stringify({
      supabaseUrl: `https://${projectRef}.supabase.co`,
      anonKey: publishableKey,
    })
    const html = (await indexResponse.text()).replace(
      '<head>',
      `<head><script>window.__CONFIG__=${config};</script>`
    )

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
