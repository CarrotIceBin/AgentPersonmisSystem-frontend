<template>
  <div class="login-container">
    <div class="login-form-wrapper">
      <div class="login-header">
        <h2 class="login-title">某某有限公司人事管理系统</h2>
        <p class="login-subtitle">管理员登录</p>
      </div>
      <el-form ref="loginForm" :model="loginForm" :rules="rules" class="login-form">
        <el-form-item prop="uname">
          <el-input v-model="loginForm.uname" placeholder="请输入用户名" prefix-icon="el-icon-user"></el-input>
        </el-form-item>
        <el-form-item prop="upwd">
          <el-input v-model="loginForm.upwd" placeholder="请输入密码" type="password" prefix-icon="el-icon-lock"></el-input>
        </el-form-item>
        <el-form-item>
          <div class="button-group">
            <el-button type="primary" class="login-button" @click="login(loginForm)" :loading="loadingbut">{{loadingbuttext}}</el-button>
            <el-button class="reset-button" @click="cancel">重置</el-button>
          </div>
        </el-form-item>
      </el-form>
      <div class="login-footer">
        <p>© 2026 某某有限公司 版权所有</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      loginForm: {},
      //验证规则
      rules: {
        uname: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        upwd: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      },
      loadingbut: false,
      loadingbuttext: '登录'
    }
  },
  methods: {
    login(loginForm) {
      this.$refs['loginForm'].validate((valid) => {
        if (valid) {
          this.loadingbut = true
          this.loadingbuttext = '登录中...'
          this.$axios
            .post('/login', {
              uname: loginForm.uname,
              upwd: loginForm.upwd
            })
            .then(successResponse => {
              if (successResponse.data === "ok") {
                this.$alert('登录成功', { confirmButtonText: '确定' })
                this.$store.commit('changeLogin', this.loginForm.uname)
                let path = this.$route.query.redirect
                this.$router.replace({ path: path === '/' || path === undefined ? '/department' : path })
              } else {
                this.$alert('用户名或密码错误！', { confirmButtonText: '确定' })
                this.loadingbut = false;
                this.loadingbuttext = '登录';
              }
            })
            .catch(failResponse => {
              this.$alert(failResponse.response.status, { confirmButtonText: '确定' })
            })
        } else {
          this.$alert('表单验证失败', { confirmButtonText: '确定' })
          return false;
        }
      })
    },
    cancel() {
      this.$refs['loginForm'].resetFields()
    }
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  overflow: hidden;
}

.login-form-wrapper {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  padding: 40px;
  width: 400px;
  animation: fadeInUp 0.6s ease-out;
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-title {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 10px;
}

.login-subtitle {
  font-size: 16px;
  color: #606266;
  margin: 0;
}

.login-form {
  width: 100%;
}

.login-form .el-form-item {
  margin-bottom: 20px;
}

.login-form .el-input {
  height: 48px;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;
}

.login-form .el-input:focus {
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.3);
}

.button-group {
  display: flex;
  gap: 10px;
  width: 100%;
}

.login-button {
  flex: 1;
  height: 48px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  transition: all 0.3s ease;
}

.login-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.reset-button {
  flex: 1;
  height: 48px;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;
}

.login-footer {
  text-align: center;
  margin-top: 30px;
}

.login-footer p {
  font-size: 12px;
  color: #909399;
  margin: 0;
}

/* 动画效果 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式设计 */
@media screen and (max-width: 480px) {
  .login-form-wrapper {
    width: 90%;
    padding: 30px;
  }
  
  .login-title {
    font-size: 20px;
  }
  
  .login-form .el-input {
    height: 44px;
  }
  
  .login-button,
  .reset-button {
    height: 44px;
  }
}
</style>