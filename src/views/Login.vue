<script>
export default {
  name: "login",
  data() {
    return {
      user: {
        userName:'admin',
        passWord: '123456',
      },
      loginRules: {
        userName: [{required:true,message:'请输入用户名',trigger: "blur"}],
        passWord: [{required:true,message:'请输入密码',trigger: "blur"}]
      }
    }
  },
  methods: {
    getHome() {
      this.$router.push("/welcome");
    },
    login() {
      this.$refs.userForm.validate((valid) => {
         if (valid) {
          this.$api.login(this.user).then((res) => {
            console.log(res);
            this.$store.commit("saveUserInfo", res);
            this.$router.replace("/welcome");
          });
        }
      })
    }
  },
  computed: {
  },
  mounted() {
    // this.$request.get("/login").then((res) => {
    //   console.log(res);
    // })
    // this.$storage.setItem("user", { name: "张三", age: 10 });
    // console.log(this.$storage.getItem("user"));
    // this.$storage.clearAll();
    // console.log(this.$storage.getItem("user"));
  },
};
</script>

<template>
  <div class="login-wrapper">
    <div class="modal">
      <el-form :model="user" :rules="loginRules" status-icon ref="userForm">
        <div class="title">登录页</div>
        <el-form-item prop="userName">
          <el-input type="text"  v-model="user.userName"></el-input>
        </el-form-item>
        <el-form-item prop="passWord">
          <el-input type="password"  v-model="user.passWord"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="btn-login" @click="login">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style lang="scss">
.login-wrapper{
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f9fcff;
  width: 100vw;
  height: 100vh;
  .modal {
    width: 500px;
    padding: 35px;
    background: #fff;
    box-shadow: 0px 0px 10px 3px #c7c9cb4d;
    .title {
      font-size: 35px;
      line-height: 1.5;
      text-align: center;
    }
    .btn-login {
      width: 100%;
    }
  }
}
</style>
