<template>
  <div class="main">
    <Head></Head>
    <div class="info">
      <div class="left">
        <Menu></Menu>
      </div>
      <div class="right">
        <Sheet></Sheet>
        <Audio></Audio>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {argsState} from "../../store";
import Head from "../components/Head.vue";
import Audio from "../components/Audio.vue";
import Menu from "../components/Menu.vue";
import Sheet from "@/renderer/views/components/Sheet.vue";

export default defineComponent({
  components: {
    Sheet,
    Menu,
    Head,
    Audio
  },
  name: "Home",
  setup() {
    const args = argsState();
    return {}
  }
});
</script>

<style lang="scss" scoped>
@import "../scss/home";
</style>
