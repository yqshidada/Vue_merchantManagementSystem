<template>
  <div class="back">
    <div class="back-text" @click="back">
      <i class="el-icon-arrow-left"></i> {{text}}
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      text: {
        type: String,
        default: '返回'
      }
    },
    name: 'Back',
    methods: {
      back() {
        this.$router.go(-1);
      }
    }
  }
</script>

<style lang="less" scoped>
  .back{
    height: 30px;
    padding: 15px;
    background-color: #fff;
    display: flex;
    align-items: center;
    .back-text{
      cursor: pointer;
      &:hover{
        color: #409eff;
      }
    }
  }
</style>