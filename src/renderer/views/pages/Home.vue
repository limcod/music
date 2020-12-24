<template>
  <div class="main">
    <Head></Head>
    <div class="info">
      <div class="list-search">
        <input v-model="name" class="no-drag"/>
        <button class="no-drag" @click="search">搜索</button>
      </div>
      <div class="list no-drag">
        <div v-for="(item) in topList"
             class="item bg-img cursor-pointer"
             :class="{'act':`${item.vendor}|${item.id}`===AudiosOpt.key}"
             :style="{'background-image': `url('${item?.album?.cover.replace('httpss','https')}${item.vendor==='netease'?'?param=250y120':''}')`}"
             @click="play(item)">
          {{ item.name }} {{ item.vendor }}
        </div>
      </div>
      <div class="audio bg-img">
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
import {getSongUrl, getTopList, searchSong} from "@/lib/music";
import {AudiosOpt, audio} from "@/lib/audio";

export default defineComponent({
  components: {
    Head,
    Audio
  },
  name: "Home",
  setup() {
    const args = argsState();
    const data = reactive({
      name: "",
      topList: [],
      topListIndex: 10
    });
    let topListData = null;

    onMounted(async () => {
      topListData = await getTopList("1");
      console.log(topListData)
      data.topList = topListData.list;
    });

    async function play(item: any) {
      console.log(item.vendor, item.id)
      let req = await getSongUrl(item.vendor, item.id);
      await audio.play(`${item.vendor}|${item.id}`, item, req.url);
    }

    async function search() {
      let req = await searchSong(data.name) as any;
      let list = [];
      if (req.status) {
        for (let i in req.data) {
          list.push(...req.data[i].songs);
        }
        data.topList = list;
      }
    }

    return {
      AudiosOpt,
      ...toRefs(data),
      play,
      search
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

  .list-search {
    height: 50px;
  }

  .list {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-auto-rows: 120px;
    grid-gap: 10px 10px;
    width: 100%;
    height: calc(100% - 50px);
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
