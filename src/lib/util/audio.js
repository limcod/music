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

    close() {
        this.currentAudio = null; //当前播放音源
        this.sourceAudio = null; //音频的源
        this.gainNode = null; //初始化音量控制节点
    }

    play(url) {
        if (this.currentAudio) {
            this.currentAudio.play();//播放
            return ;
        }
        if (url) {
            this.currentAudio = new Audio(url);
            this.sourceAudio = this.AudioContext.createMediaElementSource(this.currentAudio);
            this.gainNode = this.AudioContext.createGain();

            this.sourceAudio.connect(this.gainNode);//链接音量控制节点
            this.gainNode.connect(this.AudioContext.destination);//输出音源

            this.currentAudio.play();//播放

            this.currentAudio.onplay = (ev) => {//开始播放
                console.log('onplay', ev)
                this.gainNode.gain.linearRampToValueAtTime(1.0, this.AudioContext.currentTime + 2); //音量淡入
            }

            this.currentAudio.onpause = (ev) => {//播放暂停
                console.log('onpause', ev)
            }

            this.currentAudio.onended = (ev) => {//播放完毕
                console.log('onended', ev)
                this.close();
            }
        }
    }

    pause() {
        this.gainNode.gain.linearRampToValueAtTime(0, this.AudioContext.currentTime + 2); //音量淡出
        setTimeout(() => {
            this.currentAudio.pause();
        }, 2000);
    }

    clear
}

module.exports = audio.getInstance();