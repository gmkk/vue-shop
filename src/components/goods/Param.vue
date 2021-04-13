<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb>
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>参数列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-card>
            <!-- 警告框 -->
            <el-alert  title="注意：只允许为第三级分类设置参数"
                type="warning"  :closable="false"   show-icon>
            </el-alert>
            <!-- 选择栏 -->
            <el-row class="row" >
                <el-col>
                    <span>选择商品分类：</span>
                      <!-- 级联选择框 -->
                    <el-cascader
                    v-model="selectKeys"
                    :options="CateList"
                    :props="CascaderProps"
                    @change="parentCateChange"
                    clearable
                ></el-cascader>
                </el-col>
            </el-row>
           <!-- tabs页区 -->
            <el-tabs v-model="activeName" @tab-click="handleTabClick">
                <el-tab-pane label="动态参数" name="many">
                    <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible = true">添加参数</el-button>
                    <!-- 动态数据表格 -->
                    <el-table :data="manyData" border stripe>
                        <!-- 展开行 -->
                      <el-table-column type="expand">
                          <template slot-scope="scope">
                              <!-- 循环显示标签 -->
                            <el-tag v-for="(item, i) in scope.row.attr_vals" :key="i" closable @close="handleClose(i, scope.row)">
                              {{ item }}
                          </el-tag>
                          <!-- 添加标签输入框 -->
                           <el-input
                                class="input-new-tag"
                                v-if="scope.row.inputVisible"
                                v-model="scope.row.inputValue"
                                size="small"
                                ref="saveTagInput"
                                @keyup.enter.native="handleInputConfirm(scope.row)"
                                @blur="handleInputConfirm(scope.row)"
                                >
                        </el-input>
                        <!-- 添加标签按钮 -->
                        <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>

                          </template>
                      </el-table-column>
                       <el-table-column type="index" label="#"></el-table-column>
                        <el-table-column prop="attr_name" label="参数名称"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope"> 
                                <el-button size="mini" type="primary" icon="el-icon-edit" @click="editParamsDialog(scope.row.attr_id)">编辑</el-button>
                                <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeParam(scope.row.attr_id)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="静态属性" name="only">
                     <el-button type="primary" size="mini" :disabled="isBtnDisabled"  @click="addDialogVisible = true">添加属性</el-button>
                      <!-- 静态数据表格 -->
                    <el-table :data="onlyData" border stripe>
                        <!-- 展开行 -->
                      <el-table-column type="expand">
                         <template slot-scope="scope">
                              <!-- 循环显示标签 -->
                            <el-tag v-for="(item, i) in scope.row.attr_vals" :key="i" closable @close="handleClose(i, scope.row)">
                              {{ item }}
                          </el-tag>
                          <!-- 添加标签输入框 -->
                           <el-input
                                class="input-new-tag"
                                v-if="scope.row.inputVisible"
                                v-model="scope.row.inputValue"
                                size="small"
                                ref="saveTagInput"
                                @keyup.enter.native="handleInputConfirm(scope.row)"
                                @blur="handleInputConfirm(scope.row)"
                                >
                        </el-input>
                        <!-- 添加标签按钮 -->
                        <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>

                         </template>
                      </el-table-column>
                       <el-table-column type="index" label="#"></el-table-column>
                        <el-table-column prop="attr_name" label="属性名称"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope"> 
                                <el-button size="mini" type="primary" icon="el-icon-edit" @click="editParamsDialog(scope.row.attr_id)">编辑</el-button>
                                <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeParam(scope.row.attr_id)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane> 
            </el-tabs>

            <!-- 添加参数的对话框 -->
            <el-dialog :title="'添加'+ titleText" :visible.sync="addDialogVisible"
                width="40%" @close="addParamsClose">
                <!-- 主题内容 -->
               <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" >
                    <el-form-item :label="titleText" prop="attr_name">
                        <el-input v-model="addForm.attr_name"></el-input>
                    </el-form-item>
               </el-form>
                <!-- 底部按钮 -->
                <span slot="footer" class="dialog-footer">
                    <el-button @click="addDialogVisible= false">取 消</el-button>
                    <el-button type="primary" @click="addParams">确 定</el-button>
                </span>
            </el-dialog>

             <!-- 修改参数的对话框 -->
            <el-dialog :title="'修改'+ titleText" :visible.sync="editDialogVisible"
                width="40%" @close="editParamsClose">
                <!-- 主题内容 -->
               <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px" >
                    <el-form-item :label="titleText" prop="attr_name">
                        <el-input v-model="editForm.attr_name"></el-input>
                    </el-form-item>
               </el-form>
                <!-- 底部按钮 -->
                <span slot="footer" class="dialog-footer">
                    <el-button @click="editDialogVisible= false">取 消</el-button>
                    <el-button type="primary" @click="editParams">确 定</el-button>
                </span>
            </el-dialog>
        </el-card>
    </div>
</template>
<script>
export default {
    data(){
        return {
           CateList: [],
            CascaderProps: {
                value: "cat_id",
                label: "cat_name",
                children: "children",
                expandTrigger: "hover",
                checkStrictly: "true"
            },
         //选中的父级分类id数组
         selectKeys: [],
         activeName:'many',
        //  动态参数数据
         manyData:[],
         //  静态参数数据
         onlyData:[],
        //  控制添加参数的对话框的显示与隐藏
         addDialogVisible:false,
        //  添加参数数据
         addForm:{
             attr_name:''
         },
         addFormRules:{
             attr_name:[
                { required: true, message: '请输入参数名称', trigger: 'blur' },
             ]
         },
          //  控制修改参数的对话框的显示与隐藏
         editDialogVisible:false,
        //  添加修改数据
         editForm:{
             attr_name:''
         },
        //  修改参数规则
         editFormRules:{
             attr_name:[
                { required: true, message: '请输入参数名称', trigger: 'blur' },
             ]
         },
       

        }
    },
    created(){
        this.getCateList()
    },
    methods:{
    async getCateList() {
      const { data: res } = await this.$http.get("categories" );
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品分类数据失败");
      }
      this.CateList = res.data;

      
    },
     //选择项发生变化触发这个函数
   parentCateChange() {
      this.getParamsData()
    },
    handleTabClick(){
       console.log(this.activeName)
        this.getParamsData()
    },
    // 获取参数列表
    async getParamsData(){
        console.log(this.selectKeys);
    //   判断是否选择的是三级参数
      if (this.selectKeys.length !== 3) {
          this.selectKeys =[]
          this.manyData =[]
          this.onlyData = []
          return
      }
      console.log(this.selectKeys)
    //   证明选中的是三级分类
      const {data: res} = await this.$http.get(`categories/${this.cateID}/attributes`,
        {params: {sel: this.activeName}})
        if(res.meta.status !== 200){
            return this.$message.error('获取参数列表失败')
        }
        
        res.data.forEach(item => {
            item.attr_vals = item.attr_vals 
            ? item.attr_vals.split(' ') : []
             //  控制添加标签输入框的显示与隐藏
          item.inputVisible = false,
          // 输入框值
          item.inputValue = ''
        }) 
        
       console.log(res.data)
        if(this.activeName === 'many'){
            this.manyData = res.data
        }else{
            this.onlyData = res.data
        }
     },
    //  重置数据
       addParamsClose(){
           this.$refs.addFormRef.resetFields()

       },
    //    添加参数属性
       addParams(){
           this.$refs.addFormRef.validate(async valid => {
               if(!valid) return 
               const {data: res} = await this.$http.post(`categories/${this.cateID}/attributes`,{
                   attr_name: this.addForm.attr_name,
                   attr_sel: this.activeName
               })
               if(res.meta.status !== 201){
                   return this.$message.error('添加参数失败')
               }
               this.$message.success('添加参数成功')
               this.addDialogVisible = false
               this.getParamsData()
           })
       },
    //    控制修改参数的对话框的显示与隐藏
       async editParamsDialog(attr_id){
           const {data: res} = await this.$http.get(`categories/${this.cateID}/attributes/${attr_id}`,{
               params:{attr_sel: this.activeName}
           })
           if(res.meta.status !== 200){
               return this.$message.error('查询参数失败')
           }
           this.editForm = res.data
           this.editDialogVisible= true
       },
       editParams(){
           this.$refs.editFormRef.validate(async valid => {
               if(!valid) return
               const {data: res} = await this.$http.put(`categories/${this.cateID}/attributes/${this.editForm.attr_id}`,{
                   attr_name: this.editForm.attr_name,
                   attr_sel: this.activeName
               })
               if(res.meta.status !== 200){
                   return this.$message.error('修改参数失败')
               }
               this.$message.success('提交参数成功')
               this.getParamsData()
               this.editDialogVisible= false
           })
       },
    //    重置修改参数
       editParamsClose(){
           this.$refs.editFormRef.resetFields()
       },
    //    删除参数
        async removeParam(attr_id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)
        //用户取消了操作
      if (confirmResult !== 'confirm') {
        this.$message.info('已取消删除')
      } else {
        const { data: res } = await this.$http.delete(`categories/${this.cateID}/attributes/${attr_id}`)
        if (res.meta.status !== 200) {
          return this.$message.error('删除参数失败')
        }
        this.$message.success('删除参数成功')
        this.getParamsData()
      }
    },
   handleInputConfirm(row){
        if(row.inputValue.trim().length === 0){
            row.inputValue =''
            row.inputVisible = false
            return
        }
        // 添加标签到页面
        row.attr_vals.push(row.inputValue.trim())
        row.inputValue =''
        row.inputVisible = false
        this.saveConfirm(row)
    },
    // 保存对attr_vals
    async saveConfirm(row){
        // 请求数据，添加到后台
       const {data: res} = await this.$http.put(`categories/${this.cateID}/attributes/${row.attr_id}`,{
            attr_name: row.attr_name,
            attr_sel: row.attr_sel,
            attr_vals: row.attr_vals.join(' ')
        })
        if(res.meta.status !== 200){
            this.$message.error('修改标签参数失败')
        }
        this.$message.success('修改标签参数成功')
    },

    showInput(row){
        row.inputVisible = true
        // 让文本框自动获取焦点
        // .$nextTick方法的作用，就是当页面上元素重新渲染后，
        // 才会指定回调函数中的代码
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
    },
    handleClose(i, row){
        row.attr_vals.splice(i,1)
         this.saveConfirm(row)
    }

   
    },


    computed:{
        isBtnDisabled(){
            // 如果选择三级参数，则返回true，否则，返回false
            if(this.selectKeys.length !== 3){
                return true
            }
            return false
        },
        cateID(){
            if(this.selectKeys.length == 3){
                return this.selectKeys[2]
            }
            return null
        },
        // 添加参数和添加属性
        titleText(){
            if(this.activeName === 'many'){
                return '动态参数'
            }
            return '静态属性'

        }
    }
}
</script>
<style lang="scss" scoped>
.row{
    margin: 15px 0;
}
.el-tag{
    margin: 8px;
}
.input-new-tag{
    width: 120px;
}
</style>