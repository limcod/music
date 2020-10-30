<template>
  <div class="main">
    <Head></Head>
    <div class="info">
      <div class="list no-drag">
        <div v-for="(item) in topList"
             class="item bg-img cursor-pointer"
             :class="{'act':`${item.vendor}|${item.id}`===AudiosOpt.key}"
             :style="{'background-image': `url('${item?.album?.cover}?param=250y120')`}"
             @click="play(item)">
          {{item.name}} {{item.vendor}}
        </div>
      </div>
      <div class="audio bg-img"
           :style="AudiosOpt.musicInfo?{'background-image': `url('${AudiosOpt.musicInfo?.album?.cover}?param=790y50')`}:{}">
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
import {getSongUrl, getTopList, searchSong} from "../../utils/music";
import {AudiosOpt, audio} from "../../utils/audio";

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

    async function play(item: any) {
      let req = await getSongUrl(item.vendor, item.id);
      console.log(req)
      await audio.play(`${item.vendor}|${item.id}`, item, req.url);
    }

    return {
      AudiosOpt,
      ...toRefs(data),
      play
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

  .list {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-auto-rows: 120px;
    grid-gap: 10px 10px;
    width: 100%;
    height: 100%;
    overflow: hidden;
    overflow-y: scroll;

    .item.act {
      color: red;
    }

  }

  .audio {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
  }

}
</style>
