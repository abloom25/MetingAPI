import config from "./config.js"
import { get_runtime, get_url } from "./util.js"

const BRAND_SVG = `<svg width="28" height="28" viewBox="0 0 64 64" fill="none" aria-hidden="true">
  <path d="M10 44V20c0-4 5-5.8 7.5-2.7L32 35.5l14.5-18.2C49 14.2 54 16 54 20v24" stroke="currentColor" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="10" cy="47" r="7" fill="currentColor"/>
  <circle cx="54" cy="47" r="7" fill="currentColor"/>
</svg>`

const buildStyle = () => `
:root {
    --accent: #81d8d0;
    --accent-soft: #a7e7e2;
    --accent-rgb: 129, 216, 208;
    --bg: #0e0d12;
    --text: rgba(255, 255, 255, 0.92);
    --text-muted: rgba(255, 255, 255, 0.68);
    --text-subtle: rgba(255, 255, 255, 0.43);
    --glass: rgba(255, 255, 255, 0.055);
    --glass-strong: rgba(255, 255, 255, 0.09);
    --glass-border: rgba(255, 255, 255, 0.1);
    --glass-border-strong: rgba(255, 255, 255, 0.14);
    --separator: rgba(255, 255, 255, 0.09);
    --radius: 22px;
    --radius-sm: 16px;
    --radius-xs: 13px;
    --ease: cubic-bezier(0.16, 1, 0.3, 1);
}
* { margin: 0; padding: 0; box-sizing: border-box; }
html { -webkit-text-size-adjust: 100%; }
body {
    font-family: Inter, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif;
    background:
        radial-gradient(circle at 18% 10%, rgba(var(--accent-rgb), 0.16), transparent 42%),
        radial-gradient(circle at 84% 78%, rgba(var(--accent-rgb), 0.07), transparent 46%),
        var(--bg);
    min-height: 100vh;
    color: var(--text);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    letter-spacing: -0.01em;
    -webkit-tap-highlight-color: transparent;
}
::selection { background: rgba(var(--accent-rgb), 0.35); color: #fff; }

/* 导航 */
.nav {
    position: sticky;
    top: 0;
    z-index: 50;
    background: rgba(14, 13, 18, 0.62);
    backdrop-filter: blur(22px) saturate(160%);
    -webkit-backdrop-filter: blur(22px) saturate(160%);
    border-bottom: 1px solid var(--glass-border);
}
.nav-inner {
    max-width: 980px;
    margin: 0 auto;
    padding: 13px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.nav-brand { display: flex; align-items: center; gap: 10px; color: #fff; }
.brand-mark { color: var(--accent); display: inline-flex; }
.nav-name { font-size: 17px; font-weight: 700; letter-spacing: -0.02em; }
.nav-right { display: flex; align-items: center; gap: 10px; }
.pill {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 4px 11px; border-radius: 980px;
    font-size: 12px; font-weight: 600;
    background: color-mix(in srgb, var(--accent) 14%, transparent);
    color: var(--accent);
}
.pill .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent); animation: pulse 2s ease-in-out infinite; }
.btn-ghost {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 7px 14px; border-radius: 980px;
    border: 1px solid var(--glass-border);
    background: var(--glass);
    color: var(--text-muted);
    font-size: 13px; font-weight: 600;
    text-decoration: none; cursor: pointer; font-family: inherit;
    transition: background var(--ease) 0.15s, color var(--ease) 0.15s, border-color var(--ease) 0.15s;
}
.btn-ghost:hover { background: var(--glass-strong); color: #fff; border-color: var(--glass-border-strong); }

/* hero */
.hero {
    text-align: center;
    padding: 88px 24px 52px;
    animation: fadeUp 0.6s var(--ease) both;
}
.hero-mark {
    display: inline-flex;
    width: 78px; height: 78px;
    align-items: center; justify-content: center;
    border-radius: 26px;
    corner-shape: squircle;
    background: color-mix(in srgb, var(--accent) 16%, transparent);
    border: 1px solid color-mix(in srgb, var(--accent) 22%, transparent);
    color: var(--accent);
    margin-bottom: 24px;
    box-shadow: 0 18px 50px -18px rgba(var(--accent-rgb), 0.5);
}
.hero-mark svg { width: 40px; height: 40px; }
.hero h1 {
    font-family: 'Aptos Display', 'Segoe UI Variable Display', 'PingFang SC', sans-serif;
    font-size: clamp(40px, 8vw, 64px);
    font-weight: 700;
    letter-spacing: -0.035em;
    line-height: 1.04;
    margin-bottom: 14px;
    background: linear-gradient(180deg, #fff, rgba(255,255,255,0.74));
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
}
.hero p {
    font-size: clamp(16px, 2.4vw, 20px);
    color: var(--text-muted);
    font-weight: 400;
    margin-bottom: 30px;
}
.hero-actions { display: flex; justify-content: center; gap: 12px; flex-wrap: wrap; }
.btn {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 12px 22px; border-radius: 980px;
    font-size: 14px; font-weight: 600;
    text-decoration: none; cursor: pointer; font-family: inherit;
    transition: transform var(--ease) 0.15s, filter var(--ease) 0.15s, background var(--ease) 0.15s, border-color var(--ease) 0.15s;
}
.btn:active { transform: scale(0.97); }
.btn-primary {
    background: var(--accent); color: #0e0d12;
    box-shadow: 0 10px 30px -10px rgba(var(--accent-rgb), 0.6);
}
.btn-primary:hover { filter: brightness(1.08); }
.btn-outline {
    background: var(--glass); color: var(--text);
    border: 1px solid var(--glass-border);
}
.btn-outline:hover { background: var(--glass-strong); border-color: var(--glass-border-strong); }

/* 容器与卡片 */
.container { max-width: 980px; margin: 0 auto; padding: 0 24px 56px; }
.card {
    background: var(--glass);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius);
    corner-shape: squircle;
    backdrop-filter: blur(18px) saturate(145%);
    -webkit-backdrop-filter: blur(18px) saturate(145%);
    padding: 26px 28px;
    margin-bottom: 20px;
    animation: fadeUp 0.5s var(--ease) both;
}
.card:nth-child(2) { animation-delay: 0.06s; }
.card:nth-child(3) { animation-delay: 0.12s; }
.card-head {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 18px; gap: 12px;
}
.card-title {
    font-size: 16px; font-weight: 700;
    color: #fff; letter-spacing: -0.015em;
    display: flex; align-items: center; gap: 9px;
}
.card-title .ico { color: var(--accent); display: inline-flex; }

/* 状态信息列表 */
.info-list {
    background: rgba(0, 0, 0, 0.2);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-sm);
    corner-shape: squircle;
    overflow: hidden;
}
.info-row {
    display: flex; justify-content: space-between; align-items: center;
    padding: 13px 18px; gap: 16px;
    border-bottom: 1px solid var(--separator);
}
.info-row:last-child { border-bottom: none; }
.info-label { font-size: 13px; color: var(--text-muted); font-weight: 500; flex-shrink: 0; }
.info-value { font-size: 14px; font-weight: 600; color: var(--text); text-align: right; word-break: break-all; }
.info-value a { color: var(--accent); text-decoration: none; }
.info-value a:hover { text-decoration: underline; }

/* 快捷入口 */
.links-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 14px;
}
.link-card {
    display: flex; align-items: center; gap: 14px;
    padding: 18px 20px;
    background: var(--glass);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-sm);
    corner-shape: squircle;
    text-decoration: none; color: var(--text);
    min-height: 68px;
    transition: transform var(--ease) 0.2s, border-color var(--ease) 0.2s, background var(--ease) 0.2s;
}
.link-card:hover {
    transform: translateY(-2px);
    background: var(--glass-strong);
    border-color: var(--glass-border-strong);
}
.link-icon {
    width: 42px; height: 42px;
    border-radius: 13px;
    corner-shape: squircle;
    background: color-mix(in srgb, var(--accent) 14%, transparent);
    display: flex; align-items: center; justify-content: center;
    font-size: 21px; flex-shrink: 0;
}
.link-info { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.link-title { font-size: 15px; font-weight: 600; color: #fff; }
.link-desc { font-size: 13px; color: var(--text-muted); }
.link-arrow { color: var(--text-subtle); font-size: 18px; transition: var(--ease) 0.2s; }
.link-card:hover .link-arrow { color: var(--accent); transform: translateX(3px); }

/* 平台标记 */
.platforms { display: flex; gap: 8px; flex-wrap: wrap; }
.chip {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 6px 13px; border-radius: 980px;
    font-size: 13px; font-weight: 600;
    background: var(--glass); border: 1px solid var(--glass-border);
    color: var(--text-muted);
}
.chip .pdot { width: 7px; height: 7px; border-radius: 50%; }
.chip.netease .pdot { background: #ff6363; }
.chip.tencent .pdot { background: var(--accent); }

@keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
@keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }

@media (max-width: 768px) {
    .nav-inner { padding: 12px 16px; }
    .nav-name { font-size: 16px; }
    .hero { padding: 60px 20px 40px; }
    .card { padding: 22px 20px; }
    .links-grid { grid-template-columns: 1fr; }
}
@media (max-width: 480px) {
    .hero { padding: 44px 16px 32px; }
    .hero-mark { width: 66px; height: 66px; border-radius: 22px; }
    .hero-mark svg { width: 34px; height: 34px; }
    .card { padding: 18px 16px; margin-bottom: 14px; }
    .info-row { padding: 12px 14px; }
    .container { padding: 0 14px 36px; }
    .btn { padding: 11px 18px; font-size: 13px; }
}
`

const buildHtml = (c) => {
    const baseUrl = get_url(c)
    const runtime = get_runtime()
    const now = new Date().toLocaleString('zh-CN')
    const region = config.OVERSEAS ? '海外' : '大陆'

    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Meting API · 多平台音乐 API</title>
    <style>${buildStyle()}</style>
</head>
<body>
    <nav class="nav">
        <div class="nav-inner">
            <div class="nav-brand">
                <span class="brand-mark">${BRAND_SVG}</span>
                <span class="nav-name">Meting API</span>
            </div>
            <div class="nav-right">
                <span class="pill"><span class="dot"></span>运行中</span>
                <a class="btn-ghost" href="${baseUrl}docs">文档</a>
            </div>
        </div>
    </nav>

    <section class="hero">
        <div class="hero-mark">${BRAND_SVG}</div>
        <h1>Meting API</h1>
        <p>多平台音乐 API 服务 · 网易云 / QQ音乐</p>
        <div class="hero-actions">
            <a class="btn btn-primary" href="${baseUrl}test">打开测试播放器 ›</a>
            <a class="btn btn-outline" href="${baseUrl}api">查看 API 接口</a>
        </div>
    </section>

    <div class="container">
        <div class="card">
            <div class="card-head">
                <span class="card-title">服务状态</span>
                <span class="pill"><span class="dot"></span>在线</span>
            </div>
            <div class="info-list">
                <div class="info-row"><span class="info-label">版本</span><span class="info-value">1.1.2</span></div>
                <div class="info-row"><span class="info-label">运行环境</span><span class="info-value">${runtime}</span></div>
                <div class="info-row"><span class="info-label">内部端口</span><span class="info-value">${config.PORT}</span></div>
                <div class="info-row"><span class="info-label">部署区域</span><span class="info-value">${region}</span></div>
                <div class="info-row"><span class="info-label">当前时间</span><span class="info-value">${now}</span></div>
                <div class="info-row"><span class="info-label">服务地址</span><span class="info-value"><a href="${baseUrl}">${baseUrl}</a></span></div>
            </div>
        </div>

        <div class="card">
            <div class="card-head">
                <span class="card-title">支持平台</span>
            </div>
            <div class="platforms">
                <span class="chip netease"><span class="pdot"></span>网易云音乐</span>
                <span class="chip tencent"><span class="pdot"></span>QQ音乐</span>
            </div>
        </div>

        <div class="card">
            <div class="card-head">
                <span class="card-title">快速导航</span>
            </div>
            <div class="links-grid">
                <a class="link-card" href="${baseUrl}test">
                    <span class="link-icon">🎶</span>
                    <span class="link-info">
                        <span class="link-title">测试播放器</span>
                        <span class="link-desc">在线播放与功能演示</span>
                    </span>
                    <span class="link-arrow">›</span>
                </a>
                <a class="link-card" href="${baseUrl}api">
                    <span class="link-icon">⚡</span>
                    <span class="link-info">
                        <span class="link-title">API 接口</span>
                        <span class="link-desc">音乐数据服务端点</span>
                    </span>
                    <span class="link-arrow">›</span>
                </a>

            </div>
        </div>
    </div>
</body>
</html>`
}

export const homeHandler = (c) => c.html(buildHtml(c))
