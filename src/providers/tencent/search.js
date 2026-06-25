import config from "../../config.js"
import { get_song_url } from "./song.js"
import { changeUrlQuery } from "./util.js"

// 搜索歌曲，id 为关键词
const get_search_songs = async (id, cookie = '') => {
    const data = {
        format: 'json',
        n: 30,
        p: 1,
        w: id,
        cr: 1,
        g_tk: 5381,
        t: 0,
    }

    const headers = {
        Referer: 'https://y.qq.com',
    }

    const url = changeUrlQuery(data, 'http://c.y.qq.com/soso/fcgi-bin/client_search_cp')

    let result = await fetch(url, { headers });

    result = await result.json()
    const list = result.data?.song?.list || []

    let jsonp
    if (config.OVERSEAS && list.length) {
        const ids = list.map(song => song.songmid)
        jsonp = await get_song_url(ids.join(','), cookie)
    }

    const res = list.map(song => ({
        author: song.singer.reduce((i, v) => ((i ? i + " / " : i) + v.name), ''),
        title: song.songname,
        pic: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${song.albummid}.jpg`,
        url: config.OVERSEAS ? '' : song.songmid,
        lrc: song.songmid,
        songmid: song.songmid,
    }))

    if (config.OVERSEAS && res.length) res[0].url = jsonp
    return res
}

export { get_search_songs }
