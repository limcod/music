<template>
  <div class="audio-info">
    <div class="audio-info-but">
      <button class="button">◀</button>
      <button class="button"
              @click="AudiosOpt.paused===0?play():pause()">{{AudiosOpt.paused === 0 ? '▶' : '||'}}
      </button>
      <button class="button">▶</button>
    </div>
    <div class="audio-info-progress">
      <div>
        {{isProgress === 1 ? audio.showTime(Number(speedProgress)) : audio.showTime(AudiosOpt.ingTime)}}
      </div>
      <input type="range" class="audio-info-progress-input"
             :max="AudiosOpt.allTime.toFixed(0)"
             min="0"
             step="any"
             @input="speedProgress=$event.target.value"
             @mousedown="isProgress=1"
             @mouseup="AudiosOpt.paused===0?audio.currentIngTime(speedProgress):audio.currentTime(speedProgress);oProgress()"
             :value="isProgress===1?speedProgress:AudiosOpt.ingTime"/>
      <div>{{audio.showTime(AudiosOpt.allTime)}}</div>
    </div>
    <div class="audio-info-volume">
      <input class="audio-info-volume-input" type="range" max="100" min="0" step="1"
             :value="parseInt((AudiosOpt.volume * 100).toString())" @input="audio.setVolume($event.target.value)"/>
      <div>{{parseInt((AudiosOpt.volume * 100).toString())}}</div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref} from "vue";
import {AudiosOpt, audio} from "../../utils/audio";

export default defineComponent({
  name: "Audio",
  setup() {

    const isProgress = ref(0); //是否正在拖动进度
    const speedProgress = ref(0); //拖动进度结果

    async function play() {
      await audio.play();
    }

    async function pause() {
      await audio.pause();
    }

    async function oProgress() {//拖动后延迟0.1秒后显示
      setTimeout(() => {
        isProgress.value = 0;
      }, 100)
    }

    return {
      AudiosOpt,
      audio,
      isProgress,
      speedProgress,
      play,
      pause,
      oProgress
    }
  }
});
</script>

<style lang="scss">
.audio-info {
  position: relative;
  height: 50px;
  width: 100%;
  display: flex;
  align-items: center;
  backdrop-filter: blur(4px);
  background-color: rgba(0,0,0,.5);
  transition: all .5s ease-in-out;
}

.audio-info-but {
  padding: 0 10px;
  width: 20%;
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
}

.audio-info-but button {
  color: var(--white);
  background-color: transparent;
}

/*播放进度条*/
.audio-info-progress {
  position: relative;
  padding: 0 10px;
  width: 60%;
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
}

.audio-info-progress div {
  width: 10%;
  text-align: center;
}

.audio-info-progress-input {
  width: 80%;
  height: 2px;
  padding: 0;
  margin: 0;
  outline: 0;
  cursor: pointer;
  -webkit-appearance: none !important;
}

.audio-info-progress-input::-webkit-slider-thumb {
  width: 6px;
  height: 6px;
  background-color: #FFF;
  cursor: pointer;
  -webkit-appearance: none !important;
}

.audio-info-progress-input::-webkit-slider-thumb:active {
  border: 0;
  background-color: #FFF;
}

/*音量条*/
.audio-info-volume {
  padding: 0 10px;
  position: relative;
  width: 20%;
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
}

.audio-info-volume div {
  width: 20%;
  text-align: center;
}

.audio-info-volume-input {
  width: 80%;
  height: 2px;
  padding: 0;
  margin: 0;
  outline: 0;
  cursor: pointer;
  -webkit-appearance: none !important;
}

.audio-info-volume-input::-webkit-slider-thumb {
  width: 6px;
  height: 6px;
  background-color: #FFF;
  cursor: pointer;
  -webkit-appearance: none !important;
}

.audio-info-volume-input::-webkit-slider-thumb:active {
  border: 0;
  background-color: #FFF;
}
</style>
