<template>
  <div class="product-list">
    <div class="search-box">
      <el-form :inline="true" :model="searchCondition">
        <el-form-item label="商品名称">
          <el-input
            v-model="searchCondition.name"
            placeholder="输入商品名称"
          ></el-input>
        </el-form-item>

        <el-form-item label="商品类型">
          <el-select
            v-model="searchCondition.typeId"
            placeholder="选择商品类型"
          >
            <el-option label="选择商品类型" value="-1"></el-option>
            <el-option
              :label="item.name"
              :value="item.typeId"
              v-for="item in typeData"
              :key="item.typeId"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="状态">
          <el-select v-model="searchCondition.status" placeholder="输入状态">
            <el-option label="选择状态" value="-1"></el-option>
            <el-option label="正常" value="0"></el-option>
            <el-option label="冻结" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="创建日期">
          <el-date-picker
            type="date"
            placeholder="选择日期"
            v-model="searchCondition.createdAt"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="initProductList">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="create-type">
      <el-button type="primary" @click="postNewProduct">发布新商品</el-button>
      <el-button type="danger" :disabled="!isSelect" @click="removeMoreProduct"
        >删除选择</el-button
      >
    </div>

    <div class="type-list-table">
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        @select="select"
        @select-all="select"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column prop="name" label="商品名称" width="120">
        </el-table-column>

        <el-table-column prop="price" label="商品价格" width="120">
        </el-table-column>

        <el-table-column prop="typeName" label="商品类型" width="120">
        </el-table-column>

        <el-table-column label="状态" width="80" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.status == 0 ? "正常" : "冻结" }}
          </template>
        </el-table-column>

        <el-table-column label="创建日期" width="180">
          <template slot-scope="scope">{{ scope.row.createdAt }}</template>
        </el-table-column>

        <el-table-column label="更新日期" width="180">
          <template slot-scope="scope">{{ scope.row.updatedAt }}</template>
        </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="default" size="small" @click="editProduct(scope.row.proId)">编辑</el-button>
            <el-button
              type="success"
              size="small"
              v-if="scope.row.status == 1"
              @click="toggleProductStatus(scope.row)"
              >启用</el-button
            >
            <el-button
              type="warning"
              size="small"
              v-else
              @click="toggleProductStatus(scope.row)"
              >冻结</el-button
            >
            <el-button
              type="danger"
              size="small"
              @click="removeOneProduct(scope.row.proId)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-box">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="paginationOptions.total"
          :pager-count="paginationOptions.pagerCount"
          :page-size="paginationOptions.pageSize"
          @current-change="currentChange"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { tool } from "../assets/js/tool";
export default {
  name: "ProductList",
  data() {
    return {
      //搜索查询条件
      searchCondition: {
        name: "",
        typeId: "-1",
        status: "-1",
        createdAt: "",
      },

      //复制搜索查询条件
      copySearchCondition: {},

      //类型列表数据
      tableData: [],

      //选择商品id
      proIds: [],

      //分页
      paginationOptions: {
        //总数量
        total: 0,

        //页码数量
        pagerCount: 5,

        //每页展示的数量
        pageSize: 5,

        //数据偏移量
        offset: 0,
      },

      //商品类型
      typeData: [],
    };
  },
  computed: {
    isSelect() {
      return this.proIds.length > 0;
    },
  },

  created() {
    this.getTypeData();
    this.initProductList();
  },

  methods: {
    //初始化类型列表
    initProductList() {
      this.paginationOptions.total = 0;
      this.paginationOptions.offset = 0;
      this.copySearchCondition = { ...this.searchCondition };
      this.getProductCount();
      this.search();
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

    //搜索查询
    search() {
      // console.log('this.searchCondition ==> ', this.searchCondition);

      //获取查询条件
      let params = {
        //数据偏移量
        offset: this.paginationOptions.offset,
        count: this.paginationOptions.pageSize,
      };
      for (let key in this.copySearchCondition) {
        if (
          ((key == "status" || key == "typeId") &&
            this.copySearchCondition[key] == -1) ||
          !this.copySearchCondition[key]
        ) {
          continue;
        }

        if (key == "createdAt") {
          params[key] = tool.formatDate(
            this.copySearchCondition[key],
            "yyyy-MM-dd"
          );
        } else {
          params[key] = this.copySearchCondition[key];
        }
      }

      // console.log("params ==> ", params);

      this.axios({
        method: "get",
        url: "/productList",
        params,

        //请求头
        headers: {
          token: document.cookie,
        },
      })
        .then((result) => {
          console.log("productList result ==> ", result);

          if (result.data.status == 1041) {
            return this.$router.push({ name: "Login" });
          }

          if (result.data.status == 1180) {
            // this.$message({
            //   message: result.data.msg,
            //   type: "success",
            //   showClose: true,
            // });

            result.data.data.forEach((v) => {
              v.createdAt = tool.formatDate(v.createdAt, "yyyy-MM-dd hh:mm:ss");
              v.updatedAt = tool.formatDate(v.updatedAt, "yyyy-MM-dd hh:mm:ss");
            });

            this.tableData = result.data.data;
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

    //查询商品类型总数量
    getProductCount() {
      //获取查询条件
      let params = {};

      for (let key in this.copySearchCondition) {
        if (
          ((key == "status" || key == "typeId") &&
            this.copySearchCondition[key] == -1) ||
          !this.copySearchCondition[key]
        ) {
          continue;
        }

        if (key == "createdAt") {
          params[key] = tool.formatDate(
            this.copySearchCondition[key],
            "yyyy-MM-dd"
          );
        } else {
          params[key] = this.copySearchCondition[key];
        }
      }

      console.log("params ==> ", params);

      this.axios({
        method: "get",
        url: "/productCount",
        params,
        //请求头
        headers: {
          token: document.cookie,
        },
      })
        .then((result) => {
          console.log("getProductCount result ==> ", result);

          if (result.data.status == 1041) {
            return this.$router.push({ name: "Login" });
          }

          if (result.data.status == 1190) {
            this.paginationOptions.total = result.data.data[0].count;
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

    //切换页码
    currentChange(index) {
      // console.log('index ==> ', index);
      this.paginationOptions.offset =
        (index - 1) * this.paginationOptions.pageSize;

      this.search();
    },

    //切换商品状态
    toggleProductStatus(item) {
      console.log("item ==> ", item);

      this.axios({
        method: "post",
        url: "/productStatus",
        data: {
          proId: item.proId,
          status: item.status == 0 ? 1 : 0,
        },

        //请求头
        headers: {
          token: document.cookie,
        },
      })
        .then((result) => {
          console.log("productStatus result ==> ", result);

          if (result.data.status == 1041) {
            return this.$router.push({ name: "Login" });
          }

          if (result.data.status == 1200) {
            if (result.data.data.result[0] == 1) {
              this.$message({
                message: result.data.msg,
                type: "success",
                showClose: true,
              });
              item.status = result.data.data.status;
            } else {
              this.$message({
                message: result.data.msg,
                type: "error",
                showClose: true,
              });
            }
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

    //选择数据行
    select(selection) {
      this.proIds = [];
      selection.forEach((v) => {
        this.proIds.push(v.proId);
      });
    },

    //删除商品类型状态
    removeProduct(proIds) {
      this.$confirm("此操作将永久删除该商品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // console.log("proIds ==> ", proIds);

          this.axios({
            method: "post",
            url: "/removeProduct",
            data: {
              proIds,
            },

            //请求头
            headers: {
              token: document.cookie,
            },
          })
            .then((result) => {
              console.log("removeType result ==> ", result);

              if (result.data.status == 1041) {
                return this.$router.push({ name: "Login" });
              }

              if (result.data.status == 1210) {
                if (result.data.data[0] >= 1) {
                  this.$message({
                    message: result.data.msg,
                    type: "success",
                    showClose: true,
                  });

                  //重新拉取数据
                  this.proIds = [];
                  this.initProductList();
                } else {
                  this.$message({
                    message: result.data.msg,
                    type: "error",
                    showClose: true,
                  });
                }
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
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },

    //单个删除
    removeOneProduct(proId) {
      this.removeProduct([proId]);
    },

    //多个删除
    removeMoreProduct() {
      this.removeProduct(this.proIds);
    },

    //发布新商品
    postNewProduct() {
      this.$router.push({ name: "PostProduct" });
    },

    //编辑商品
    editProduct(proId) {
      this.$router.push({name: 'PostProduct', query: {proId}});
    }
  },
};
</script>

<style lang="less" scoped>
.product-list {
  .search-box {
    padding: 15px 15px 0;
    background-color: #fff;
    .el-form-item {
      margin-bottom: 15px;
    }
  }
  .create-type {
    height: 40px;
    background-color: #fff;
    margin-top: 15px;
    padding: 15px;
  }
  .type-list-table {
    margin-top: 15px;
    background-color: #fff;
    padding: 15px;
  }
  .pagination-box {
    margin-top: 15px;
    text-align: center;
  }

  .pro-img {
    width: 32px;
    height: 32px;
    background-color: #e8e8e8;
  }

  .auto-img {
    width: 100%;
    display: block;
  }
}
</style>