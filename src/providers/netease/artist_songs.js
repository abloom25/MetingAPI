import { request } from "./util.js"
import { map_song_list } from "./util.js"

export const get_artist_songs = async (id, cookie = '', { limit } = {}) => {
    id = parseInt(id)
    const data = {
        id,
    }

    const res = await request('POST', `https://music.163.com/api/artist/top/song`, data, {
        crypto: 'weapi',
        cookie: cookie || {},
    })

    const songs = map_song_list(res)
    return limit === undefined ? songs : songs.slice(0, limit)

}
