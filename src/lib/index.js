'use strict';
const main = require('./main');
(async () => {
    await main.init(); //初始化
    await main.ipc(); //开启ipc通讯
    await main.mcSource(); //音乐源线程
})()


