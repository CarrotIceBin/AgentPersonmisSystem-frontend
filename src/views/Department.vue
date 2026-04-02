<template>
  <div class="department-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2 class="page-title">部门管理</h2>
      <p class="page-subtitle">管理企业部门信息</p>
    </div>
    
    <!-- 查询表单 -->
    <div class="search-form">
      <el-form ref="selectForm" :model="selectForm" class="form-content">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="部门名称" prop="dname">
              <el-input v-model="selectForm.dname" placeholder="请输入部门名" class="form-input"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="部门类型" prop="dtype">
              <el-select v-model="selectForm.dtype" placeholder="请选择部门类型" class="form-select">
                <el-option v-for="(item,index) in dtypes" :key="index" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" class="form-button-col">
            <el-form-item>
              <el-button type="primary" class="search-button" @click="selectDepartmentsByCon">
                <el-icon><Search /></el-icon>
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
        <el-table-column prop="dname" label="名称" width="180"></el-table-column>
        <el-table-column prop="dtype" label="类型" width="120"></el-table-column>
        <el-table-column prop="establishmentdate1" label="成立日期" sortable width="160"></el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <div class="table-actions">
              <el-button
                size="mini"
                type="success"
                class="action-button edit-button"
                @click="handleEdit(scope.$index, scope.row, 'update')">
                <el-icon><Edit /></el-icon>
                编辑
              </el-button>
              <el-button
                size="mini"
                type="primary"
                class="action-button detail-button"
                @click="handleEdit(scope.$index, scope.row, 'detail')">
                <el-icon><View /></el-icon>
                详情
              </el-button>
              <el-button
                size="mini"
                type="danger"
                class="action-button delete-button"
                @click="handleDelete(scope.$index, scope.row)">
                <el-icon><Delete /></el-icon>
                删除
              </el-button>
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
<el-dialog title="部门修改" v-model="dialogVisibleDetail"  width="40%" >
   <el-form ref="detailData" :model="detailData"  style="width:80%;"  label-width="40%" >
  <el-form-item label="部门名称"  prop="dname">
    <el-input v-model="detailData.dname"></el-input>
  </el-form-item>
 <el-form-item label="部门类型" prop="dtype">
    <el-select v-model="detailData.dtype">
      <el-option v-for="(item,index) in dtypes" :key="index" :label="item" :value="item"></el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="电话"  prop="dtel">
    <el-input v-model="detailData.dtel" ></el-input>
  </el-form-item>
  <el-form-item label="传真"  prop="dfax">
    <el-input v-model="detailData.dfax"></el-input>
  </el-form-item>
  <el-form-item label="描述"  prop="description">
    <el-input v-model="detailData.description" type="textarea" ></el-input>
  </el-form-item>
  <el-form-item label="上级部门" prop="supdepartment">
    <el-select v-model="detailData.supdepartment">
      <el-option v-for="(item,index) in supdepartments" :key="index" :label="item.dname" :value="item.id"></el-option>
    </el-select>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="update(detailData)">修改</el-button>
    <el-button type="danger" @click="cancel">重置</el-button>
  </el-form-item>
</el-form>
  </el-dialog>

  <el-dialog title="部门详情" v-model="dialogVisible"  width="50%" >
 <el-form ref="detailData" :model="detailData" disabled  style="width:80%;"  label-width="40%" >
  <el-form-item label="部门名称"  prop="dname">
    <el-input v-model="detailData.dname"></el-input>
  </el-form-item>
 <el-form-item label="部门类型" prop="dtype">
    <el-select v-model="detailData.dtype">
      <el-option v-for="(item,index) in dtypes" :key="index" :label="item" :value="item"></el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="电话"  prop="dtel">
    <el-input v-model="detailData.dtel"></el-input>
  </el-form-item>
  <el-form-item label="传真"  prop="dfax">
    <el-input v-model="detailData.dfax"></el-input>
  </el-form-item>
  <el-form-item label="描述"  prop="description">
    <el-input v-model="detailData.description" type="textarea"></el-input>
  </el-form-item>
  <el-form-item label="上级部门" prop="supdepartment">
    <el-select v-model="detailData.supdepartment">
      <el-option v-for="(item,index) in supdepartments" :key="index" :label="item.dname" :value="item.id"></el-option>
    </el-select>
  </el-form-item>
  </el-form>
  </el-dialog>
  </div>
</template>
<script>
import { Search, Edit, View, Delete } from '@element-plus/icons-vue'

export default {
  components: {
    Search,
    Edit,
    View,
    Delete
  },
  created: function () {
    this.loadDepartments()
  },
  data () {
     return {
        dtypes:[ '', '公司', '部门', '车间', '生产线', '班组'] ,
        selectForm: {
          currentPage: 1,
          pageSize: 10,
          act: ''
        },
        currentPage: 1,
        tableData: [{}],//定义空数组接收数据
        pageSize: 10,
        total: 0,
        dialogVisible: false,//详情对话框是否显示
        dialogVisibleDetail: false,
        detailData: {},
        supdepartments:[ {id: '', dname: ''}] ,//定义空数组接收后台数据
      }
  },
  methods: {
    loadDepartments (){
      this.$axios
          .get('/department/list/')
          .then(successResponse => {
              this.tableData = successResponse.data.data
              this.total = successResponse.data.data.length
          })
          .catch(failResponse => {
            this.$alert(failResponse.response.status)
          })
    },
    //条件查询
    selectDepartmentsByCon(){
        this.$axios
          .get('/department/list/')
          .then(successResponse => {
             this.tableData = successResponse.data.data
             this.total = successResponse.data.data.length
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
        this.selectDepartmentsByCon()
      }else{
         this.loadDepartments()
      }
    },
    //编辑与详情
    handleEdit(index, row, act) {
      console.log(index, row);
      this.detailData = row
      // 获取所有部门作为上级部门选项
      this.$axios
          .get('/department/list/')
          .then(successResponse => {
              this.supdepartments = successResponse.data.data;
          })
          .catch(failResponse => {
            this.$alert(failResponse.response.status)
          })
      if(act === 'update')
        this.dialogVisibleDetail = true
      else
        this.dialogVisible = true
    },
    handleDelete(index, row) {
      console.log(index, row);
      this.$confirm('删除部门, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios
          .delete('/department/delete/' + row.id + '/')
          .then(successResponse => {
            if (successResponse.data.code === 200) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              //删除成功后重新加载
              this.loadDepartments()
            }else {
              this.$alert('不能删除有关联数据！', {confirmButtonText: '确定' })
            }
          })
          .catch(failResponse => {
            this.$alert(failResponse.response.status, {confirmButtonText: '确定' })
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
    },
    cancel(){
           this.$refs['detailData'].resetFields()
    },
    update(){
        this.$axios
          .put('/department/update/' + this.detailData.id + '/', this.detailData)
          .then(successResponse => {
            if (successResponse.data.code === 200) {
              this.$alert('修改成功', {confirmButtonText: '确定' })
              this.dialogVisibleDetail = false
              //修改成功后重新加载
              this.loadDepartments()
            }else {
              this.$alert('修改失败', {confirmButtonText: '确定' })
              this.dialogVisibleDetail = false
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
.department-container {
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
  gap: 6px;
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
  .department-container {
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