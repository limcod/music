import MusicApi from './musicapi/music-api';
import Log from "../lib/log";
import instance from './musicapi/util/flyio.node'

const muApi = MusicApi(instance);

/**
 * 获取歌曲播放链接
 */
export async function getSongUrl(vendor: string, id: number | string) {
    try {
        let req = await muApi.getSongUrl(vendor, id);
        if (req.status && req.data.url) return req.data;
        return null;
    } catch (e) {
        Log.error(e.toString());
        return null;
    }
}

/**
 * 获取排行榜
 */
export async function getTopList(id: string) {
    try {
        let req = await muApi.getTopList(id) as any;
        let reqs = await muApi.getPlaylistDetail("netease", "5393825517", 10, 10);
        console.log(reqs);
        if (!req.status) return null;
        return req.data;
    } catch (e) {
        Log.error(e.toString());
        return null;
    }
}

/**
 * 搜索
 * @param key 关键字
 */
export async function searchSong(key: string) {
    try {
        return await muApi.searchSong(key);
    } catch (e) {
        Log.error(e.toString());
        return null;
    }
}
