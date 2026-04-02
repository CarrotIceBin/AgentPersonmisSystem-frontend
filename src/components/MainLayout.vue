<template>
  <div class="main-layout">
    <!-- 顶部导航栏 -->
    <header class="top-nav">
      <div class="logo">
        <span class="logo-text">公司人事管理系统</span>
      </div>
      <div class="user-info">
        <el-dropdown>
          <span class="user-dropdown">
            <el-avatar size="small" :src="userAvatar"></el-avatar>
            <span class="user-name">{{ userName }}</span>
            <span class="el-icon--right">▼</span>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>个人中心</el-dropdown-item>
              <el-dropdown-item>修改密码</el-dropdown-item>
              <el-dropdown-item divided @click="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </header>
    
    <!-- 主内容区域 -->
    <div class="main-content">
      <!-- 左侧菜单栏 -->
      <aside class="side-menu">
        <NavMain />
      </aside>
      
      <!-- 右侧内容 -->
      <main class="content-area">
        <router-view />
      </main>
    </div>
    
    <!-- 底部版权信息 -->
    <footer class="footer">
      <div class="copyright">© 2026 某某科技有限公司 版权所有</div>
    </footer>
  </div>
</template>

<script>
import NavMain from './NavMain.vue'

export default {
  name: 'MainLayout',
  components: {
    NavMain
  },
  data() {
    return {
      userName: '管理员',
      userAvatar: ''
    }
  },
  methods: {
    logout() {
      this.$store.commit('changeLogin', '')
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
.main-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f7fa;
}

/* 顶部导航栏 */
.top-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 56px;
  padding: 0 24px;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.logo {
  display: flex;
  align-items: center;
}

.logo-text {
  font-size: 18px;
  font-weight: bold;
  color: #1890ff;
}

.user-info {
  display: flex;
  align-items: center;
}

.user-dropdown {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 4px 12px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.user-dropdown:hover {
  background-color: #f0f2f5;
}

.user-name {
  margin: 0 8px;
  font-size: 14px;
}

/* 主内容区域 */
.main-content {
  display: flex;
  flex: 1;
  margin-top: 56px;
  min-height: calc(100vh - 104px);
}

/* 左侧菜单栏 */
.side-menu {
  width: 200px;
  background-color: #ffffff;
  box-shadow: 2px 0 4px rgba(0, 0, 0, 0.1);
  position: fixed;
  left: 0;
  top: 56px;
  bottom: 48px;
  overflow-y: auto;
  z-index: 999;
  transition: width 0.3s ease;
}

/* 右侧内容 */
.content-area {
  flex: 1;
  margin-left: 200px;
  padding: 24px 24px 72px;
  overflow-y: auto;
  min-height: calc(100vh - 104px);
  transition: margin-left 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.content-area > * {
  width: 100%;
  max-width: 1200px;
}

/* 底部版权信息 */
.footer {
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.copyright {
  font-size: 14px;
  color: #999;
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .side-menu {
    width: 200px;
  }
  
  .content-area {
    margin-left: 200px;
  }
}
</style>