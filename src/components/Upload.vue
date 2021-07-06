<template>
  <div class="upload">
    <label class="label">
      <input type="file" @change="uploadImg" />
      <div class="img-box">
        <img class="auto-img" :src="url || imgUrl" alt="" />
      </div>
      <div class="upload-icon">
        <i class="el-icon-upload"></i>
      </div>
    </label>
  </div>
</template>

<script>
export default {
  name: "Upload",
  props: {
    //默认传递的图片链接
    imgUrl: {
      type: String,
      default: "",
    },

    //默认上传文件类型
    fileType: {
      type: Array,
      default() {
        return ["png", "jpg", "jpeg", "gif", "webp"];
      },
    },

    //默认上传大小, 单位KB
    fileSize: {
      type: Number,
      default: 200
    }
  },

  data() {
    return {
      url: "",
    };
  },

  methods: {
    //上传文件
    uploadImg(e) {
      let self = this;

      //上传文件的信息
      let file = e.target.files[0];
      // console.log("file ==> ", file);

      if (!file) {
        return;
      }

      let type = file.type.split("/")[1];
      //验证文件类型
      if (this.fileType.indexOf(type) === -1) {
        //提示
        this.$message({
          message: `上传的文件类型支持${this.fileType.join('，')}格式`,
          type: "error",
          showClose: true,
        });
        return;
      }

      //验证文件大小
      let size = file.size / 1024;
      if (this.fileSize < size) {
        //提示
        this.$message({
          message: `上传的文件大小不能超过${this.fileSize}KB`,
          type: "error",
          showClose: true,
        });
        return;
      }

      //创建文件阅读实例
      let fileReader = new FileReader();

      //监听文件是否读取完毕
      fileReader.onload = function () {
        //获取读取完毕后的文件信息
        let base64 = this.result;

        // console.log("base64 ==> ", base64);

        self.url = base64;

        //触发自定义事件
        self.$emit('uploadFile', {base64, type});
      };

      //如果文件存在, 将文件信息转换为base64
      if (file) {
        fileReader.readAsDataURL(file);
      }
    },
  },
};
</script>

<style lang="less" scoped>
.upload {
  width: 160px;
  height: 160px;
  border: 1px dashed #d9d9d9;
  overflow: hidden;
  transition: border-color .2s linear;
  &:hover{
    border-color: #409EFF;
  }
  .label {
    display: block;
    width: 100%;
    height: 100%;
    position: relative;
    [type="file"] {
      display: none;
    }
    .img-box {
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
      z-index: 5;
    }
  }

  .auto-img {
    width: 100%;
    display: block;
  }

  .upload-icon {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    font-size: 32px;
    color: #d9d9d9;
    z-index: 4;
  }
}
</style>