<template>
  <div class="login">
    <el-container class="login-box">
      <el-aside class="aside" width="500px"></el-aside>
      <el-main class="main-box">
        <div class="nav-box">后台管理系统</div>

        <div class="user-box">
          <div class="user-title">欢迎登录</div>
          <div class="form-box">
            <el-form
              :model="ruleForm"
              status-icon
              :rules="rules"
              ref="ruleForm"
              label-width="80px"
              class="demo-ruleForm"
            >
              <!-- prop需要关联rules验证器 -->
              <el-form-item label="邮箱" prop="email">
                <el-input type="text" v-model="ruleForm.email" autocomplete="off"></el-input>
              </el-form-item>

              <el-form-item label="密码" prop="password">
                <el-input type="password" v-model="ruleForm.password" autocomplete="off"></el-input>
              </el-form-item>

              <el-form-item>
                <!-- 防机器登录 -->
                <div>
                  <slide-verify
                    :l="42"
                    :r="10"
                    :w="320"
                    :h="155"
                    slider-text="向右滑动"
                    @success="onSuccess"
                    @refresh="onRefresh"
                  ></slide-verify>
                </div>
              </el-form-item>

              <el-form-item>
                <el-button class="block-btn" type="primary" @click="submitForm('ruleForm')">登录</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "Login",

  data() {
    return {
      //表单信息
      ruleForm: {
        //密码
        password: "",

        //邮箱
        email: "",
      },

      //验证规则
      rules: {
        //验证密码
        password: [{ validator: this.validatePassword, trigger: "blur" }],

        //验证邮箱
        email: [{ validator: this.validateEmail, trigger: "blur" }],
      },

      isSlide: false

    };
  },
  methods: {
    //滑动验证成功
    onSuccess() {
      this.msg = "滑动验证成功";
      this.isSlide = true;
    },

    //刷新
    onRefresh() {
      this.isSlide = false;
    },

    //检查密码password
    validatePassword(rule, value, callback) {
      if (value === "") {
        callback(new Error("密码不能为空"));
      } else {
        //密码支持字母数字下划线且首字符必须为字母(6-16位)
        let reg = /^[A-Za-z]\w{5,15}$/;

        if (!reg.test(value)) {
          callback(
            new Error("密码支持字母数字下划线且首字符必须为字母(6-16位)")
          );
        } else {
          //验证通过, 将之前可能出现的错误提示去除
          callback();
        }
      }
    },

    //检查邮箱
    validateEmail(rule, value, callback) {
      if (value === "") {
        callback(new Error("邮箱不能为空"));
      } else {
        //邮箱正确
        let reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;

        if (!reg.test(value)) {
          callback(new Error("邮箱格式不正确"));
        } else {
          //验证通过, 将之前可能出现的错误提示去除
          callback();
        }
      }
    },

    //提交表单
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log("this.isSlide ==> ", this.isSlide);

          if (!this.isSlide) {
            return;
          }

          //如果表单验证通过, 发起登录请求
          this.axios({
            method: "post",
            url: "/login",
            data: {
              email: this.ruleForm.email,
              password: this.ruleForm.password,
            },
          })
            .then((result) => {
              // console.log("login result ==> ", result);

              if (result.data.status == 1030) {
                //保存cookies信息
                for(let key in result.data.data) {
                  this.$cookies.set(key, result.data.data[key], '1d');
                }

                this.$message({
                  message: result.data.msg,
                  type: "success",
                  showClose: true,
                });

                this.$router.push({name: 'Home'});

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
      });
    },
  },
};
</script>

<style lang="less" scoped>
.login {
  .login-box {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
  }

  .aside {
    background-color: #fff;
  }

  .nav-box {
    height: 60px;
    background-color: #fff;
    color: #666;
    font-size: 18px;
    line-height: 60px;
    padding: 0 15px;
  }
  .main-box {
    padding: 0;
    position: relative;
  }

  .user-box {
    width: 400px;
    background-color: #fff;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    padding: 15px;
  }

  .user-title {
    height: 50px;
    line-height: 50px;
    font-size: 18px;
    text-align: center;
    color: #666;
  }

  .form-box {
    margin-top: 15px;
  }

  .validcode-box {
    display: flex;
  }

  .send-code {
    margin-left: 15px;
  }

  .block-btn {
    display: block;
    width: 100%;
  }
}
</style>