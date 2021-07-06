<template>
  <div class="aside-menu">
    <el-menu
      default-active="home"
      :router="true"
      :collapse="isCollapse"
    >

      <el-menu-item index="home">
        <i class="el-icon-s-home"></i>
        <span slot="title">首页</span>
      </el-menu-item>

      <el-submenu index="typeList">
        <template slot="title">
          <i class="el-icon-menu"></i>
          <span slot="title">商品管理</span>
        </template>
        <el-menu-item index="typeList" class="el-options">类型列表</el-menu-item>
        <el-menu-item index="productList" class="el-options">商品列表</el-menu-item>
      </el-submenu>

      <el-submenu index="2">
        <template slot="title">
          <i class="el-icon-s-order"></i>
          <span slot="title">订单管理</span>
        </template>
        <el-menu-item index="2-1" class="el-options">订单列表</el-menu-item>
      </el-submenu>

      <el-submenu index="3">
        <template slot="title">
          <i class="el-icon-s-data"></i>
          <span slot="title">数据统计</span>
        </template>
        <el-menu-item index="3-1" class="el-options">商品销售</el-menu-item>
      </el-submenu>

      <el-menu-item index="4">
        <i class="el-icon-s-custom"></i>
        <span slot="title">用户设置</span>
      </el-menu-item>

    </el-menu>
  </div>
</template>

<script>
export default {
  name: "AsideMenu",
  data() {
    return {
      isCollapse: false,
    };
  },
  methods: {
    
  },
};
</script>

<style lang="less" scoped>
  .aside-menu{
    /deep/ .el-submenu__title{
      padding: 0 0 0 15px !important;
    }

    /deep/ .el-menu-item{
      padding: 0 15px !important;
    }

    /deep/ .el-submenu .el-menu-item{
       padding: 0 15px 0 44px !important;
       min-width: 159px;
    }

    /deep/ .el-menu{
      border-right: none;
    }

  }
</style>