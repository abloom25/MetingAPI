import api from './src/service/api.js'
import { handler } from './src/template.js'
import { homeHandler } from './src/home.js'
import { docsHandler } from './src/docs.js'
import { adminPageHandler } from './src/admin/page.js'
import adminRoutes from './src/admin/api.js'
import store from './src/admin/store.js'
import cookieMonitor from './src/admin/cookie-monitor.js'
import { domainControlMiddleware } from './src/middleware/domain-control.js'
import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { cors } from 'hono/cors'
import config from './src/config.js'

const app = new Hono()

app.use('*', cors())
app.use('*', logger())

adminRoutes(app)

const getAdminPath = () => {
    const storedPath = store.getAdminPath()
    return storedPath || config.ADMIN_PATH
}

app.use('*', async (c, next) => {
    const adminPath = getAdminPath()
    const path = c.req.path
    
    if (path === '/' + adminPath || path.startsWith('/' + adminPath + '/')) {
        return adminPageHandler(c)
    }
    
    await next()
})

app.get('/api', domainControlMiddleware, api)
app.get('/test', handler)
app.get('/docs', docsHandler)
app.get('/', homeHandler)

cookieMonitor.start()

export default app
