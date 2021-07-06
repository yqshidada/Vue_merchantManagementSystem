<template>
  <div class="nav-box">
    <div class="manage-logo">商家后台</div>
    <div class="user">
      <div class="user-img">
        <img class="auto-img" :src="userInfo.avatar" alt="">
      </div>
      <div>
        <el-dropdown>
          <span class="el-dropdown-link">
            {{userInfo.nickName}}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item icon="el-icon-key">修改密码</el-dropdown-item>
            <el-dropdown-item icon="el-icon-switch-button">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'NavBox',
    data() {
      return {
        //用户信息
        userInfo: {
          nickName: '',
          avatar: ''
        }
      };
    },

    created() {
      this.getUserInfo();
    },

    methods: {

      //获取用户信息
      getUserInfo() {

        this.axios({
            method: "get",
            url: "/userInfo",
            headers: {
              token: document.cookie
            }
          })
            .then((result) => {
              console.log("getUserInfo result ==> ", result);

              if (result.data.status == 1041) {
                return this.$router.push({ name: "Login" });
              }

              if (result.data.status == 1120) {
                let data = result.data.data[0];

                this.userInfo.nickName = data.nickName;
                this.userInfo.avatar = `${result.data.staticUrl}${data.avatar}`;

              } else {
                this.$message({
                  message: result.data.msg,
                  type: "error",
                  showClose: true,
                });
              }
            })
            .catch((err) => {
              console.log("err ==> ", err);
            });

      }
    }
  }
</script>

<style lang="less" scoped>
  .nav-box{
    height: 60px;
    background-color: #fff;
    padding: 0 15px;
    display: flex;
    position: sticky;
    top: 0;
    z-index: 10;
  }

  .manage-logo{
    width: 145px;
    height: 100%;
    padding-right: 15px;
    margin-right: auto;
    text-align: center;
    line-height: 60px;
    font-weight: bold;
    font-size: 18px;
  }

  .user{
    display: flex;
    align-items: center;
  }

  .user-img{
    width: 40px;
    height: 40px;
    background-color: #ddd;
    margin-right: 15px;
  }

  .el-dropdown-link{
    cursor: pointer;
  }

  .auto-img{
    width: 100%;
    display: block;
  }
</style>