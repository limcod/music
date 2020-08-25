'use strict';
module.exports = {
    lib: [
        'views/app/components/global/audio/audio.css'
    ],
    main: {
        props: {
            IComponentName: {
                type: String,
                required: true
            }
        },
        data() {
            return {
                isProgress: 0, //是否正在拖动进度
                speedProgress: 0,//拖动进度结果
            }
        },
        template: `<div class="audio-info">
                <div class="audio-info-but">
                   <button class="button">◀</button>
                   <button class="button" 
                   @click="$parent.audio.paused===0?play():pause()">{{$parent.audio.paused===0?'▶':'||'}}</button>
                   <button class="button">▶</button>
                </div>
                <div class="audio-info-progress">
                    <div>{{isProgress===1?$parent.audio.showTime(speedProgress):$parent.audio.showTime($parent.audio.ingTime)}}</div>
                    <input type="range" class="audio-info-progress-input" 
                    :max="$parent.audio.allTime.toFixed(0)" 
                    min="0" 
                    step="any"
                    @input="speedProgress=$event.target.value"
                    @mousedown="isProgress=1"
                    @mouseup="$parent.audio.paused===0?$parent.audio.currentIngTime(speedProgress):$parent.audio.currentTime(speedProgress);oProgress()"
                    :value="isProgress===1?speedProgress:$parent.audio.ingTime"/>
                    <div>{{$parent.audio.showTime($parent.audio.allTime)}}</div>
                </div>
                <div class="audio-info-volume">
                    <input class="audio-info-volume-input" type="range" max="100" min="0" step="1" :value="parseInt($parent.audio.volume * 100)" @input="$parent.audio.setVolume($event.target.value)"/>
                    <div>{{parseInt($parent.audio.volume * 100)}}</div>
                </div>
        </div>`,
        created() {
        },
        beforeDestroy() {
        },
        methods: {
            async play() {
                await this.$parent.audio.play('file:///C:\\Users\\i\\Desktop\\423f_ef9a_886e_e8a0fc4dc3a397b92900492be527e101.mp3');
            },
            async pause() {
                await this.$parent.audio.pause();
            },
            async oProgress() {//拖动后延迟0.1秒后显示
                setTimeout(() => {
                    this.isProgress = 0;
                }, 100)
            }
        }
    }
};