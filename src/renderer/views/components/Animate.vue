<template>
  <div :ref="dom" class="animate-info">

  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted} from "vue";
import {audio} from "@/core/audio";
import {animate,animateRefresh} from "@/core/animate";

export default defineComponent({
  name: "Animate",
  setup() {
    let el: HTMLElement = null;

    function dom(e: HTMLElement) {
      el = e;
    }

    onMounted(() => {
      animate.init(el);
      animate.box();
      animateRefresh();
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