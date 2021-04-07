<template>
    <div>
        <!-- 面包屑导航 -->
      <el-breadcrumb >
        <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item> 
     </el-breadcrumb>

     <!-- 卡片视图 -->
     <el-card>
         <!-- 搜索栏 -->
         <el-row :gutter="20">
             <el-col :span="8">
                 <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable  @clear="getuserlist">
                    <el-button slot="append" icon="el-icon-search" @click="getuserlist"></el-button> 
                </el-input>
             </el-col>
             <el-col :span="4">
                 <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
             </el-col>
         </el-row>
         <!-- 主体内容 -->
          <el-table :data="userlist" stripe border>
             <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="username" label="姓名" width="180"></el-table-column>
            <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
            <el-table-column prop="mobile" label="电话" width="180"></el-table-column>
            <el-table-column prop="role_name" label="角色" width="180"></el-table-column>
            <el-table-column  label="状态">
                <template slot-scope="scope">
                    <el-switch v-model="scope.row.mg_state" @change="changestatecode(scope.row)"></el-switch>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                  <template slot-scope="scope">
                      <!-- 修改 -->
                    <el-tooltip effect="dark" content=" 修改" placement="top-start">
                        <el-button type="primary" icon="el-icon-edit" @click="editDialog(scope.row.id)"></el-button>
                    </el-tooltip>
                    <!-- 删除 -->
                    <el-tooltip effect="dark" content="删除 " placement="top-start">
                        <el-button type="danger" icon="el-icon-delete" @click="deleteUser(scope.row.id)"></el-button>
                    </el-tooltip>
                    <!-- 分配角色 -->
                    <el-tooltip  effect="dark" content="分配角色" placement="top-start" :enterable="false">
                        <el-button type="warning" icon="el-icon-setting"></el-button>
                    </el-tooltip>
                  </template>
            </el-table-column>

        </el-table>
         <el-pagination :current-page=" queryInfo.pagenum" :page-sizes="[1, 2, 5, 8]"
           :page-size="queryInfo.pagesize"  layout="total, sizes, prev, pager, next, jumper" :total="total"
           @size-change="handleSizeChange"  @current-change="handleCurrentChange">
        </el-pagination>


     </el-card>
    <!-- 添加用户 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="40%" @close="addDialogClose">
        <!-- 主体内容 -->
        
        <el-form :model="addForm" :rules="addFormrules" ref="addFormRef" label-width="70px">
            <!-- 用户名 -->
            <el-form-item label="用户名" prop="username">
                <el-input v-model="addForm.username"></el-input>
            </el-form-item>
            <!-- 密码 -->
             <el-form-item label="密码" prop="password">
                <el-input v-model="addForm.password"></el-input>
            </el-form-item>
            <!-- 邮箱 -->
             <el-form-item label="邮箱" prop="email">
                <el-input v-model="addForm.email"></el-input>
            </el-form-item>
            <!-- 手机 -->
             <el-form-item label="手机" prop="mobile">
                <el-input v-model="addForm.mobile"></el-input>
            </el-form-item>
        </el-form>
        <!-- 确定区 -->
        <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
    </el-dialog>
    
    <!-- 修改用户 -->
    <el-dialog title="提示" :visible.sync="editDialogVisible" width="40%"  @close="editDialogClose">
        <!-- 修改用户主体区 -->
        <el-form :model="editFrom" :rules="editFromrules" ref="editFromRef" label-width="70px">
            <!-- 用户名 -->
            <el-form-item label="用户名" prop="username">
                <el-input v-model="editFrom.username" disabled></el-input>
            </el-form-item>
            <!-- 邮箱 -->
             <el-form-item label="邮箱" prop="email">
                <el-input v-model="editFrom.email"></el-input>
            </el-form-item>
            <!-- 手机 -->
             <el-form-item label="手机" prop="mobile">
                <el-input v-model="editFrom.mobile"></el-input>
            </el-form-item>
        </el-form>
        <!-- 修改按钮 -->
        <span slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="edituser">确 定</el-button>
        </span>
    </el-dialog>
    </div>
</template>
<script>
export default {
    data(){
         // 定义邮箱验证规则
            var checkEmail = (rule,value,cb) =>{
                 const regEmail = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
                 if(regEmail.test(value)){
                     cb()
                 }else{
                     cb(new Error('邮箱格式不正确'))
                 }
            }
            // 定义手机号规则
            var checkMobile = (rule,value,cb) => {
                  const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
                   if (regMobile.test(value)) {
                            cb()
                    } else {
                      cb(new Error('手机号码格式不正确'))
                    }
            }

        return{
           
            // 获取用户参数列表
           queryInfo:{
               query:'',
               pagenum: 1,
               pagesize: 2
           },
           userlist:[],
           total:0,
        //    控制添加用户对话框的显示与隐藏
           addDialogVisible:false,
           addForm:{
               username:'',
               password:'',
               email:'',
               mobile:''
           },
           addFormrules:{
                username:[
                    { required: true, message: '请输入用户名称', trigger: 'blur' },
                    { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
                ],
                password:[
                     { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' } 
                ],
                email:[
                     { required: true, message: '请输入邮箱', trigger: 'blur' },
                    { validator: checkEmail, trigger: 'blur' }
                ],
                mobile:[
                    { required: true, message: '请输入手机号', trigger: 'blur' },
                    { validator: checkMobile, trigger: 'blur' }

                ]
                

           },
        //    修改用户对话框的显示与隐藏
           editDialogVisible:false,
        //    修改数据
           editFrom:{
               username:"",
               email:"",
               mobile:""
           },
        //    监听修改用户规则
           editFromrules:{
                  email:[
                     { required: true, message: '请输入邮箱', trigger: 'blur' },
                    { validator: checkEmail, trigger: 'blur' }
                ],
                mobile:[
                    { required: true, message: '请输入手机号', trigger: 'blur' },
                    { validator: checkMobile, trigger: 'blur' }

                ]
           },

          

        }
    },
    created(){
        this.getuserlist()
    },
    methods:{
        async getuserlist(){
          const {data: res} = await this.$http.get('users',{params:this.queryInfo})
          if(res.meta.status !== 200){
              this.$message.error("获取用户列表失败");
          }
          this.userlist = res.data.users,
          this.total = res.data.total
        
        },
        // 监听pagesize改变的事件
        handleSizeChange(newSize){
            
            this.queryInfo.pagesize = newSize
            this.getuserlist()

        },
        // 监听页码改变的事件
        handleCurrentChange(newNum){
          
            this.queryInfo.pagenum = newNum
            this.getuserlist()
        },
        async changestatecode(userinfo){
            console.log(userinfo)
             const {data: res} = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
             if(res.meta.status !== 200){
                 return this.$message.error("更新状态失败");
             }
             this.$message.success("更新状态成功！")
        },
        // 监听添加用户对话框的关闭
        addDialogClose(){
            this.$refs.addFormRef.resetFields()
        },
        // 添加用户
        addUser(){
            this.$refs.addFormRef.validate(async vaild =>{
                if(!vaild) return
                // 发起请求
                const {data: res} = await this.$http.post('users',this.addForm)
                if(res.meta.status !== 201){
                    this.$message.error("添加用户失败")
                }
                this.$message.success("添加用户成功")
                this.addDialogVisible = false;
                this.getuserlist()


            })
        },
        // 查询用户信息
        async editDialog(id){
          
            const {data: res} = await this.$http.get('users/' + id)
            if(res.meta.status !== 200){
                this.$message.error("查询用户信息失败")
            }
            this.editFrom = res.data
            this.editDialogVisible = true
        },
         // 监听修改用户对话框的关闭
        editDialogClose(){
            this.$refs.editFromRef.resetFields()
        },
         // 修改用户
        edituser(){
            this.$refs.editFromRef.validate( async vaild=>{
               if(!vaild) return
                // 发起请求
               const {data: res}= await this.$http.put('users/'+ this.editFrom.id,this.editFrom
                //  {
                //    email:this.editFrom.email,
                //    mobile:this.editFrom.mobile
                //  }
               )
               if(res.meta.status !== 200){
                   this.$message.error("修改用户信息失败")
               }
               this.$message.success("修改用户信息成功")
                this.editDialogVisible = false;
                this.getuserlist()
               
            })

        },
        // 删除用户
        async deleteUser(id){
          const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
         if(confirmResult !== 'confirm'){
             this.$message.info("已取消删除")
         }else{
           const {data: res} = await this.$http.delete('users/'+ id)
            if(res.meta.status !== 200){
             this.$message.error("删除失败")
         }
             this.$message.success("删除成功")
             this.getuserlist()
         }

       
        }
        
    }
}
</script>
<style lang="scss" scoped>

</style>