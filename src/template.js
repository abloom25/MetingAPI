import store from "./admin/store.js"

const platformNames = {
    netease: '网易云音乐',
    tencent: 'QQ音乐'
}

const typeNames = {
    playlist: '歌单',
    song: '单曲',
    artist: '歌手',
    search: '搜索',
    lrc: '歌词',
    pic: '封面',
    url: '链接'
}

// 可加入播放队列的类型(返回曲目数组)
const PLAYABLE_TYPES = ['playlist', 'song', 'artist', 'search']

const buildStyle = () => `
:root {
    --accent: #81d8d0;
    --accent-soft: #a7e7e2;
    --accent-rgb: 129, 216, 208;
    --bg: #0e0d12;
    --text: rgba(255, 255, 255, 0.92);
    --text-secondary: rgba(255, 255, 255, 0.68);
    --text-muted: rgba(255, 255, 255, 0.43);
    --glass: rgba(255, 255, 255, 0.075);
    --glass-strong: rgba(255, 255, 255, 0.11);
    --glass-border: rgba(255, 255, 255, 0.11);
    --glass-border-strong: rgba(255, 255, 255, 0.14);
    --separator: rgba(255, 255, 255, 0.1);
    --radius: 22px;
    --radius-sm: 14px;
    --radius-xs: 12px;
    --ease: cubic-bezier(0.16, 1, 0.3, 1);
}
* { margin: 0; padding: 0; box-sizing: border-box; }
html { -webkit-text-size-adjust: 100%; }
body {
    font-family: Inter, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif;
    background:
        radial-gradient(circle at 18% 12%, rgba(var(--accent-rgb), 0.16), transparent 42%),
        radial-gradient(circle at 82% 80%, rgba(var(--accent-rgb), 0.07), transparent 46%),
        var(--bg);
    min-height: 100vh;
    color: var(--text);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    letter-spacing: -0.01em;
    padding-bottom: 120px;
}
.nav {
    position: sticky;
    top: 0;
    z-index: 50;
    background: rgba(14, 13, 18, 0.6);
    backdrop-filter: blur(22px) saturate(180%);
    -webkit-backdrop-filter: blur(22px) saturate(180%);
    border-bottom: 1px solid var(--glass-border);
}
.nav-inner {
    max-width: 980px;
    margin: 0 auto;
    padding: 14px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.nav-left { display: flex; align-items: center; gap: 12px; }
.nav-title { font-size: 20px; font-weight: 700; letter-spacing: -0.02em; }
.pill {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 4px 12px; border-radius: 980px;
    font-size: 12px; font-weight: 600;
    background: rgba(var(--accent-rgb), 0.14); color: var(--accent);
}
.pill .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent); animation: pulse 2s ease-in-out infinite; }
.btn-text {
    background: none; border: 1px solid var(--glass-border);
    color: var(--accent); font-size: 14px; font-weight: 500;
    cursor: pointer; padding: 7px 14px; border-radius: 980px;
    transition: var(--ease) 0.15s; text-decoration: none; font-family: inherit;
}
.btn-text:hover { background: rgba(var(--accent-rgb), 0.12); border-color: var(--glass-border-strong); }
.container { max-width: 980px; margin: 0 auto; padding: 28px 24px 48px; }

/* 播放器 */
.player {
    position: fixed;
    bottom: 0; left: 0; right: 0;
    z-index: 100;
    background: rgba(14, 13, 18, 0.82);
    backdrop-filter: blur(28px) saturate(180%);
    -webkit-backdrop-filter: blur(28px) saturate(180%);
    border-top: 1px solid var(--glass-border);
    padding: 14px 20px;
}
.player-inner { max-width: 980px; margin: 0 auto; display: flex; align-items: center; gap: 16px; }
.player-art {
    width: 56px; height: 56px; border-radius: 12px;
    background: rgba(255,255,255,0.06) center/cover no-repeat;
    border: 1px solid var(--glass-border);
    flex-shrink: 0;
}
.player-meta { flex: 1; min-width: 0; }
.player-title { font-size: 15px; font-weight: 600; color: var(--text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.player-artist { font-size: 12px; color: var(--text-secondary); margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.player-controls { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }
.pbtn {
    width: 38px; height: 38px; border-radius: 50%;
    border: 1px solid var(--glass-border); background: transparent;
    color: var(--text); cursor: pointer; font-size: 15px;
    display: flex; align-items: center; justify-content: center;
    transition: var(--ease) 0.15s; font-family: inherit;
}
.pbtn:hover { background: rgba(255,255,255,0.1); border-color: var(--glass-border-strong); }
.pbtn.primary { background: var(--accent); color: #0e0d12; border-color: var(--accent); width: 44px; height: 44px; font-size: 17px; }
.pbtn.primary:hover { filter: brightness(1.1); }
.pbtn:disabled { opacity: 0.4; cursor: default; }
.player-progress {
    max-width: 980px; margin: 8px auto 0; display: flex; align-items: center; gap: 10px;
}
.player-progress .time { font-size: 11px; color: var(--text-muted); font-variant-numeric: tabular-nums; width: 38px; text-align: center; }
.seek {
    flex: 1; height: 4px; border-radius: 2px;
    background: rgba(255,255,255,0.14); position: relative; cursor: pointer;
}
.seek .fill { position: absolute; left: 0; top: 0; bottom: 0; background: var(--accent); border-radius: 2px; width: 0%; }
.seek .knob { position: absolute; top: 50%; transform: translate(-50%,-50%); width: 12px; height: 12px; border-radius: 50%; background: #fff; left: 0%; opacity: 0; transition: opacity 0.15s; }
.seek:hover .knob { opacity: 1; }

/* 区块 */
.section-title { font-size: 13px; font-weight: 600; color: var(--text-muted); margin: 8px 4px 12px; text-transform: uppercase; letter-spacing: 0.5px; }
.group { margin-bottom: 28px; animation: fadeUp 0.5s var(--ease) both; }
.group-header { display: flex; align-items: center; gap: 12px; padding: 0 8px 14px; }
.group-icon { width: 34px; height: 34px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 18px; color: #fff; }
.group-name { font-size: 20px; font-weight: 700; letter-spacing: -0.02em; }
.list { background: var(--glass); border: 1px solid var(--glass-border); border-radius: var(--radius); backdrop-filter: blur(22px); -webkit-backdrop-filter: blur(22px); overflow: hidden; }
.track { display: flex; align-items: center; gap: 12px; padding: 12px 18px; border-bottom: 1px solid var(--separator); cursor: pointer; transition: background var(--ease) 0.15s; }
.track:last-child { border-bottom: none; }
.track:hover { background: rgba(255,255,255,0.05); }
.track.active { background: rgba(var(--accent-rgb), 0.12); }
.track-num { width: 24px; text-align: center; font-size: 13px; color: var(--text-muted); font-variant-numeric: tabular-nums; flex-shrink: 0; }
.track.active .track-num { color: var(--accent); }
.track-info { flex: 1; min-width: 0; }
.track-name { font-size: 14px; font-weight: 500; color: var(--text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.track-name.playing { color: var(--accent); }
.track-artist { font-size: 12px; color: var(--text-secondary); margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.track-src { font-size: 11px; color: var(--text-muted); flex-shrink: 0; }
.tag { display: inline-flex; align-items: center; padding: 2px 9px; border-radius: 980px; font-size: 10px; font-weight: 600; background: rgba(var(--accent-rgb), 0.14); color: var(--accent); }
.loading-row { padding: 16px 18px; color: var(--text-muted); font-size: 13px; }
.loading-row .spin { display: inline-block; width: 13px; height: 13px; border: 2px solid var(--text-muted); border-top-color: transparent; border-radius: 50%; animation: spin 0.7s linear infinite; vertical-align: -2px; margin-right: 8px; }
.empty { text-align: center; padding: 64px 24px; color: var(--text-muted); font-size: 15px; }
footer { text-align: center; padding: 32px 24px 48px; color: var(--text-muted); font-size: 13px; }
footer a { color: var(--accent); text-decoration: none; }
footer a:hover { text-decoration: underline; }
@keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
@keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
@keyframes spin { to { transform: rotate(360deg); } }
@media (max-width: 768px) {
    .container { padding: 20px 16px 40px; }
    .nav-inner { padding: 12px 16px; }
    .player { padding: 12px 14px; }
    .player-art { width: 48px; height: 48px; }
    .player-inner { gap: 12px; }
    .track { padding: 11px 14px; gap: 10px; }
    .track-src { display: none; }
}
@media (max-width: 480px) {
    .nav-title { font-size: 18px; }
    .player-controls .pbtn { width: 34px; height: 34px; }
    .player-controls .pbtn.primary { width: 40px; height: 40px; }
    body { padding-bottom: 110px; }
}
`

const escAttr = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

const buildHtml = () => {
    const { items } = store.getTestLibrary()
    const visible = items.filter((i) => i.show !== false)

    // 按 platform 分组的可播放来源
    const grouped = {}
    const order = []
    for (const it of visible) {
        if (!PLAYABLE_TYPES.includes(it.type)) continue
        if (!grouped[it.platform]) { grouped[it.platform] = []; order.push(it.platform) }
        grouped[it.platform].push(it)
    }

    // 序列化来源给前端 JS
    const sources = JSON.stringify(order.flatMap((platform) =>
        grouped[platform].map((it) => ({
            platform,
            type: it.type,
            value: it.value,
            label: it.name || typeNames[it.type] || it.type
        }))
    ))

    let sourcesHtml = ''
    if (order.length === 0) {
        sourcesHtml = `        <div class="empty">暂无可播放项，请在管理后台「测试曲库」中添加歌单/单曲/歌手/搜索类条目。</div>\n`
    }
    for (const platform of order) {
        sourcesHtml += `        <div class="group">
            <div class="group-header">
                <span class="group-icon" style="background:${platform === 'netease' ? '#ff6363' : '#81d8d0'}">${platform === 'netease' ? '🎶' : '🎵'}</span>
                <span class="group-name">${platformNames[platform] || platform}</span>
            </div>
            <div class="list" id="list-${platform}"><div class="loading-row"><span class="spin"></span>加载中…</div></div>
        </div>
`
    }

    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Meting API · 测试</title>
    <style>${buildStyle()}</style>
</head>
<body>
    <nav class="nav">
        <div class="nav-inner">
            <div class="nav-left">
                <span class="nav-title">测试</span>
                <span class="pill"><span class="dot"></span>在线</span>
            </div>
            <a class="btn-text" href="/">‹ 首页</a>
        </div>
    </nav>
    <div class="container">
        <div class="section-title">播放队列</div>
${sourcesHtml}    </div>

    <div class="player">
        <div class="player-inner">
            <div class="player-art" id="pArt"></div>
            <div class="player-meta">
                <div class="player-title" id="pTitle">未播放</div>
                <div class="player-artist" id="pArtist">从上方选择一首曲目</div>
            </div>
            <div class="player-controls">
                <button class="pbtn" id="btnPrev" title="上一首">‹‹</button>
                <button class="pbtn primary" id="btnPlay" title="播放/暂停">▶</button>
                <button class="pbtn" id="btnNext" title="下一首">››</button>
            </div>
        </div>
        <div class="player-progress">
            <span class="time" id="pCur">0:00</span>
            <div class="seek" id="seek"><div class="fill" id="seekFill"></div><div class="knob" id="seekKnob"></div></div>
            <span class="time" id="pDur">0:00</span>
        </div>
    </div>
    <audio id="audio"></audio>

    <footer>Powered by Meting API</footer>
    <script>
    (function(){
        const SOURCES = ${sources};
        const audio = document.getElementById('audio');
        let queue = [];      // {name, artist, url, pic, lrc, srcLabel, srcPlatform}
        let current = -1;

        const fmtTime = (s) => { if(!s||isNaN(s)) return '0:00'; const m=Math.floor(s/60); const sec=Math.floor(s%60); return m+':'+String(sec).padStart(2,'0'); };
        const esc = (s) => String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

        // 拉取每个来源的曲目列表
        async function loadSources(){
            await Promise.all(SOURCES.map(async (src)=>{
                const container = document.getElementById('list-'+src.platform);
                if(!container) return;
                try{
                    const res = await fetch('api?server='+encodeURIComponent(src.platform)+'&type='+encodeURIComponent(src.type)+'&id='+encodeURIComponent(src.value));
                    if(!res.ok){ container.innerHTML = '<div class="loading-row">加载失败 (HTTP '+res.status+')</div>'; return; }
                    const data = await res.json();
                    const tracks = Array.isArray(data) ? data : [];
                    if(tracks.length===0){ container.innerHTML = '<div class="loading-row">暂无曲目</div>'; return; }
                    const startIdx = queue.length;
                    tracks.forEach(t => queue.push({
                        name: t.name || '未知曲目',
                        artist: t.artist || '',
                        url: t.url || '',
                        pic: t.pic || '',
                        lrc: t.lrc || '',
                        srcLabel: src.label,
                        srcPlatform: src.platform
                    }));
                    renderList(src.platform, tracks, startIdx);
                }catch(e){
                    container.innerHTML = '<div class="loading-row">加载失败</div>';
                }
            }));
        }

        function renderList(platform, tracks, startIdx){
            const container = document.getElementById('list-'+platform);
            container.innerHTML = tracks.map((t,i)=>{
                const idx = startIdx + i;
                return '<div class="track" data-idx="'+idx+'">'+
                    '<span class="track-num">'+(i+1)+'</span>'+
                    '<div class="track-info"><div class="track-name">'+esc(t.name||'未知曲目')+'</div>'+
                    (t.artist ? '<div class="track-artist">'+esc(t.artist)+'</div>' : '') +'</div>'+
                    '<span class="track-src">'+esc(platform)+'</span>'+
                '</div>';
            }).join('');
            container.querySelectorAll('.track').forEach(el=>{
                el.addEventListener('click', ()=> play(parseInt(el.dataset.idx,10)));
            });
        }

        function play(idx){
            if(idx<0 || idx>=queue.length) return;
            current = idx;
            const t = queue[idx];
            audio.src = t.url;
            audio.play().catch(()=>{});
            updateUI();
            highlightTrack();
        }

        function updateUI(){
            const t = queue[current];
            if(!t){ return; }
            document.getElementById('pTitle').textContent = t.name;
            document.getElementById('pArtist').textContent = (t.artist ? t.artist + ' · ' : '') + t.srcLabel;
            const art = document.getElementById('pArt');
            if(t.pic){ art.style.backgroundImage = 'url("'+t.pic+'")'; } else { art.style.backgroundImage = ''; }
            document.getElementById('btnPlay').textContent = '▶';
        }

        function highlightTrack(){
            document.querySelectorAll('.track').forEach(el=>{
                const idx = parseInt(el.dataset.idx,10);
                if(idx===current){
                    el.classList.add('active');
                    el.querySelector('.track-name').classList.add('playing');
                }else{
                    el.classList.remove('active');
                    el.querySelector('.track-name').classList.remove('playing');
                }
            });
        }

        function togglePlay(){
            if(current<0 && queue.length>0){ play(0); return; }
            if(audio.paused){ audio.play().catch(()=>{}); } else { audio.pause(); }
        }

        document.getElementById('btnPlay').addEventListener('click', togglePlay);
        document.getElementById('btnPrev').addEventListener('click', ()=>{ if(current>0) play(current-1); });
        document.getElementById('btnNext').addEventListener('click', ()=>{ if(current<queue.length-1) play(current+1); });

        audio.addEventListener('play', ()=>{ document.getElementById('btnPlay').textContent = '⏸'; });
        audio.addEventListener('pause', ()=>{ document.getElementById('btnPlay').textContent = '▶'; });
        audio.addEventListener('ended', ()=>{ if(current<queue.length-1) play(current+1); });
        audio.addEventListener('timeupdate', ()=>{
            const cur = audio.currentTime, dur = audio.duration;
            document.getElementById('pCur').textContent = fmtTime(cur);
            document.getElementById('pDur').textContent = fmtTime(dur);
            const pct = dur ? (cur/dur*100) : 0;
            document.getElementById('seekFill').style.width = pct+'%';
            document.getElementById('seekKnob').style.left = pct+'%';
        });

        // 进度条拖拽
        const seek = document.getElementById('seek');
        seek.addEventListener('click', (e)=>{
            const rect = seek.getBoundingClientRect();
            const pct = Math.min(1, Math.max(0, (e.clientX-rect.left)/rect.width));
            if(audio.duration) audio.currentTime = pct * audio.duration;
        });

        loadSources();
    })();
    </script>
</body>
</html>`
}

export const handler = (c) => {
    return c.html(buildHtml())
}
