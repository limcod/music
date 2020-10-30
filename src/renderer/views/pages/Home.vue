<template>
  <div class="main">
    <Head></Head>
    <div class="info">
      <div :ref="listDom" class="list no-drag">
        <div v-for="(item) in topList"
             class="bg-img cursor-pointer"
             :style="{'background-image': `url('${item?.album?.cover}?param=250y120')`}"
             @click="play(item)">
          {{item.name}} {{item.vendor}}
        </div>
      </div>
      <div class="audio">
        <Audio></Audio>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, reactive, toRefs} from "vue";
import Head from "../components/Head.vue";
import Audio from "../components/Audio.vue";
import {argsState} from "../../store";
import {getSongUrl, getTopList} from "../../utils/music";
import {audio} from "../../utils/audio";

export default defineComponent({
  components: {
    Head,
    Audio
  },
  name: "Home",
  setup() {
    const args = argsState();
    const data = reactive({
      topListData: null,
      topList: [],
      topListIndex: 10
    });

    onMounted(async () => {
      data["topListData"] = await getTopList();
      data["topList"] = data["topListData"].list;
    });

    function listDom(el) {
      el.onscroll = () => {
        if (el.scrollTop + el.clientHeight === el.scrollHeight) {
          console.log("到底了");
        }
      }
    }

    async function play(item) {
      let req = await getSongUrl(item.vendor, item.id);
      await audio.play(req.url);
    }

    return {
      ...toRefs(data),
      listDom,
      play
    }
  }
});
</script>

<style lang="scss">
.info {
  width: 100%;
  height: 100%;
  padding: 25px 10px 60px;
  position: relative;

  .list {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-auto-rows: 120px;
    grid-gap: 10px 10px;
    width: 100%;
    height: 100%;
    overflow: hidden;
    overflow-y: scroll;
  }

  .audio {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
  }

}
</style>
