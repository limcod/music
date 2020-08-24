'use strict';
const netease = require('./netease'); //网易云

class polymerization {
    static getInstance() {
        if (!polymerization.instance) polymerization.instance = new polymerization();
        return polymerization.instance;
    }

    constructor() {
        //接口请求缓存
        this.cache = {
            netease: {}
        }
    }

    //热门歌单
    async highquality() {
        if (this.cache.netease['highquality']) {
            return this.cache.netease['highquality'];
        }
        let data;
        let req = await netease.highquality({});
        if (req && req.code === 200) {
            data = {
                playlists: req.playlists,
                total: req.total
            }
        } else data = null;
        if (data) this.cache.netease['highquality'] = data;
        return data;
    }
}

let mc = polymerization.getInstance();

process.on('message', async (e) => {
    switch (e.data.func) {
        case 'highquality':
            process.send({
                code: 0,
                type: e.type,
                r: e.r,
                data: await mc.highquality()
            });
            break;
    }
});

process.send({code: 11});