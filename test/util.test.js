import { expect, test } from 'vitest'
import { upgradeHttpToHttps } from '../src/util.js'

test('upgrade public http url to https', () => {
    expect(upgradeHttpToHttps('http://example.com/song.mp3')).toBe('https://example.com/song.mp3')
    expect(upgradeHttpToHttps('http://example.com/song.mp3?token=abc#play')).toBe('https://example.com/song.mp3?token=abc#play')
})

test('keep local and private http urls unchanged', () => {
    expect(upgradeHttpToHttps('http://localhost:3000/api')).toBe('http://localhost:3000/api')
    expect(upgradeHttpToHttps('http://127.0.0.1:3000/api')).toBe('http://127.0.0.1:3000/api')
    expect(upgradeHttpToHttps('http://[::1]:3000/api')).toBe('http://[::1]:3000/api')
    expect(upgradeHttpToHttps('http://192.168.1.10:3000/api')).toBe('http://192.168.1.10:3000/api')
    expect(upgradeHttpToHttps('http://10.0.0.2:3000/api')).toBe('http://10.0.0.2:3000/api')
    expect(upgradeHttpToHttps('http://172.16.0.2:3000/api')).toBe('http://172.16.0.2:3000/api')
})

test('keep non-http values unchanged', () => {
    expect(upgradeHttpToHttps('https://example.com/song.mp3')).toBe('https://example.com/song.mp3')
    expect(upgradeHttpToHttps('@qq_get_url_from_json@callback@fn@http://example.com')).toBe('@qq_get_url_from_json@callback@fn@http://example.com')
    expect(upgradeHttpToHttps('song-id')).toBe('song-id')
    expect(upgradeHttpToHttps('')).toBe('')
    expect(upgradeHttpToHttps(null)).toBeNull()
})
