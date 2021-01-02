<template>
  <div class="main">
    <Head></Head>
    <div class="info">
      <Menu></Menu>
      <div class="right">
        <div class="list no-drag">
          <div v-for="item in topList"
               class="item bg-img cursor-pointer"
               :style="{'background-image': `url('${item?.album?.cover.replace('httpss','https')}${item.vendor==='netease'?'?param=250y120':''}')`}"
               @click="play(item)">
            <div class="title">{{ item.name }}</div>
          </div>
          <div style="grid-column: span 3;height: 50px;"></div>
        </div>
        <Audio></Audio>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, toRefs} from "vue";
import Head from "../components/Head.vue";
import Audio from "../components/Audio.vue";
import Menu from "../components/Menu.vue";
import {argsState} from "../../store";
import {getSongUrl, getTopList} from "@/core/music";
import {SongTopData} from "@/core";
import {audio} from "@/core/audio";

export default defineComponent({
  components: {
    Menu,
    Head,
    Audio
  },
  name: "Home",
  setup() {
    const args = argsState();
    let topListData = null;

    onMounted(async () => {
      topListData = await getTopList("1");
      console.log(topListData)
      SongTopData.topList = topListData.list;
    });

    async function play(item: any) {
      let req = await getSongUrl(item.vendor, item.id);
      if(req)await audio.play({path: req.url, name: item.name});
    }

    return {
      ...toRefs(SongTopData),
      play
    }
  }
});
</script>

<style lang="scss" scoped>
@import "../css/home";
</style>
