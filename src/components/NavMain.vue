<template>
  <div class="nav-main">
    <h3 class="menu-title">人事管理</h3>
    <el-menu
      :default-active="activeIndex"
      class="el-menu-vertical"
      mode="vertical"
      @select="handleSelect"
      background-color="#ffffff"
      text-color="#303133"
      active-text-color="#1890ff"
      :collapse="false">
      <el-submenu index="1">
        <template #title>
          <span class="menu-icon">📋</span>
          <span>部门管理</span>
        </template>
        <el-menu-item index="1-1"><router-link to="/department" class="menu-link">管理部门</router-link></el-menu-item>
        <el-menu-item index="1-2"><router-link to="/adddepartment" class="menu-link">新增部门</router-link></el-menu-item>
      </el-submenu>
      <el-submenu index="2">
        <template #title>
          <span class="menu-icon">🏢</span>
          <span>岗位管理</span>
        </template>
        <el-menu-item index="2-1"><router-link to="/post" class="menu-link">管理岗位</router-link></el-menu-item>
        <el-menu-item index="2-2"><router-link to="/addpost" class="menu-link">新增岗位</router-link></el-menu-item>
      </el-submenu>
      <el-submenu index="3">
        <template #title>
          <span class="menu-icon">👥</span>
          <span>员工管理</span>
        </template>
        <el-menu-item index="3-1"><router-link to="/staff" class="menu-link">管理员工</router-link></el-menu-item>
        <el-menu-item index="3-2"><router-link to="/addStaff" class="menu-link">新增员工</router-link></el-menu-item>
      </el-submenu>
      <el-menu-item index="4">
        <span class="menu-icon">⏰</span>
        <span><router-link to="/peroidOp" class="menu-link">试用期管理</router-link></span>
      </el-menu-item>
      <el-submenu index="5">
        <template #title>
          <span class="menu-icon">🔄</span>
          <span>岗位调动管理</span>
        </template>
        <el-menu-item index="5-1"><router-link to="/addTransferStaff" class="menu-link">录入岗位调动</router-link></el-menu-item>
        <el-menu-item index="5-2"><router-link to="/transferStaff" class="menu-link">查询调动员工</router-link></el-menu-item>
      </el-submenu>
      <el-submenu index="6">
        <template #title>
          <span class="menu-icon">📤</span>
          <span>员工离职管理</span>
        </template>
        <el-menu-item index="6-1"><router-link to="/addQuit" class="menu-link">录入离职员工</router-link></el-menu-item>
        <el-menu-item index="6-2"><router-link to="/quit" class="menu-link">查询已离职员工</router-link></el-menu-item>
      </el-submenu>
      <el-submenu index="7">
        <template #title>
          <span class="menu-icon">📊</span>
          <span>报表管理</span>
        </template>
        <el-menu-item index="7-1"><router-link to="/newStaffReport" class="menu-link">新聘员工报表</router-link></el-menu-item>
        <el-menu-item index="7-2"><router-link to="/quitStaffReport" class="menu-link">离职员工报表</router-link></el-menu-item>
        <el-menu-item index="7-3"><router-link to="/transferStaffReport" class="menu-link">岗位调动报表</router-link></el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: 'NavMain',
  data() {
    return {
      activeIndex: '1'
    }
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    }
  }
}
</script>

<style scoped>
.nav-main {
  height: 100%;
  padding-top: 20px;
}

.menu-title {
  font-size: 16px;
  font-weight: bold;
  color: #303133;
  margin: 0 20px 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #f0f0f0;
}

.el-menu-vertical {
  border-right: none;
  height: calc(100% - 60px);
}

.menu-icon {
  margin-right: 8px;
  font-size: 16px;
}

.menu-link {
  text-decoration: none;
  color: inherit;
  display: block;
  width: 100%;
}

.menu-link:hover {
  color: #1890ff;
}
</style>