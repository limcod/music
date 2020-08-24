'use strict';
const {
    top_playlist_highquality
} = require('NeteaseCloudMusicApi');

class netease {
    static getInstance() {
        if (!netease.instance) netease.instance = new netease();
        return netease.instance;
    }

    constructor() {
    }

    //热门歌单
    async highquality() {
        let req = await top_playlist_highquality({});
        if (req && req.status === 200) return req.body;
        else return null;
    }
}


module.exports = netease.getInstance();