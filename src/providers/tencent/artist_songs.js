import config from "../../config.js"
import { get_song_url } from "./song.js"
import { changeUrlQuery } from "./util.js"

// 获取歌手热门歌曲，id 为 singermid
const get_artist_songs = async (id, cookie = '', { limit = 30 } = {}) => {
    const data = {
        data: JSON.stringify({
            comm: { ct: 24, cv: 0 },
            singer: {
                method: 'get_singer_detail_info',
                param: {
                    sort: 5,
                    singermid: id,
                    sin: 0,
                    num: limit,
                },
                module: 'music.web_singer_info_svr',
            },
        }),
    }

    const headers = {
        Referer: 'https://y.qq.com',
    }

    const url = changeUrlQuery(data, 'http://u.y.qq.com/cgi-bin/musicu.fcg')

    let result = await fetch(url, { headers });

    result = await result.json()
    const list = result.singer?.data?.songlist || []

    let jsonp
    if (config.OVERSEAS && list.length) {
        const ids = list.map(song => song.mid)
        jsonp = await get_song_url(ids.join(','), cookie)
    }

    const res = list.map(song => ({
        name: song.name,
        artist: song.singer.reduce((i, v) => ((i ? i + " / " : i) + v.name), ''),
        title: song.name,
        author: song.singer.reduce((i, v) => ((i ? i + " / " : i) + v.name), ''),
        pic: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${song.album.mid}.jpg`,
        url: config.OVERSEAS ? '' : song.mid,
        lrc: song.mid,
        songmid: song.mid,
    }))

    if (config.OVERSEAS && res.length) res[0].url = jsonp
    return res
}

export { get_artist_songs }
