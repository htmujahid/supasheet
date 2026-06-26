export default {
  async fetch(request, env) {
    const url = new URL(request.url)

    if (url.pathname !== '/' && /\.\w+$/.test(url.pathname)) {
      const assetResponse = await env.ASSETS.fetch(request)
      const contentType = assetResponse.headers.get('content-type') || ''
      if (contentType.includes('text/html') && !url.pathname.endsWith('.html')) {
        return new Response('Not found', { status: 404 })
      }
      return assetResponse
    }

    const indexResponse = await env.ASSETS.fetch(new Request(`${url.origin}/`, request))
    const isSupasheetDomain = url.hostname.endsWith('.supasheet.app')

    if (!isSupasheetDomain) {
      return indexResponse
    }

    const projectRef = url.hostname.split('.')[0]
    const publishableKey = await env.CONFIGS.get(projectRef)

    if (!publishableKey) {
      return indexResponse
    }

    const config = JSON.stringify({
      supabaseUrl: `https://${projectRef}.supabase.co`,
      anonKey: publishableKey,
    })
    const html = (await indexResponse.text()).replace(
      '<head>',
      `<head><script>window.__CONFIG__=${config};</script>`
    )

    return new Response(html, {
      status: 200,
      headers: {
        'content-type': 'text/html;charset=UTF-8',
        'cache-control': 'no-cache',
      },
    })
  },
}
