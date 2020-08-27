'use strict';
module.exports = {
    lib: [],
    main: {
        props: {
            IComponentName: {
                type: String,
                required: true
            }
        },
        data() {
            return {
                d_settings: null,
                d_exitprompt: null
            }
        },
        template: `<div class="head drag">
        <div></div>
        <div class="no-drag" style="background-color: rgba(26, 26, 26, 0.5);">
        <i @click="settings" class="iconfont iconSettingscontrol no-drag cursor-pointer"></i>
        <i @click="$ipcRenderer.send('mini')" class="iconfont iconMinus no-drag cursor-pointer"></i>
        <i @click="$ipcRenderer.send('closed')" class="iconfont iconCancelcontrol no-drag cursor-pointer"></i>
        </div>
    </div>`,
        created() {
        },
        methods: {
            r(v){
                return `${this.$parent.$options.name}.${this.$options._componentTag}.${v}`;
            },
            async settings() {
                this.$parent.$parent.dialogInit(
                    {
                        dialogName: '设置',
                        uniQueKey: 'dialog-subject-settings',
                        returnPath: this.r('d_settings')
                    }
                );
            }
        },
        watch: {
            d_settings(v) {
                console.log(v.test);
            }
        }
    }
};
