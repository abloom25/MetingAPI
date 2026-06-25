import { get_url } from "./util.js"

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
    max-width: 920px;
    margin: 0 auto;
    padding: 13px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.nav-brand { display: flex; align-items: center; gap: 10px; color: #fff; text-decoration: none; }
.brand-mark { color: var(--accent); display: inline-flex; }
.nav-name { font-size: 17px; font-weight: 700; letter-spacing: -0.02em; }
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

/* 头部 */
.head {
    max-width: 920px;
    margin: 0 auto;
    padding: 56px 24px 28px;
    animation: fadeUp 0.5s var(--ease) both;
}
.head h1 {
    font-family: 'Aptos Display', 'Segoe UI Variable Display', 'PingFang SC', sans-serif;
    font-size: clamp(34px, 6vw, 48px);
    font-weight: 700;
    letter-spacing: -0.035em;
    line-height: 1.05;
    margin-bottom: 12px;
    background: linear-gradient(180deg, #fff, rgba(255,255,255,0.74));
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
}
.head p { font-size: clamp(15px, 2.2vw, 18px); color: var(--text-muted); }

/* 容器与卡片 */
.container { max-width: 920px; margin: 0 auto; padding: 0 24px 64px; }
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
.card-title {
    font-size: 16px; font-weight: 700;
    color: #fff; letter-spacing: -0.015em;
    display: flex; align-items: center; gap: 9px;
    margin-bottom: 18px;
}

/* 端点 */
.endpoint {
    display: flex; align-items: center; gap: 12px;
    padding: 14px 18px;
    background: rgba(0, 0, 0, 0.2);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-sm);
    corner-shape: squircle;
}
.method {
    display: inline-flex;
    padding: 4px 11px; border-radius: 980px;
    font-size: 11px; font-weight: 700; letter-spacing: 0.3px;
    background: color-mix(in srgb, var(--accent) 16%, transparent);
    color: var(--accent);
}
.path {
    font-family: 'SF Mono', 'Fira Code', ui-monospace, monospace;
    font-size: 14px; font-weight: 600; color: var(--text);
}

/* 表格 */
.subtitle {
    font-size: 14px; font-weight: 650; color: #fff;
    margin: 22px 0 12px; letter-spacing: -0.01em;
}
.table-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; }
table { width: 100%; border-collapse: collapse; font-size: 13px; min-width: 420px; }
th {
    padding: 10px 14px; text-align: left;
    font-size: 11px; font-weight: 600; color: var(--text-subtle);
    text-transform: uppercase; letter-spacing: 0.4px;
    border-bottom: 1px solid var(--separator);
}
td {
    padding: 12px 14px;
    border-bottom: 1px solid var(--separator);
    color: var(--text); vertical-align: top;
}
tbody tr:last-child td { border-bottom: none; }
.pname {
    font-family: 'SF Mono', 'Fira Code', ui-monospace, monospace;
    font-size: 13px; font-weight: 600; color: var(--accent);
}
.ptype { font-size: 11px; color: var(--text-subtle); font-weight: 600; }
.popt { font-size: 11px; color: var(--text-subtle); font-weight: 600; }
.pdef { font-family: 'SF Mono', 'Fira Code', ui-monospace, monospace; font-size: 11px; color: var(--text-muted); }
.check { color: var(--accent); font-weight: 700; }
.cross { color: var(--text-subtle); }
code {
    font-family: 'SF Mono', 'Fira Code', ui-monospace, monospace;
    background: rgba(255,255,255,0.08); padding: 1px 6px;
    border-radius: 6px; font-size: 0.9em;
}

/* 代码块 */
.code-label {
    font-size: 13px; font-weight: 600; color: var(--text-muted);
    margin-bottom: 8px; display: flex; align-items: center; gap: 8px;
}
.tag {
    display: inline-flex; padding: 2px 8px; border-radius: 980px;
    font-size: 10px; font-weight: 600;
    background: color-mix(in srgb, var(--accent) 16%, transparent);
    color: var(--accent);
}
.code-block {
    position: relative;
    background: rgba(0, 0, 0, 0.35);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-sm);
    corner-shape: squircle;
    padding: 16px 20px;
    overflow-x: auto;
}
.code-block pre {
    font-family: 'SF Mono', 'Fira Code', ui-monospace, monospace;
    font-size: 13px; line-height: 1.6;
    color: rgba(255,255,255,0.88); white-space: pre; margin: 0;
}
.copy-btn {
    position: absolute; top: 10px; right: 10px;
    padding: 6px 12px;
    background: rgba(255,255,255,0.1);
    border: 1px solid var(--glass-border);
    border-radius: 980px;
    color: var(--text-muted);
    font-size: 11px; font-weight: 600;
    cursor: pointer; font-family: inherit;
    transition: var(--ease) 0.15s;
}
.copy-btn:hover { background: rgba(255,255,255,0.18); color: var(--text); }
.copy-btn.copied { background: var(--accent); color: #0e0d12; border-color: var(--accent); }

@keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }

@media (max-width: 768px) {
    .nav-inner { padding: 12px 16px; }
    .nav-name { font-size: 16px; }
    .head { padding: 40px 20px 22px; }
    .card { padding: 22px 20px; }
}
@media (max-width: 480px) {
    .head { padding: 32px 16px 18px; }
    .card { padding: 18px 16px; margin-bottom: 14px; }
    .container { padding: 0 14px 44px; }
    .code-block pre { font-size: 12px; }
}
`

const buildHtml = (c) => {
    const baseUrl = get_url(c).replace(/docs\/?$/, '')

    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>API 文档 · Meting API</title>
    <style>${buildStyle()}</style>
</head>
<body>
    <nav class="nav">
        <div class="nav-inner">
            <a class="nav-brand" href="${baseUrl}">
                <span class="brand-mark">${BRAND_SVG}</span>
                <span class="nav-name">Meting API</span>
            </a>
            <a class="btn-ghost" href="${baseUrl}">‹ 返回首页</a>
        </div>
    </nav>

    <header class="head">
        <h1>API 文档</h1>
        <p>多平台音乐数据接口说明</p>
    </header>

    <div class="container">
        <div class="card">
            <div class="card-title">接口端点</div>
            <div class="endpoint">
                <span class="method">GET</span>
                <span class="path">/api</span>
            </div>

            <div class="subtitle">请求参数</div>
            <div class="table-wrap">
                <table>
                    <thead>
                        <tr><th>参数名</th><th>类型</th><th>必填</th><th>默认值</th><th>说明</th></tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><span class="pname">server</span></td>
                            <td><span class="ptype">string</span></td>
                            <td><span class="popt">否</span></td>
                            <td><span class="pdef">tencent</span></td>
                            <td>音乐平台：<code>netease</code>（网易云）、<code>tencent</code>（QQ音乐）</td>
                        </tr>
                        <tr>
                            <td><span class="pname">type</span></td>
                            <td><span class="ptype">string</span></td>
                            <td><span class="popt">否</span></td>
                            <td><span class="pdef">playlist</span></td>
                            <td>请求类型，可选值见下方支持矩阵</td>
                        </tr>
                        <tr>
                            <td><span class="pname">id</span></td>
                            <td><span class="ptype">string</span></td>
                            <td><span class="popt">否</span></td>
                            <td><span class="pdef">7326220405</span></td>
                            <td>资源ID：歌单ID、歌曲ID、歌手ID、搜索关键词等</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div class="card">
            <div class="card-title">类型支持矩阵</div>
            <div class="table-wrap">
                <table>
                    <thead>
                        <tr><th>type</th><th>说明</th><th>netease</th><th>tencent</th></tr>
                    </thead>
                    <tbody>
                        <tr><td><span class="pname">song</span></td><td>单曲信息</td><td><span class="check">✓</span></td><td><span class="check">✓</span></td></tr>
                        <tr><td><span class="pname">playlist</span></td><td>歌单</td><td><span class="check">✓</span></td><td><span class="check">✓</span></td></tr>
                        <tr><td><span class="pname">artist</span></td><td>歌手歌曲</td><td><span class="check">✓</span></td><td><span class="check">✓</span></td></tr>
                        <tr><td><span class="pname">search</span></td><td>搜索</td><td><span class="check">✓</span></td><td><span class="check">✓</span></td></tr>
                        <tr><td><span class="pname">url</span></td><td>播放链接</td><td><span class="check">✓</span></td><td><span class="check">✓</span></td></tr>
                        <tr><td><span class="pname">lrc</span></td><td>歌词</td><td><span class="check">✓</span></td><td><span class="check">✓</span></td></tr>
                        <tr><td><span class="pname">pic</span></td><td>封面图片</td><td><span class="check">✓</span></td><td><span class="check">✓</span></td></tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div class="card">
            <div class="card-title">请求示例</div>
            <div class="code-label">请求 URL <span class="tag">URL</span></div>
            <div class="code-block">
                <button class="copy-btn" onclick="copyCode(this)">复制</button>
                <pre>${baseUrl}api?server=netease&type=playlist&id=6907557348</pre>
            </div>
        </div>
    </div>

    <script>
    function copyCode(btn) {
        const pre = btn.parentElement.querySelector('pre');
        navigator.clipboard.writeText(pre.textContent).then(() => {
            btn.textContent = '已复制';
            btn.classList.add('copied');
            setTimeout(() => { btn.textContent = '复制'; btn.classList.remove('copied'); }, 1500);
        });
    }
    </script>
</body>
</html>`
}

export const docsHandler = (c) => c.html(buildHtml(c))
