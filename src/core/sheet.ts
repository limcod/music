import {EOL} from "os";
import {readLine, writeFile, appendFile, findFileBySuffix} from "@/lib/file";
import Log from "@/lib/log";
import {reactive} from "vue";

export const sheetData = reactive({
    list: [] //歌单列表
});

export interface SheetList {
    name: string; //歌单名称
    cover?: string; //图片地址
    path: string; //歌单对应文件路径
}

export interface SongData {
    name: string; //歌曲名称
    url: string; //歌曲地址
    cover: string; //图片地址
    album: { cover: string; id: number; name: string; }; //专辑信息
    artists: [{ id: number; name: string }]; //歌手
}


class Sheet {
    private static instance: Sheet;
    private readonly suffix: string = ".ting"; //歌单后缀名
    private path: string = "./data/sheet"; //歌单路径

    static getInstance() {
        if (!Sheet.instance) Sheet.instance = new Sheet();
        return Sheet.instance;
    }

    constructor() {}

    /**
     * 获取路径
     * @param path 歌单名称
     */
    getPath(path: string) {
        return `${this.path}/${path}${this.suffix}`;
    }

    /**
     * 当前歌单列表
     */
    list() {
        let req = findFileBySuffix(this.path, this.suffix);
        for (let i of req) {
            readLine(i, -1).then((e: string) => {
                try {
                    if (e) sheetData.list.push(JSON.parse(e));
                } catch (e) {
                    Log.error(e);
                }
            });
        }
    }

    /**
     * 歌单详情
     * @param path
     */
    async details(path: string) {
        try {
            let data = await readLine(path) as string[];
            data.shift();
            return data.map(e => JSON.parse(e));
        } catch (e) {
            Log.error(e);
        }
    }

    /**
     * 创建歌单
     */
    async create(name: string, data: SheetList) {
        return await writeFile(this.getPath(name), Buffer.from(JSON.stringify(data) + EOL).toString("binary"), {encoding: "binary"});
    }

    /**
     * 添加歌曲到歌单
     */
    async addSong(path: string, data: SongData) {
        try {
            return await appendFile(path, Buffer.from(JSON.stringify(data) + EOL).toString("binary"));
        } catch (e) {
            return 0;
        }
    }

}

export const sheet = Sheet.getInstance();