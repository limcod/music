<template>
  <div class="list no-drag">
    <div v-for="item in topList"
         class="item bg-img cursor-pointer"
         :style="{'background-image': `url('${item?.album?.cover.replace('httpss','https')}${item.vendor==='netease'?'?param=250y120':''}')`}"
         @click="play(item)">
      <div class="title">{{ item.name }}</div>
    </div>
    <div style="grid-column: span 3;height: 1px;"></div>
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, toRefs} from "vue";
import {argsState} from "../../store";
import {getSongUrl, getTopList} from "@/core/music";
import {SongTopData} from "@/core";
import {audio} from "@/core/audio";

export default defineComponent({
  name: "Sheet",
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
      if (req) await audio.play({
        vendor: item.vendor,
        path: req.url,
        name: item.name,
        cover: item.album.cover,
        singer: item.artists.map((e: any) => e.name).toString()
      });
    }

    return {
      ...toRefs(SongTopData),
      play
    }
  }
});
</script>

<style lang="scss" scoped>
.list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: 120px;
  grid-gap: 10px 10px;
  width: 100%;
  height: calc(100% - 50px);
  padding: 0 10px;
  overflow: hidden;
  overflow-y: overlay;
  background-color: var(--white);

  > .item {
    position: relative;

    > .title {
      position: absolute;
      right: 0;
      bottom: 0;
      padding: 5px 10px;
      background-color: rgba(0, 0, 0, .65);
      color: var(--white);
      font: normal 14px normal;
      letter-spacing: 1px;
    }
  }

}
</style>
