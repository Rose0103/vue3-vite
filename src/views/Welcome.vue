<script>
export default {
  name: "welcome",
};
</script>

<template>
  <div class="welcome">
    <div class="content">
      <div class="sub-title">欢迎体验</div>
      <div class="title">公司内部员工管理系统</div>
      <div class="desc">-vue3.0+ELementPlus+Node+Mongodb打造的公司内部员工管理系统</div>
    </div>
    <div class="img"></div>
  </div>
</template>

<style scoped lang="scss">
.welcome {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-color: #fff;
  .content {
    position: relative;
    bottom:40px;
    .sub-title {
      font-size: 30px;
      line-height: 42px;
      color: #333;
    }
    .title {
      font-size: 40px;
      line-height: 62px;
      color: #409eff;
    }
    .desc {
      text-align: right;
      font-size: 14px;
      color: #999;
    }
  }
  .img {
    margin-left: 230px;
    background-image: url('./../assets/images/welcome.png') ;
    background-size: 100% 100%;
    width: 690px;
    height: 550px;
  }
}
</style>
