<template>
  <div class="period-op-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2 class="page-title">试用期管理</h2>
      <p class="page-subtitle">管理员工试用期状态</p>
    </div>
    
    <!-- 查询表单 -->
    <div class="search-form">
      <el-form ref="selectForm" :model="selectForm" class="form-content">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="员工姓名" prop="sname">
              <el-input v-model="selectForm.sname" placeholder="请输入员工姓名" class="form-input"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="部门名称" prop="depart_id">
              <el-select v-model="selectForm.depart_id" placeholder="请选择部门" class="form-select">
                <el-option v-for="(item,index) in departs" :key="index" :label="item.dname" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="岗位名称" prop="post_id">
              <el-select v-model="selectForm.post_id" placeholder="请选择岗位" class="form-select">
                <el-option v-for="(item,index) in posts" :key="index" :label="item.pname" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="试用期状态" prop="status">
              <el-select v-model="selectForm.status" placeholder="请选择状态" class="form-select">
                <el-option v-for="(item,index) in status" :key="index" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="开始日期" prop="startdate">
              <el-date-picker v-model="selectForm.startdate" type="date" placeholder="选择开始日期" style="width:100%"></el-date-picker>
            </el-form-item> 
          </el-col>
          <el-col :span="8">
            <el-form-item label="结束日期" prop="enddate">
              <el-date-picker v-model="selectForm.enddate" type="date" placeholder="选择结束日期" style="width:100%"></el-date-picker>
            </el-form-item>  
          </el-col>
          <el-col :span="8" class="form-button-col">
            <el-form-item>
              <el-button type="primary" class="search-button" @click="selectPeriodByCon">
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
        :default-sort="{prop: 'id', order: 'descending'}"
        class="data-table">
        <el-table-column prop="id" label="ID" sortable width="80"></el-table-column>
        <el-table-column prop="sname" label="员工名称" width="120"></el-table-column>
        <el-table-column prop="dname" label="所在部门" width="150"></el-table-column>
        <el-table-column prop="pname" label="岗位名称" width="150"></el-table-column>
        <el-table-column prop="status" label="状态" width="100"></el-table-column>
        <el-table-column prop="startdate1" label="试用期开始日期" sortable width="180"></el-table-column>
        <el-table-column prop="enddate1" label="试用期结束日期" sortable width="180"></el-table-column>
        <el-table-column label="操作" width="240">
          <template #default="scope">
            <div class="table-actions">
              <el-button
                size="mini"  type="success" v-if="scope.row.status=='正常'"
                class="action-button"
                @click="handleEdit(scope.$index, scope.row, '转正')">转正</el-button>
             <el-button
                size="mini" type="primary" v-if="scope.row.status=='正常'"
                class="action-button"
                @click="handleEdit(scope.$index, scope.row, '延期')">延期</el-button>
              <el-button size="mini" type="danger" v-if="scope.row.status=='正常'"
                class="action-button"
                @click="handleEdit(scope.$index, scope.row, '不录用')">不录用</el-button>
            </div>
          </template>
        </el-table-column>
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
    this.loadDepartment()
    this.loadPost()
    this.loadPeriods()
  },
  data () {
     return {
        status: ["正常","转正","延期","不录用"] ,
        departs: [ {id: '', dname: ''}] ,//定义空数组接收后台数据
        posts: [ {id: '', pname: ''}] ,
        selectForm: {
          currentPage: 1,
          pageSize: 10,
          act: ''
        },
        currentPage: 1,
        tableData: [{}],//定义空数组接收数据
        pageSize: 10,
        total: 0
      }
  },
  methods: {
    loadDepartment(){
        this.$axios
          .get('/getDepartment')
          .then(successResponse => {
              this.departs = successResponse.data
          })
          .catch(failResponse => {
            this.$alert(failResponse.response.status)
          })

    },
    loadPost(){
        this.$axios
          .get('/getPost')
          .then(successResponse => {
              this.posts = successResponse.data
          })
          .catch(failResponse => {
            this.$alert(failResponse.response.status)
          })
    },
    loadPeriods (){
      this.$axios
          .get('/getPeriods?currentPage=' + this.currentPage + '&&pageSize=' + this.pageSize)
          .then(successResponse => {
              this.tableData = successResponse.data.periods
              this.total = successResponse.data.total
          })
          .catch(failResponse => {
            this.$alert(failResponse.response.status)
          })
    },
    //条件查询
    selectPeriodByCon(){
        this.selectForm.act = "byCon"
        this.$axios
          .post('/selectPeriodByCon', this.selectForm)//直接提交表单
          .then(successResponse => {
             this.tableData = successResponse.data.periods
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
        this.selectPeriodByCon()
      }else{
         this.loadPeriods()
      }
    },
    //编辑与详情
    handleEdit(index, row, status) {
      console.log(index, row);
      this.$axios
         .post('/periodOp?id=' + row.id +"&&status=" + status)
          .then(successResponse => {
            if (successResponse.data === "ok") {
              this.$alert('操作成功', {confirmButtonText: '确定' })
              this.loadPeriods()
            }else {
              this.$alert('操作失败！', {confirmButtonText: '确定' })
            }
          })
          .catch(failResponse => {
            this.$alert(failResponse.response.status, {confirmButtonText: '确定' })
          })
    }
  }
} 
</script>
<style scoped>
.period-op-container {
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

.table-actions {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.action-button {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.3s ease;
  font-size: 12px;
}

.action-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
  .period-op-container {
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
  
  .table-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .action-button {
    width: 80px;
    justify-content: center;
  }
}
</style>