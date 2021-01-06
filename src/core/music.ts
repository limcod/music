import MusicApi from './musicapi';
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
        if (req.status) return req.data;
        return null;
    } catch (e) {
        Log.error(e.toString());
        return null;
    }
}

/**
 * 搜索
 * @param keywords 关键字
 */
export async function searchSong(keywords: string) {
    try {
        return await muApi.searchSong(keywords);
    } catch (e) {
        Log.error(e.toString());
        return null;
    }
}
