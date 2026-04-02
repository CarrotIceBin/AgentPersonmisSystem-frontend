<template>
  <div class="post-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2 class="page-title">岗位管理</h2>
      <p class="page-subtitle">管理企业岗位信息</p>
    </div>
    
    <!-- 查询表单 -->
    <div class="search-form">
      <el-form ref="selectForm" :model="selectForm" class="form-content">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="岗位名称" prop="pname">
              <el-input v-model="selectForm.pname" placeholder="请输入岗位名称" class="form-input"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="岗位类型" prop="ptype">
              <el-select v-model="selectForm.ptype" placeholder="请选择岗位类型" class="form-select">
                <el-option v-for="(item,index) in ptypes" :key="index" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" class="form-button-col">
            <el-form-item>
              <div class="button-group">
                <el-button type="primary" class="search-button" @click="selectPostsByCon">
                  查询
                </el-button>
                <el-button
                  type="primary"
                  class="agent-button"
                  @click="showAgent = true"
                >
                  人事智能助手
                </el-button>
              </div>
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
        <el-table-column prop="pname" label="名称" width="180"></el-table-column>
        <el-table-column prop="ptype" label="类型" width="120"></el-table-column>
        <el-table-column prop="organization" label="编制人数" sortable width="120"></el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <div class="table-actions">
              <el-button
                size="mini"
                type="success"
                class="action-button edit-button"
                @click="handleEdit(scope.$index, scope.row, 'update')">
                编辑
              </el-button>
              <el-button
                size="mini"
                type="primary"
                class="action-button detail-button"
                @click="handleEdit(scope.$index, scope.row, 'detail')">
                详情
              </el-button>
              <el-button
                size="mini"
                type="danger"
                class="action-button delete-button"
                @click="handleDelete(scope.$index, scope.row)">
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
  </div>

    <!-- 岗位修改弹窗 -->
    <el-dialog title="岗位修改" v-model="postDialogVisible" width="40%">
        <el-form ref="updateForm" :model="updateForm" style="width:80%;" label-width="40%">
            <el-form-item label="岗位名称" prop="pname">
                <el-input v-model="updateForm.pname"></el-input>
            </el-form-item>
            <el-form-item label="岗位类型" prop="ptype">
                <el-select v-model="updateForm.ptype">
                    <el-option v-for="(item,index) in ptypes" :key="index" :label="item" :value="item"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="编制人数" prop="organization">
                <el-input v-model="updateForm.organization"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="update(updateForm)" :loading="loadingbut">{{loadingbuttext}}</el-button>
                <el-button type="danger" @click="cancel">重置</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>

    <!-- 岗位详情弹窗 -->
    <el-dialog title="岗位详情" v-model="postDetailDialogVisible" width="40%">
        <el-form ref="updateForm" :model="updateForm" disabled style="width:80%;" label-width="40%">
            <el-form-item label="岗位名称" prop="pname">
                <el-input v-model="updateForm.pname"></el-input>
            </el-form-item>
            <el-form-item label="岗位类型" prop="ptype">
                <el-select v-model="updateForm.ptype">
                    <el-option v-for="(item,index) in ptypes" :key="index" :label="item" :value="item"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="编制人数" prop="organization">
                <el-input v-model="updateForm.organization"></el-input>
            </el-form-item>
        </el-form>
    </el-dialog>

<!-- 引入独立的智能助手组件 -->
<HrAgentChat
  v-model:visible="showAgent"
  employeeId="admin"
/>
</template>

<script>
// 引入智能助手组件
import HrAgentChat from '@/components/HrAgentChat.vue'

export default {
    components: {
        HrAgentChat  // 注册组件
    },
    created: function () {
        this.loadPosts()
    },
    data() {
        return {
            ptypes: ['', '管理', '技术', '营销', '市场'],
            selectForm: {
                currentPage: 1,
                pageSize: 8,
                act: ''
            },
            currentPage: 1,
            tableData: [],
            pageSize: 8,
            total: 0,
            updateForm: {},
            loadingbut: false,
            loadingbuttext: '修改',
            postDialogVisible: false,
            postDetailDialogVisible: false,
            // 控制智能助手组件显示
            showAgent: false
        }
    },
    methods: {
        loadPosts() {
            const params = {
                currentPage: this.currentPage,
                pageSize: this.pageSize,
                act: 'byPage'
            }
            this.$axios
                .get('/getPostByPage', { params: params })
                .then(successResponse => {
                    this.tableData = successResponse.data.posts || []
                    this.total = successResponse.data.total || 0
                })
                .catch(failResponse => {
                    this.$alert(failResponse.response?.status || '请求失败')
                })
        },
        selectPostsByCon() {
            this.$axios
                .post('/selectPostByCon', this.selectForm)
                .then(successResponse => {
                    this.tableData = successResponse.data.posts
                    this.total = successResponse.data.total
                })
                .catch(failResponse => {
                    this.$alert(failResponse.response.status, { confirmButtonText: '确定' })
                })
        },
        headClass() {
            return 'text-align: center;background:rgb(242,242,242);color:rgb(140,138,140)'
        },
        handleCurrentChange(val) {
            this.currentPage = val
            if (this.selectForm.act === 'byCon') {
                this.selectForm.currentPage = this.currentPage
                this.selectForm.pageSize = this.pageSize
                this.selectPostsByCon()
            } else {
                this.loadPosts()
            }
        },
        handleEdit(index, row, act) {
            console.log(index, row);
            this.updateForm = row
            if (act === 'update')
                this.postDialogVisible = true
            else
                this.postDetailDialogVisible = true
        },
        handleDelete(index, row) {
            console.log(index, row);
            this.$confirm('删除岗位, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$axios
                    .delete('/post/delete/' + row.id + '/')
                    .then(successResponse => {
                        if (successResponse.data.code === 200) {
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            this.loadPosts()
                        } else {
                            this.$alert('不能删除有关联数据！', { confirmButtonText: '确定' })
                        }
                    })
                    .catch(failResponse => {
                        this.$alert(failResponse.response.status, { confirmButtonText: '确定' })
                    })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        update() {
            this.loadingbut = true;
            this.loadingbuttext = '修改中...';
            this.$axios
                .put('/post/update/' + this.updateForm.id + '/', this.updateForm)
                .then(successResponse => {
                    if (successResponse.data.code === 200) {
                        this.$alert('修改成功', { confirmButtonText: '确定' })
                        this.postDialogVisible = false
                        this.loadPosts()
                    } else {
                        this.$alert('修改失败', { confirmButtonText: '确定' })
                    }
                    this.loadingbut = false;
                    this.loadingbuttext = '修改';
                })
                .catch(failResponse => {
                    this.$alert(failResponse.response.status, { confirmButtonText: '确定' })
                })
        },
        cancel() {
            this.$refs['updateForm'].resetFields()
        }
    }
}
</script>

<style scoped>
.post-container {
  padding: 0;
  background-color: #f5f7fa;
  min-height: 100%;
}

/* 页面标题 */
.page-header {
  margin-bottom: 24px;
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
  padding: 24px;
  margin-bottom: 20px;
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

.button-group {
  display: flex;
  gap: 12px;
  width: 100%;
}

.search-button {
  flex: 1;
  height: 40px;
  border-radius: 4px;
  font-size: 14px;
  transition: all 0.3s ease;
}

.agent-button {
  flex: 1;
  height: 40px;
  border-radius: 4px;
  font-size: 14px;
  transition: all 0.3s ease;
}

.search-button:hover,
.agent-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.4);
}

/* 数据表格 */
.table-container {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
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
  margin-top: 20px;
}

.pagination {
  display: flex;
  align-items: center;
}

/* 响应式设计 */
@media screen and (max-width: 1200px) {
  .post-container {
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
  
  .button-group {
    flex-direction: column;
  }
  
  .search-button,
  .agent-button {
    width: 100%;
  }
}

@media screen and (max-width: 768px) {
  .page-title {
    font-size: 18px;
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