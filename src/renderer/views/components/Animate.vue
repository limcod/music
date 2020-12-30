<template>
  <div :ref="dom" class="animate-info"></div>
</template>

<script lang="ts">
import {defineComponent, onMounted, onBeforeUnmount, watch} from "vue";
import {AudiosOpt} from "@/core/audio";
import {animate, animateRefresh, animateStop} from "@/core/animate";

export default defineComponent({
  name: "Animate",
  setup() {
    let el: HTMLElement = null;

    function dom(e: HTMLElement) {
      el = e;
    }

    //监听是否播放
    const wa = watch(() => AudiosOpt["paused"], (n) => {
      switch (n) {
        case 1: //播放
          // animateRefresh();
          break;
        case 0: //暂停
          // animateStop();
          break;
      }
    })

    onMounted(() => {
      animate.init(el);
      animate.box();
      animateRefresh();
    })

    onBeforeUnmount(() => {
      wa();
    })

    return {
      dom
    };
  }
});
</script>

<style lang="scss" scoped>
.animate-info {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>