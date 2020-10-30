import MusicApi, {getSongUrlResult, getTopListResult, vendor} from '@suen/music-api'
import Log from "../../lib/log";

/**
 * 获取歌曲播放链接
 */
export async function getSongUrl(vendor: vendor, id: number | string) {
    try {
        let req = await MusicApi.getSongUrl(vendor, id) as getSongUrlResult;
        return req.data;
    } catch (e) {
        Log.error(e.toString());
        return null;
    }
}

/**
 * 获取排行榜
 */
export async function getTopList() {
    try {
        let req = await MusicApi.getTopList("0") as getTopListResult;
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
        return await MusicApi.searchSong(key);
    } catch (e) {
        Log.error(e.toString());
        return null;
    }
}
