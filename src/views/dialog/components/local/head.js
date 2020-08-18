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
            return {}
        },
        template: `<div class="head drag">
        局部组件
    </div>`,
        created() {
            console.log(this.$parent.$options.name,this.$options.name)
        },
        methods: {},
        watch: {}
    }
};
