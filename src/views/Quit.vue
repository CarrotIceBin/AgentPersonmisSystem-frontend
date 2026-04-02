<template>
  <div class="quit-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2 class="page-title">离职管理</h2>
      <p class="page-subtitle">管理企业员工离职信息</p>
    </div>
    
    <!-- 查询表单 -->
    <div class="search-form">
      <el-form ref="selectForm" :model="selectForm" class="form-content">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="员工编号" prop="staff_id">
              <el-input v-model="selectForm.staff_id" placeholder="请输入员工编号" class="form-input"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="员工姓名" prop="sname">
              <el-input v-model="selectForm.sname" placeholder="请输入员工姓名" class="form-input"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="离职类型" prop="qtype">
              <el-select v-model="selectForm.ttype" placeholder="请选择离职类型" class="form-select">
                <el-option v-for="(item,index) in qtypes" :key="index" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="查询开始日期" prop="startdate">
              <el-date-picker v-model="selectForm.startdate" type="date" placeholder="选择开始日期" style="width:100%"></el-date-picker>
            </el-form-item> 
          </el-col>
          <el-col :span="12">
            <el-form-item label="查询结束日期" prop="enddate">
              <el-date-picker v-model="selectForm.enddate" type="date" placeholder="选择结束日期" style="width:100%"></el-date-picker>
            </el-form-item>  
          </el-col>
          <el-col :span="8" class="form-button-col">
            <el-form-item>
              <el-button type="primary" class="search-button" @click="selectQuitsByCon">
                查询
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    
    <!-- 数据表格 -->
    <div class="table-container">
      <el-table
        :data="tableData"
        :header-cell-style="headClass"
        :cell-style="{ textAlign: 'center' }"
        :default-sort="{prop: 'staff_id', order: 'descending'}"
        class="data-table">
        <el-table-column prop="staff_id" label="员工编号" sortable width="200"></el-table-column>
        <el-table-column prop="sname" label="员工名称" width="200"></el-table-column>
        <el-table-column prop="qtype" label="离职类型" width="200"></el-table-column>
        <el-table-column prop="qdate1" label="离职时间" sortable width="300"></el-table-column>
        <el-table-column prop="opdate1" label="操作时间" sortable width="300"></el-table-column>
      </el-table>
    </div>
    
    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination
        @current-change="handleCurrentChange"
        v-model:currentPage="currentPage"
        :page-size="pageSize"
        layout="total, prev, pager, next"
        :total="total"
        class="pagination"></el-pagination>
    </div>
  </div>
</template>
<script>
export default {
  created: function () {
    this.loadQuit()
  },
  data () {
     return {
        qtypes:[ "辞职","辞退","退休","开除","不录用"]  ,
        selectForm: {
          currentPage: 1,
          pageSize: 15,
          act: ''
        },
        currentPage: 1,
        tableData: [{}],//定义空数组接收数据
        pageSize: 15,
        total: 0
      }
  },
  methods: {
    loadQuit (){
      this.$axios
          .get('/getQuit?currentPage=' + this.currentPage + '&&pageSize=' + this.pageSize)
          .then(successResponse => {
              this.tableData = successResponse.data.quits
              this.total = successResponse.data.total
          })
          .catch(failResponse => {
            this.$alert(failResponse.response.status)
          })
    },
    //条件查询
    selectQuitsByCon(){
        this.selectForm.act = "byCon"
        this.$axios
          .post('/selectQuitsByCon', this.selectForm)//直接提交表单
          .then(successResponse => {
             this.tableData = successResponse.data.quits
             this.total = successResponse.data.total
          })
          .catch(failResponse => {
            this.$alert(failResponse.response.status, {confirmButtonText: '确定' })
          })
    },
     // 表头样式设置
    headClass () {
        return 'text-align: center;background:rgb(242,242,242);color:rgb(140,138,140)'
    },
    //页码变换
    handleCurrentChange(val) {
      this.currentPage = val
      if(this.selectForm.act === 'byCon'){
        this.selectForm.currentPage = this.currentPage
        this.selectForm.pageSize = this.pageSize
        this.selectQuitsByCon()
      }else{
         this.loadQuit()
      }
    }
  }
} 
</script>
<style scoped>
.quit-container {
  padding: 0;
  background-color: #f5f7fa;
  min-height: 100%;
}

/* 页面标题 */
.page-header {
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e4e7ed;
}

.page-title {
  font-size: 20px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 4px;
}

.page-subtitle {
  font-size: 14px;
  color: #909399;
  margin: 0;
}

/* 查询表单 */
.search-form {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 16px;
}

.form-content {
  width: 100%;
}

.form-input,
.form-select {
  width: 100%;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.form-input:focus,
.form-select:focus {
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.3);
}

.form-button-col {
  display: flex;
  align-items: flex-end;
}

.search-button {
  width: 100%;
  height: 40px;
  border-radius: 4px;
  font-size: 14px;
  transition: all 0.3s ease;
}

.search-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.4);
}

/* 数据表格 */
.table-container {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  margin-bottom: 16px;
  overflow: hidden;
}

.data-table {
  width: 100%;
}

.data-table th {
  font-weight: bold;
}

/* 分页 */
.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

.pagination {
  display: flex;
  align-items: center;
}

/* 响应式设计 */
@media screen and (max-width: 1200px) {
  .quit-container {
    padding: 15px;
  }
  
  .form-content {
    width: 100%;
  }
  
  .el-row {
    flex-wrap: wrap;
  }
  
  .el-col {
    margin-bottom: 15px;
  }
  
  .form-button-col {
    margin-bottom: 0;
  }
}

@media screen and (max-width: 768px) {
  .page-title {
    font-size: 20px;
  }
  
  .search-form {
    padding: 15px;
  }
}
</style>