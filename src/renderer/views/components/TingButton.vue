<style lang="scss" scoped>
button {
  width: 120px;
  height: 32px;
  margin-top: 35px;
  background-color: #000;
  outline: none;
  color: #ffffff;
  font-size: 17px;
}
</style>
<template>
  <button>{{ text }}</button>
</template>
<script>
export default {
  name: 'TingButton',
  props: {
    text: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    return {
      text: props.text,
    }
  },
}
</script>