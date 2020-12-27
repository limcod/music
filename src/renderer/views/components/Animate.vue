<template>
  <div :ref="dom" class="animate-info">

  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted} from "vue";
import {audio} from "@/core/audio";
import {Animate} from "@/core/animate";

export default defineComponent({
  name: "Animate",
  setup() {
    let el: HTMLElement = null;
    const animate = new Animate();

    function dom(e: HTMLElement) {
      el = e;
    }

    function requestFrame() {
      requestAnimationFrame(requestFrame);
      animate.cube.rotation.x += 0.01;
      animate.cube.rotation.y += 0.01;
      animate.renderer.render(animate.scene, animate.camera);
    }

    onMounted(() => {
      animate.init(el);
      animate.box();
      requestFrame();
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