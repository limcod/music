<style lang="scss" scoped>
.container {
  display: flex;
  width: 100vw;
  height: 100vh;

  > .left {
    width: 60%;
    min-width: 421px;
    background-color: red;
    background: url('https://img.shuaxinjs.cn/apple.jpg') no-repeat;
  }

  > .right {
    width: 40%;
    min-width: 379px;
    // background-color: blue;
    align-self: center;

    > .main {
      width: 260px;
      margin: 0 auto;
      text-align: right;

      > img {
        width: 20%;
      }

      > .title {
        margin-top: 17px;
        width: 260px;
        height: 41px;
        font-size: 40px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        // color: #dd4e7c;
        line-height: 41px;
      }
    }
  }
}
</style>
<template>
  <div class="container">
    <div class="left"></div>
    <div class="right">
      <div class="main">
        <img src="https://img.shuaxinjs.cn/favicon-16x16-next.png" alt="logo"/>
        <div class="title">欢迎来到Ting</div>
        <Button @click="handleJumpHome" text="开始"/>
      </div>
    </div>
  </div>
</template>
<script>
import router from '@/renderer/router'
import Button from '../components/Button.vue'

export default {
  name: 'Welcome',
  components: {
    Button,
  },
  setup() {
    const handleJumpHome = () => {
      router.push({path: '/home'})
    }
    return {
      handleJumpHome,
    }
  },
}
</script>