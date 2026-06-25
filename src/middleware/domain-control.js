import store from '../admin/store.js'

/**
 * 从请求头中提取调用方域名。
 * 优先取 Origin（跨域请求会携带），其次取 Referer。
 * 返回小写的主机名（不含端口），无法解析时返回 null。
 */
const extractCallerHost = (c) => {
    const origin = c.req.header('Origin')
    if (origin) {
        try {
            return new URL(origin).hostname.toLowerCase()
        } catch {}
    }

    const referer = c.req.header('Referer')
    if (referer) {
        try {
            return new URL(referer).hostname.toLowerCase()
        } catch {}
    }

    return null
}

/**
 * 判断 host 是否匹配白名单中的某一项。
 * 支持精确匹配（如 abloom.site）以及通配符（如 *.abloom.site 匹配 www.abloom.site 与 abloom.site）。
 */
const matchDomain = (host, pattern) => {
    if (!host || !pattern) return false
    const p = pattern.toLowerCase().trim()
    if (!p) return false

    if (p.startsWith('*.')) {
        const base = p.slice(2)
        return host === base || host.endsWith('.' + base)
    }

    return host === p
}

/**
 * 调用方域名控制中间件（白名单模式）。
 * - 未启用时直接放行；
 * - 取不到来源域名时，按 allowMissingReferer 决定（默认放行，便于服务端/直接访问）；
 * - 命中白名单放行，否则返回 403。
 */
export const domainControlMiddleware = async (c, next) => {
    const config = store.getDomainControlConfig()

    if (!config.enabled) {
        return await next()
    }

    const host = extractCallerHost(c)

    if (!host) {
        if (config.allowMissingReferer) {
            return await next()
        }
        return c.json({ success: false, error: '未提供有效的来源信息，访问被拒绝' }, 403)
    }

    const allowed = config.allowedDomains || []
    if (allowed.some((pattern) => matchDomain(host, pattern))) {
        return await next()
    }

    return c.json({ success: false, error: `来源域名 ${host} 未被允许调用此接口` }, 403)
}

export default domainControlMiddleware
