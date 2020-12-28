<template>
  <div class="menu-info">
    <Animate></Animate>
    <div class="menu-search">
      <input v-model.trim="SongTopData.keyword" @keydown.enter="search" class="no-drag"/>
      <button class="no-drag" @click="search">搜索</button>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {SongTopData} from "@/core";
import {searchSong} from "@/core/music";
import Animate from "./Animate.vue";

export default defineComponent({
  name: "Menu",
  components: {Animate},
  setup() {

    async function search() {
      let req = await searchSong(SongTopData.keyword) as any;
      let list = [];
      if (req && req.status) {
        for (let i in req.data) {
          list.push(...req.data[i].songs);
        }
        SongTopData.topList = list;
      }
    }

    return {
      SongTopData,
      search
    };
  }
});
</script>

<style lang="scss" scoped>
@import "../css/menu";
</style>