'use strict';

class audio {
    static getInstance() {
        if (!audio.instance) audio.instance = new audio();
        return audio.instance;
    }

    constructor() {
        console.log('init');
        this.AudioContext = new AudioContext(); //音频api
        this.currentAudio = null; //当前播放音源
        this.sourceAudio = null; //音频的源
        this.gainNode = null; //音量控制节点

        this.cachedType = 0; //缓存进度 0-1  1为完成
        this.cachedTime = 0; //已缓存时长
        this.ingTime = 0; //当前播放时长
        this.allTime = 0; //当前歌曲总时长
    }

    clear() {
        this.currentAudio = null;
        this.sourceAudio = null;
        this.gainNode = null;
        this.cachedType = 0;
        this.cachedTime = 0;
        this.ingTime = 0;
        this.allTime = 0;
    }

    async play(url) {
        return new Promise((resolve, reject) => {
            if (this.currentAudio) {
                this.currentAudio.play();//播放
                resolve(0);
                return;
            }
            if (url) {
                this.currentAudio = new Audio(url);
                this.currentAudio.crossOrigin = "anonymous"; //音源跨域
                this.sourceAudio = this.AudioContext.createMediaElementSource(this.currentAudio);
                this.gainNode = this.AudioContext.createGain();

                this.sourceAudio.connect(this.gainNode);//链接音量控制节点
                this.gainNode.connect(this.AudioContext.destination);//输出音源

                this.currentAudio.oncanplay = (ev) => { //可以开始播放
                    this.currentAudio.play();//播放
                }

                this.currentAudio.oncanplaythrough = (ev) => { //当前歌曲缓存完毕
                    this.cached();
                }

                this.currentAudio.ondurationchange = (ev) => { //可获得歌曲时长
                    this.allTime = this.currentAudio.duration;
                }

                this.currentAudio.onplay = (ev) => {//开始播放
                    console.log('开始播放')
                    this.gainNode.gain.linearRampToValueAtTime(1.0, this.AudioContext.currentTime + 2); //音量淡入
                    resolve(0);
                }

                this.currentAudio.ontimeupdate = (ev) => {//更新播放位置
                    this.ingTime = this.currentAudio.currentTime;
                    if (this.cachedType !== 1) this.cached();
                }

                this.currentAudio.onpause = (ev) => {//播放暂停
                    console.log('播放暂停')
                }

                this.currentAudio.onended = (ev) => {//播放完毕
                    console.log('播放完毕')
                    this.clear();
                }
            }
        })
    }

    async pause() {
        return new Promise((resolve, reject) => {
            this.gainNode.gain.linearRampToValueAtTime(0, this.AudioContext.currentTime + 2); //音量淡出
            setTimeout(() => {
                this.currentAudio.pause();
                resolve(0);
            }, 2000);
        })
    }

    //设置播放位置
    currentTime(e) {
        if (this.currentAudio) this.currentAudio.currentTime = e;
    }

    //循环播放
    loop(e) {
        if (this.currentAudio) this.currentAudio.loop = e;
    }

    //缓存
    cached() {
        if (this.currentAudio) {
            this.cachedTime = this.currentAudio.buffered.end(this.currentAudio.buffered.length - 1); //已缓存时长
            this.cachedType = this.currentAudio.buffered.end(this.currentAudio.buffered.length - 1) / this.currentAudio.duration; //缓存进度  0-1
        }
    }

    //显示时间为分钟
    showTime(s) {
        return Math.floor(Number(s.toString().split('.')[0]) / 60) + ' : ' + Number(s.toString().split('.')[0]) % 60;
    }
}

module.exports = audio.getInstance();