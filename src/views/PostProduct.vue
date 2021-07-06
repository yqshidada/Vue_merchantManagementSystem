<template>
  <div class="post-product">
    <Back />
    <div class="form-box">
      <el-row>
        <el-col :span="10">
          <el-form
            :model="productData"
            :rules="rules"
            ref="productData"
            label-width="100px"
          >
            <el-form-item label="商品名称" prop="name">
              <el-input
                v-model="productData.name"
                placeholder="输入商品名称"
              ></el-input>
            </el-form-item>

            <el-form-item label="英文名称" prop="enname">
              <el-input
                v-model="productData.enname"
                placeholder="输入英文名称"
              ></el-input>
            </el-form-item>

            <el-form-item label="商品价格" prop="price">
              <el-input
                v-model="productData.price"
                placeholder="输入商品价格"
              ></el-input>
            </el-form-item>

             <el-form-item label="商品类型" prop="typeId">
              <el-select v-model="productData.typeId" placeholder="选择商品类型">
                <el-option :label="item.name" :value="item.typeId" v-for="item in typeData" :key="item.typeId"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="商品图片" prop="img">
              <Upload :img-url="imgUrl" @uploadFile="uploadImg($event, 'img', 'imgType')" />
            </el-form-item>

            <el-form-item label="详情图片" prop="detailImg">
              <Upload :img-url="detailImgUrl" @uploadFile="uploadImg($event, 'detailImg', 'detailImgType')" />
            </el-form-item>

            <el-form-item label="状态" prop="status">
              <el-radio-group v-model="productData.status">
                <el-radio label="0">正常</el-radio>
                <el-radio label="1">冻结</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="商品描述" prop="desc">
              <el-input type="textarea" v-model="productData.desc" placeholder="输入商品描述"></el-input>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="submitForm('productData')">{{
                proId ? "保存" : "立即发布"
              }}</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import Back from "../components/Back.vue";
import Upload from "../components/Upload.vue";
export default {
  name: "PostProduct",
  components: {
    Back,
    Upload
  },
  data() {
    return {
      productData: {
        name: "",
        enname: "",
        price: "",
        typeId: "",
        img: "",
        imgType: "",
        detailImg: "",
        detailImgType: "",
        status: "",
        desc: ""
      },
      rules: {
        name: [{ required: true, validator: this.validName, trigger: "blur" }],
        enname: [{ required: true, validator: this.validEnname, trigger: "blur" }],
        price: [{ required: true, validator: this.validPrice, trigger: "blur" }],
        typeId: [{ required: true, message: '选择商品类型', trigger: "change" }],
        img: [{ required: true, message: '选择上传商品图片', trigger: "change" }],
        detailImg: [{ required: true, message: '选择上传详情图片', trigger: "change" }],
        status: [{ required: true, message: "选择状态", trigger: "change" }],
        desc: [{ required: true, validator: this.validDesc, trigger: "blur" }],
      },

      //商品id
      proId: "",

      //复制productData数据, 便于在保存类型数据时, 对比productData数据的变化
      copyProductData: {},

      //商品类型
      typeData: [],

      imgUrl: '',
      detailImgUrl: ''

    };
  },

  created() {

    //截取proId
    let proId = this.$route.query.proId;
    if (proId) {
      this.proId = proId;
      //根据proId查询商品数据
      this.getProductByProId();
    }

    this.getTypeData();
  },

  methods: {

    //检测商品名称
    validName(rule, value, callback) {
      if (!value) {
        return callback(new Error("输入商品名称"));
      }
      let reg = /^[\w\u4e00-\u9fa5]{1,30}$/;
      if (!reg.test(value)) {
        callback(new Error("商品名称只支持汉字字母数字_(1-30位)"));
      } else {
        callback();
      }
    },

    //检测英文名称
    validEnname(rule, value, callback) {
      if (!value) {
        return callback(new Error("输入英文名称"));
      }
      let reg = /^[A-Za-z ]{1,30}$/;
      if (!reg.test(value)) {
        callback(new Error("英文名称只支持字母空格(1-30位)"));
      } else {
        callback();
      }
    },

    //检测价格
    validPrice(rule, value, callback) {
      if (!value) {
        return callback(new Error("输入商品价格"));
      }
      let reg = /^(([1-9]\d*)|0)(\.[0-9]{1,2})?$/;
      if (!reg.test(value)) {
        callback(new Error("商品价格只能填写数字(可包含小数)"));
      } else {
        callback();
      }
    },

    //检测英文名称
    validDesc(rule, value, callback) {
      if (!value) {
        return callback(new Error("输入商品描述"));
      }
      let reg = /^[\w\u4e00-\u9fa5，,\.。！!\?？\s]{1,150}$/;
      if (!reg.test(value)) {
        callback(new Error("商品描述只支持汉字字母数字_空格，,.。!！？?(1-150位)"));
      } else {
        callback();
      }
    },

    //获取商品类型
    getTypeData() {
      this.axios({
        method: "get",
        url: "/typeData",
      
        //请求头
        headers: {
          token: document.cookie,
        },
      })
        .then((result) => {
          console.log("getTypeData result ==> ", result);

          if (result.data.status == 1041) {
            return this.$router.push({ name: "Login" });
          }

          if (result.data.status == 1140) {
            this.typeData = result.data.data;
            
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

    //发布商品
    postProduct() {

      this.axios({
        method: "post",
        url: "/postProduct",
        data: {
          ...this.productData
        },

        //请求头
        headers: {
          token: document.cookie,
        },
      })
        .then((result) => {
          console.log("postProduct result ==> ", result);

          if (result.data.status == 1041) {
            return this.$router.push({ name: "Login" });
          }

          if (result.data.status == 1130) {
            this.$message({
              message: result.data.msg,
              type: "success",
              showClose: true,
            });

            this.$router.go(-1);
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

    //编辑商品
    editProduct() {
      //对比参数
      console.log('this.copyProductData ==> ', this.copyProductData);
      console.log('this.productData ==> ', this.productData);
      let data = {};
      for (let key in this.productData) {
        if (this.copyProductData[key] != this.productData[key]) {
          data[key] = this.productData[key];
        }
      }

      console.log('data ==> ', data);

      //判断data为空对象
      if (JSON.stringify(data) == '{}') {

        return this.$message({
              message: '尚未修改商品数据',
              type: "error",
              showClose: true,
            });
        // return this.$router.go(-1);
      }

      //发起编辑商品请求
      this.axios({
        method: "post",
        url: "/editProduct",
        data: {
          ...data,
          proId: this.proId
        },

        //请求头
        headers: {
          token: document.cookie,
        },
      })
        .then((result) => {
          console.log("editProduct result ==> ", result);

          if (result.data.status == 1041) {
            return this.$router.push({ name: "Login" });
          }

          if (result.data.status == 1230) {
            this.$message({
              message: result.data.msg,
              type: "success",
              showClose: true,
            });

            // this.$router.go(-1);
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
          console.log("表单验证通过");

          if (this.proId) {
            //编辑商品
            this.editProduct();
          } else {
            //发布商品
            this.postProduct();
          }
        }
      });
    },

    //上传商品图片
    uploadImg(data, key1, key2) {
      // console.log('data ==> ', data);
      this.productData[key1] = data.base64.replace(/^data:image\/[A-Za-z]+;base64,/, '');
      this.productData[key2] = data.type;
    },

    //根据proId查询商品数据
    getProductByProId() {
      this.axios({
        method: "get",
        url: "/productByProId",
        params: {
          proId: this.proId
        },

        //请求头
        headers: {
          token: document.cookie,
        },
      })
        .then((result) => {
          console.log("根据proId查询商品数据 result ==> ", result);

          if (result.data.status == 1041) {
            return this.$router.push({ name: "Login" });
          }

          if (result.data.status == 1220) {

            let data = result.data.data[0];
            data.status = data.status.toString();
            this.imgUrl = `${result.data.staticUrl}${data.img}`;
            this.detailImgUrl = `${result.data.staticUrl}${data.detailImg}`;
            for (let key in data) {
              this.productData[key] = data[key];
            }

            //复制this.productData
            this.copyProductData = {...this.productData};

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
  },
};
</script>

<style lang="less" scoped>
  .post-product{
    .form-box {
      margin-top: 15px;
      background-color: #fff;
      padding: 15px;
    }

    /deep/ .el-textarea__inner{
      height: 100px !important;
      resize: none;
    }
  }
</style>