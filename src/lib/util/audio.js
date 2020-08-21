'use strict';

class audio {
    static getInstance() {
        if (!audio.instance) audio.instance = new audio();
        return audio.instance;
    }

    constructor() {
        console.log('init');
        this.AudioContext = new AudioContext(); //初始化音频api
        this.currentAudio = null; //当前播放音源
        this.sourceAudio = null; //音频的源
        this.gainNode = null; //初始化音量控制节点

    }

    clear() {
        this.currentAudio = null; //当前播放音源
        this.sourceAudio = null; //音频的源
        this.gainNode = null; //初始化音量控制节点

        // this.currentAudio.currentTime =11  //设置播放位置
    }

    play(url) {
        if (this.currentAudio) {
            this.currentAudio.play();//播放
            return;
        }
        if (url) {
            this.currentAudio = new Audio(url);
            this.currentAudio.crossOrigin = "anonymous";
            this.sourceAudio = this.AudioContext.createMediaElementSource(this.currentAudio);
            this.gainNode = this.AudioContext.createGain();

            this.sourceAudio.connect(this.gainNode);//链接音量控制节点
            this.gainNode.connect(this.AudioContext.destination);//输出音源

            this.currentAudio.oncanplay = (ev) => { //可以开始播放
                console.log('oncanplay')
                console.log(this.currentAudio.buffered.end(this.currentAudio.buffered.length - 1))//已缓存的时间
                console.log(this.currentAudio.buffered.end(this.currentAudio.buffered.length - 1)/this.currentAudio.duration)//当前缓存进度
                this.currentAudio.play();//播放
            }

            this.currentAudio.oncanplaythrough = (ev) => { //当前歌曲缓存完毕
                console.log('oncanplaythrough')
                console.log(this.currentAudio.buffered.end(this.currentAudio.buffered.length - 1)/this.currentAudio.duration)//当前缓存进度
            }

            this.currentAudio.ondurationchange = (ev) => { //可获得歌曲时长
                console.log('ondurationchange')
                console.log(this.currentAudio.duration)
            }

            this.currentAudio.onplay = (ev) => {//开始播放
                console.log('onplay')
                this.gainNode.gain.linearRampToValueAtTime(1.0, this.AudioContext.currentTime + 2); //音量淡入
            }

            this.currentAudio.ontimeupdate = (ev) => {//更新播放位置
                console.log('ontimeupdate')
                console.log(this.currentAudio.currentTime)
                console.log(this.currentAudio.buffered.end(this.currentAudio.buffered.length - 1)/this.currentAudio.duration) //缓存进度
            }

            this.currentAudio.onpause = (ev) => {//播放暂停
                console.log('onpause')
            }

            this.currentAudio.onended = (ev) => {//播放完毕
                console.log('onended', ev)
                this.clear();
            }
        }
    }

    pause() {
        this.gainNode.gain.linearRampToValueAtTime(0, this.AudioContext.currentTime + 2); //音量淡出
        setTimeout(() => {
            this.currentAudio.pause();
        }, 2000);
    }
}

module.exports = audio.getInstance();