import {reactive} from "vue";
import {songData} from "./sheet";

export const AudiosOpt = reactive({
    paused: 0, //音频是否暂停  0暂停 1未暂停
    volume: 1, //音量
    volumeGradualTime: 0.7,//音量渐进时间(秒)
    cachedType: 0, //缓存进度 0-1  1为完成
    cachedTime: 0, //已缓存时长
    ingTime: 0, //当前播放时长
    allTime: 0, //当前歌曲总时长
    key: "", //当前播放的歌曲
    musicInfo: null, //当前播放的歌曲信息
});

class Audios {
    public static instance: Audios;
    private AudioContext: AudioContext = new AudioContext(); //音频api
    private currentAudio: HTMLAudioElement = new Audio(); //当前播放音源
    private sourceAudio: MediaElementAudioSourceNode = null; //音频的源
    private gainNode: GainNode = null; //控制节点

    static getInstance() {
        if (!Audios.instance) Audios.instance = new Audios();
        return Audios.instance;
    }

    constructor() {
        this.currentAudio.crossOrigin = "anonymous"; //音源跨域
        this.gainNode = this.AudioContext.createGain(); //创建控制节点
        this.sourceAudio = this.AudioContext.createMediaElementSource(this.currentAudio); //挂在音乐源
        this.sourceAudio.connect(this.gainNode);//链接音量控制节点
        this.gainNode.connect(this.AudioContext.destination);//链接音乐通道
    }

    clear() {
        AudiosOpt.paused = 0;
        AudiosOpt.cachedType = 0;
        AudiosOpt.cachedTime = 0;
        AudiosOpt.ingTime = 0;
        AudiosOpt.allTime = 0;
        AudiosOpt.key = "";
        AudiosOpt.musicInfo = null;
    }

    async play(key?: string, item?: any, path?: string) {
        return new Promise(async (resolve, reject) => {
            if (!path && this.currentAudio) {
                if (AudiosOpt.paused === 0) await this.currentAudio.play();//播放
                resolve(0);
                return;
            }
            if (path) {
                if (key === AudiosOpt.key) {
                    if (AudiosOpt.paused === 0) await this.currentAudio.play();//播放
                    resolve(0);
                    return;
                }
                this.currentAudio.src = path;
                this.currentAudio.load();
                this.currentAudio.oncanplay = (ev) => { //可以开始播放
                    this.currentAudio.play();//播放
                    AudiosOpt.key = key;
                    AudiosOpt.musicInfo = item;
                }

                this.currentAudio.oncanplaythrough = (ev) => { //当前歌曲缓存完毕
                    this.cached();
                }

                this.currentAudio.ondurationchange = (ev) => { //可获得歌曲时长
                    AudiosOpt.allTime = this.currentAudio.duration;
                }

                this.currentAudio.onplay = (ev) => {//开始播放
                    console.log('开始播放');
                    this.gainNode.gain.value = 0;//设置音量为0
                    this.currentTime(AudiosOpt.ingTime);//设置当前播放位置
                    this.gainNode.gain.linearRampToValueAtTime(AudiosOpt.volume, this.AudioContext.currentTime + AudiosOpt.volumeGradualTime); //音量淡入
                    AudiosOpt.paused = 1;
                    resolve(0);
                }

                this.currentAudio.ontimeupdate = (ev) => {//更新播放位置
                    AudiosOpt.ingTime = this.currentAudio.currentTime;
                    if (AudiosOpt.cachedType !== 1) this.cached();
                }

                this.currentAudio.onpause = (ev) => {//播放暂停
                    console.log('播放暂停')
                    AudiosOpt.paused = 0;
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
            this.gainNode.gain.linearRampToValueAtTime(0, this.AudioContext.currentTime + AudiosOpt.volumeGradualTime); //音量淡出
            setTimeout(() => {
                this.currentAudio.pause();
                resolve(0);
            }, AudiosOpt.volumeGradualTime * 1000);
        })
    }

    //设置播放位置(暂停情况下)
    currentIngTime(e: number) {
        if (this.currentAudio) AudiosOpt.ingTime = e;
    }

    //设置播放位置(播放情况下)
    currentTime(e: number) {
        if (this.currentAudio) {
            this.gainNode.gain.value = 0;//设置音量为0
            this.currentAudio.currentTime = e;
            this.gainNode.gain.linearRampToValueAtTime(AudiosOpt.volume, this.AudioContext.currentTime + AudiosOpt.volumeGradualTime); //音量淡入
        }
    }

    //设置音量 1-100
    setVolume(e: number) {
        let s = (e / 100).toFixed(2);
        if (this.currentAudio && this.gainNode) this.gainNode.gain.value = AudiosOpt.volume = Number(s);
        else AudiosOpt.volume = Number(s);
    }

    //是否单曲循环
    loop(e: boolean) {
        if (this.currentAudio) this.currentAudio.loop = e;
    }

    //缓存
    cached() {
        if (this.currentAudio && this.currentAudio.buffered.length > 0) {
            AudiosOpt.cachedTime = this.currentAudio.buffered.end(this.currentAudio.buffered.length - 1); //已缓存时长
            AudiosOpt.cachedType = this.currentAudio.buffered.end(this.currentAudio.buffered.length - 1) / this.currentAudio.duration; //缓存进度  0-1
        }
    }

    //显示时间为分钟
    showTime(s: number) {
        let t: string = Number(s).toFixed(0);
        return Math.floor(Number(t) / 60) + ' : ' + Number(t) % 60;
    }
}

export const audio = Audios.getInstance();
