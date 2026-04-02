<template>
  <div class="box">
    <h2>新增岗位</h2>
    <el-form ref="addForm" :model="addForm" :rules="rules" style="width:50%;"  label-width="150px" >
  <el-form-item label="岗位名称"  prop="pname">
    <el-input v-model="addForm.pname"  placeholder="请输入岗位名称"></el-input>
  </el-form-item>
 <el-form-item label="岗位类型" prop="ptype">
    <el-select v-model="addForm.ptype" placeholder="请选择岗位类型">
      <el-option v-for="(item,index) in ptypes" :key="index" :label="item" :value="item"></el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="编制人数"  prop="organization">
    <el-input v-model="addForm.organization"  placeholder="请输入编制人数"></el-input>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="add" :loading="loadingbut">{{loadingbuttext}}</el-button>
    <el-button type="danger" @click="cancel">重置</el-button>
  </el-form-item>
</el-form>
 </div>
</template>

<script>
export default {
  data () {
    return {
       ptypes:[ '管理','技术','营销','市场'] ,
       addForm: {},
      //验证规则
      rules: {
          pname: [{required: true, message: '请输入岗位名称', trigger: 'blur'}],
          ptype: [{ required: true, message: '请选择岗位类型', trigger: 'change' }]
      },
       loadingbut: false, 
       loadingbuttext: '新增'
    }
  },
  methods: {
    add(){
        this.$refs['addForm'].validate((valid) => {
            if (valid) {
                this.loadingbut = true;
                this.loadingbuttext = '添加中...';
                this.$axios
                .post('/post/add/', this.addForm)
                    .then(successResponse => {
                        if (successResponse.data.code === 200) {
                            this.$alert('添加成功', {confirmButtonText: '确定' })
                            this.$router.replace({path: '/post'})
                        }else {
                            this.$alert('添加失败', {confirmButtonText: '确定' })
                            this.loadingbut = false;
                            this.loadingbuttext = '新增';
                        }
                    })
                    .catch(failResponse => {
                        this.$alert(failResponse.response.status, {confirmButtonText: '确定' })
                    })
            } else {
                this.$alert('表单验证失败', {confirmButtonText: '确定' })
                return false;
            }
        })
    },
    cancel(){
           this.$refs['addForm'].resetFields()
      }
  } 
}
</script>
<style scoped>
.box{
      width: 80%;
      height: 200px;
      margin-left: 20%;
    }
.el-select{
    width:100%
}
</style>