import {reactive} from "vue";

export const TingPath = reactive({
    sheet: "./data/sheet", //歌单路径
    down: "./data/down", //下载歌曲存储路径
});


export const SongType: string[] = [
    "mp3",
    "wav",
    "wma",
    "midi"
];

export const sheetSuffix: string = ".ting";//歌单后缀名

/**
 * 获取歌单路径
 * @param path 歌单名称
 */
export function getSheetPath(path: string) {
    return `${TingPath.sheet}/${path}${sheetSuffix}`;
}

