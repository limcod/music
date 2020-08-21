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
             <h4>首页</h4>
             <button @click="play" class="button">播放</button>
             <button @click="pause" class="button">暂停</button>
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
            play() {
                this.$audio.play('http://www.jq22.com/demo/jqueryydbfq202001012203/1.mp3');
            },
            pause(){
                this.$audio.pause();
            }
        },
        watch: {
            args(v) {//参数刷新后
            }
        }
    }
};
