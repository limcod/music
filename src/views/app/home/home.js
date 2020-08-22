'use strict';
const execSync = require('child_process').execSync;
module.exports = {
    keepAlive: true,
    size: [],
    lib: [
        'views/app/home/home.css'
    ],
    components: [
        'app-local-head'
    ],
    main: {
        data() {
            return {
                args: null
            }
        },
        template: `
          <div class="subclass no-drag">
             <app-local-head v-bind:IComponentName="$options.name" ref="app-local-head"></app-local-head>
             <div class="music-ato">
                <div class="music-ato-but">
                   <button class="button" @click="play">播放</button>
                   <button class="button" @click="pause">暂停</button>
                </div>
                <div class="music-ato-time">
                   {{$parent.audio.showTime($parent.audio.ingTime)}} / {{$parent.audio.showTime($parent.audio.allTime)}}
                </div> 
                <div class="music-progress">
                    <input type="range" class="music-progress-input" :max="$parent.audio.allTime" :min="0" v-on:input.left="progress" :value="$parent.audio.ingTime" />
                </div>
             </div>
          </div>
        `,
        //加载
        async created() {
            this.args = this.$parent.args; //获取传入参数
        },
        //卸载
        beforeDestroy() {
        },
        //开启缓存后 加载
        activated() {
        },
        //开启缓存后 卸载
        deactivated() {
        },
        methods: {
            async play() {
                await this.$parent.audio.play('http://music.163.com/song/media/outer/url?id=504924216.mp3');
            },
            async pause() {
                await this.$parent.audio.pause();
            },
            progress(e) {
                this.$parent.audio.currentTime(e.target.value);
            }
        },
        watch: {
            args(v) {//参数刷新后
            }
        }
    }
};
