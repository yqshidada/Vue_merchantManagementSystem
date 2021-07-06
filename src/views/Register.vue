<template>
  <div class="register">
    <el-container class="register-box">
      <el-aside class="aside" width="500px"></el-aside>
      <el-main class="main-box">
        <div class="nav-box">后台管理系统</div>

        <div class="user-box">
          <div class="user-title">欢迎注册</div>
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

              <el-form-item label="确认密码" prop="checkPassword">
                <el-input type="password" v-model="ruleForm.checkPassword" autocomplete="off"></el-input>
              </el-form-item>

              <el-form-item label prop="validCode">
                <div class="validcode-box">
                  <div>
                    <el-input
                      type="text"
                      v-model="ruleForm.validCode"
                      autocomplete="off"
                      :maxlength="6"
                    ></el-input>
                  </div>
                  <div class="send-code">
                    <el-button :disabled="isSend" @click="sendValidCode">{{text}}</el-button>
                  </div>
                </div>
              </el-form-item>

              <el-form-item>
                <el-button class="block-btn" type="primary" @click="submitForm('ruleForm')">注册</el-button>
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
  name: "Register",

  data() {
    return {
      //表单信息
      ruleForm: {
        //密码
        password: "",
        //确认密码
        checkPassword: "",
        //邮箱
        email: "",

        //邮箱验证码
        validCode: "",
      },

      //验证规则
      rules: {
        //验证密码
        password: [{ validator: this.validatePassword, trigger: "blur" }],

        //验证确认密码
        checkPassword: [
          { validator: this.validateCheckPassword, trigger: "blur" },
        ],

        //验证邮箱
        email: [{ validator: this.validateEmail, trigger: "blur" }],

        //验证验证码
        validCode: [{ validator: this.validateValidCode, trigger: "blur" }],
      },

      text: "发送验证码",
      isSend: false,

      //验证码id
      codeId: "",
    };
  },
  methods: {
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

    //检查确认密码
    validateCheckPassword(rule, value, callback) {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
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

    //检查验证码
    validateValidCode(rule, value, callback) {
      if (value === "") {
        callback(new Error("验证码不能为空"));
      } else {
        //邮箱正确
        let reg = /^\d{6}$/;

        if (!reg.test(value)) {
          callback(new Error("输入6位数字验证码"));
        } else {
          //验证通过, 将之前可能出现的错误提示去除
          callback();
        }
      }
    },

    //发送验证码
    sendValidCode() {
      //验证邮箱格式是否正确
      let emailReg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
      if (!emailReg.test(this.ruleForm.email)) {
        this.$message({
          message: "邮箱格式不正确",
          type: "error",
          showClose: true,
        });

        return;
      }

      let time = 120;

      this.text = `${time}s后重新发送`;
      this.isSend = true;

      let timer = setInterval(() => {
        if (time == 0) {
          clearInterval(timer);
          timer = null;
          this.text = "发送验证码";
          this.isSend = false;
        } else {
          time--;
          this.text = `${time}s后重新发送`;
        }
      }, 1000);

      //发起发送验证码请求
      this.axios({
        method: "post",
        url: "/sendValidCode",
        data: {
          email: this.ruleForm.email,
        },
      })
        .then((result) => {
          console.log("result ==> ", result);

          if (result.data.status == 1010) {
            this.codeId = result.data.data.codeId;
            this.$message({
              message: result.data.msg,
              type: "success",
              showClose: true,
            });
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
    },

    //提交表单
    submitForm(formName) {
      
      this.$refs[formName].validate((valid) => {

        if (valid) {

          //判断用户是否发送验证码
          if (this.codeId == "") {
            this.$message({
              message: '请发送验证码',
              type: "error",
              showClose: true,
            });
            return;
          }

          //如果表单验证通过, 发起注册请求
          this.axios({
            method: "post",
            url: "/register",
            data: {
              email: this.ruleForm.email,
              password: this.ruleForm.password,
              validCode: this.ruleForm.validCode,
              codeId: this.codeId,
            },
          })
            .then((result) => {
              console.log('register result ==> ', result);
              if (result.data.status === 1000) {
                this.$message({
                  message: result.data.msg,
                  type: "success",
                  showClose: true,
                });

                //跳转到登录页面
                this.$router.push({name: 'Login'});
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
.register {
  .register-box {
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