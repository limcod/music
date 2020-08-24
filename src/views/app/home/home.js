'use strict';
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
                args: null,
                isMcSource: false,
                data: null
            }
        },
        template: `
          <div class="subclass no-drag">
             <app-local-head v-bind:IComponentName="$options.name" ref="app-local-head"></app-local-head>
             <div class="home-info">
                 <div v-if="data" class="home-test">
                    <div 
                      v-for="(item, index) in data.playlists" 
                      class="home-test-item bg-img"
                      :style="{'background-image': 'url('+item.coverImgUrl+')'}">
                       <div class="home-test-item-tit">{{item.copywriter}}</div>
                    </div>
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
        },
        watch: {
            args(v) {//参数刷新后
            }
        }
    }
};
