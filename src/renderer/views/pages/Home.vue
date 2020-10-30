<template>
  <div class="main">
    <Head></Head>
    <div class="info">

      <div class="audio">
        <Audio></Audio>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, onUnmounted, watch} from "vue";
import {createWindow} from "../../utils/ipc";
import {useRouter} from "vue-router";
import Head from "../components/Head.vue";
import Audio from "../components/Audio.vue";
import {argsState, messageData} from "../../store";

export default defineComponent({
  components: {
    Head,
    Audio
  },
  name: "Home",
  setup() {
    const args = argsState();
    const router = useRouter();

    let watchTest = watch(() => messageData["test"], (n, o) => { // o 为新赋值 n为旧值
      console.log(n, o)
    });
    const test = () => {
      createWindow({
        route: "/message",
        parentId: args.id,
        data: {text: "key不能为空"},
      });
    }
    const toAbout = () => {
      router.replace("/about");
    }
    onUnmounted(() => {
      watchTest()
    })
    return {
      test,
      toAbout
    }
  }
});
</script>

<style lang="scss">
.info {
  width: 100%;
  height: 100%;
  padding: 25px 10px 10px;
  position: relative;

  .audio{
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
  }

}
</style>
