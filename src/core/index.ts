import {reactive} from "vue";
import Log from "@/lib/log";
import {getGlobal} from "@/lib";

let path = {
    sheet: "./data/sheet", //歌单路径
    down: "./data/down", //下载歌曲存储路径
}
try {
    path = getGlobal("setting")["path"];
} catch (e) {
    Log.error("[getSetting]", e);
}

export const TingPath = reactive(path);

export const SongType: string[] = [
    "mp3",
    "wav",
    "wma",
    "midi"
];

export const SongTopData = reactive({
    keyword: "", //搜索关键字
    topList: [], //热榜
});

export const sheetSuffix: string = ".ting";//歌单后缀名

/**
 * 获取歌单路径
 * @param path 歌单名称
 */
export function getSheetPath(path: string) {
    return `${TingPath.sheet}/${path}${sheetSuffix}`;
}

