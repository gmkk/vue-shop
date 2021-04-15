<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb>
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <!-- 警告框 -->
          <el-alert title="添加商品信息" type="info" center show-icon></el-alert>
          <!-- 步骤条 -->
          <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
            <el-step title="基本信息"></el-step>
            <el-step title="商品参数"></el-step>
            <el-step title="商品属性"></el-step>
            <el-step title="商品图片"></el-step>
            <el-step title="商品内容"></el-step>
            <el-step title="完成"></el-step>
        </el-steps>

        <!-- tabs标签 -->
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top">
            <el-tabs v-model="activeIndex" :tab-position="'left'" 
            :before-leave="beforeLeave" @tab-click="tabClick">
                <el-tab-pane label="基本信息" name="0" >
                     <el-form-item label="商品名称" prop="goods_name">
                        <el-input v-model="addForm.goods_name"></el-input>
                    </el-form-item>
                     <el-form-item label="商品价格" prop="goods_price">
                        <el-input v-model="addForm.goods_price" type="number"></el-input>
                    </el-form-item>
                     <el-form-item label="商品重量" prop="goods_weight">
                        <el-input v-model="addForm.goods_weight"  type="number"></el-input>
                    </el-form-item>
                    <el-form-item label="商品数量" prop="goods_number">
                        <el-input v-model="addForm.goods_number" type="number"></el-input>
                   </el-form-item>
                    <el-form-item label="商品分类" prop="goods_cat">
                        <el-cascader v-model="addForm.goods_cat" :options="cateList"
                        :props="cateProps"
                        @change="handleChange"></el-cascader>
                   </el-form-item>
                    </el-tab-pane>
                <el-tab-pane label="商品参数" name="1">  
                    <!-- 渲染表单的item项 -->
                    <el-form-item :label="item.attr_name" v-for="item in manyData" :key="item.attr_id">
                          <!-- 复选框组 -->
                          <el-checkbox-group v-model="item.attr_vals">
                            <el-checkbox :label="kk" v-for="(kk,i) in item.attr_vals"
                            :key="i" border></el-checkbox>
                        </el-checkbox-group>
                   </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="商品属性" name="2">
                    <el-form-item :label="item.attr_name" v-for="item in onlyData "
                    :key="item.attr_id">
                    <el-input v-model="item.attr_vals"></el-input>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="商品图片" name="3">
                    <!-- 上传图片 -->
                    <el-upload
                    action="http://127.0.0.1:8080/api/private/v1/upload"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    list-type="picture"
                    :headers="headerRul"
                    :on-success="handleSuccess">
                        <el-button size="small" type="primary">点击上传</el-button>
                        <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
                    </el-upload>
                </el-tab-pane>
                <el-tab-pane label="商品内容" name="4">
                    <!-- 富文本编辑器组件 -->
                   <quill-editor
                        v-model="addForm.goods_introduce"
                    />
                    <el-button type="primary" class="btnAdd" @click="addIntroduce">添加商品</el-button>
                </el-tab-pane>
            </el-tabs>
        </el-form>
        </el-card>

        <!-- 图片预览对话框 -->
        <el-dialog title="图片预览"
            :visible.sync="PreviewDialogVisible"
            width="50%">
          <img :src="PreviewPIC " alt="" style="width:100%;">
        </el-dialog>
    </div>
</template>
<script>
// 引入lodash
import _ from 'lodash'

export default {
    data (){
        return{
            activeIndex:'0',
            // 添加商品数据对象
            addForm:{
                goods_name:'',
                goods_price: 0,
                goods_weight: 0,
                goods_number: 0,
                // 选择分类数组
                goods_cat:[],
                  // 图片上传后的数组
                pics:[],
                // 商品详情
                goods_introduce:'',
                 // 商品参数的数组
               attrs:[]

            },
            // 添加商品验证规则
            addFormRules:{
                goods_name:[
                  { required: true, message: "请输入商品名称", 
                  trigger: "blur" }
                ],
                goods_price:[
                  { required: true, message: "请输入商品价格", 
                  trigger: "blur" }
                ],
                goods_weight:[
                  { required: true, message: "请输入商品重量", 
                  trigger: "blur" }
                ],
                goods_number:[
                    { required: true, message: "请输入商品数量", 
                  trigger: "blur" }
                ],
                 goods_cat:[
                       { required: true, message: "请选择分类", 
                  trigger: "blur" } 
                 ]
            },
            // 商品分类数据
            cateList:[],
          
            cateProps:{
                value: 'cat_id',
                label: 'cat_name',
                children: 'children',
                expandTrigger: 'hover'
            },
            // 动态参数
            manyData:[],
            // 静态属性
            onlyData:[],
            // 上传图片请求头
            headerRul:{
                Authorization:window.sessionStorage.getItem('token')
            },
            // 图片预览
            PreviewPIC:'',
            // 控制图片预览对对话框的显示与隐藏
            PreviewDialogVisible:false,
           
        }
    },
    created(){
        this.getCatelist()
    },
    methods:{
        // 获取商品分类数据
         async getCatelist(){
             const {data: res} = await this.$http.get('categories')
             if(res.meta.status !== 200){
                 return this.$message.error('获取商品分类数据失败')
             }
             this.cateList = res.data
             console.log(this.cateList)
         },
         handleChange(){
             console.log(this.addForm.goods_cat)
            //  只能选择三级列表
             if(this.addForm.goods_cat.length !== 3){
                 this.addForm.goods_cat = []
             }
         },
         beforeLeave(activeName, oldActiveName){
             if(oldActiveName === '0' && this.addForm.goods_cat.length !== 3){
                 this.$message.error('请选择商品分类 ！')
                 return false
             }
         },
         
         async tabClick(){
             if(this.activeIndex === '1'){
                 const {data: res} = await this.$http.get(`categories/${this.cateID}/attributes`,
                 {params: {sel: 'many'}
                 })
                 if(res.meta.status !== 200){
                     return this.$message.error('获取动态参数列表失败')
                 }
                 res.data.forEach(item => {
                      item.attr_vals = 
                      item.attr_vals.length === 0 ?
                     [] : item.attr_vals.split(' ')
                 })
                 console.log(res.data)
                 this.manyData = res.data
            }else(this.activeIndex === '2')
            {
               const {data: res} = await this.$http.get(`categories/${this.cateID}/attributes`,
                 {params: {sel: 'only'}
                 })
                 if(res.meta.status !== 200){
                     return this.$message.error('获取静态属性列表失败')
                 }
    
                 console.log(res.data)
                 this.onlyData = res.data 
            }     
         },
        //  上传图片预览
           handlePreview(file){
               this.PreviewPIC = file.response.data.url
               this.PreviewDialogVisible = true
               

           },
        //    删除图片
           handleRemove(file){
            //    获取将要删除图片的零时路径
              const filePath = file.response.data.tmp_path
            // 从pics数组中，找到这个索引值
              const i = this.addForm.pics.findIndex(x => x.pic === filePath)
            // 调用splice方法，删除图片
              this.addForm.pics.splice(i,1)  
              console.log(this.addForm) 
           },
        //    图片上传成功
        handleSuccess(response){
            console.log(response)
            const picID = {pic: response.data.tmp_path}
            this.addForm.pics.push(picID)
            console.log(this.addForm)
        },
        // 添加详情
        addIntroduce(){
            // console.log(this.addForm)
            this.$refs.addFormRef.validate(async valid => {
                if(!valid){
                    return this.$message.error('请填写必要的表单项 ！')
                }
                // 添加商品
                // lodash cloneDeep(obj)
                const form = _.cloneDeep(this.addForm)
                form.goods_cat =  form.goods_cat.join(',')
                // 动态参数
                 this.manyData.forEach(item => {
                     const newInfo = {
                         attr_id: item.attr_id,
                         attr_value: item.attr_vals.join(' ')
                     }
                     this.addForm.attrs.push(newInfo)
                 })
                  // 静态属性
                 this.onlyData.forEach(item => {
                     const newInfo = {
                         attr_id: item.attr_id,
                         attr_value: item.attr_vals
                     }
                     this.addForm.attrs.push(newInfo)
                 })
                 form.attrs = this.addForm.attrs
                console.log(form)
                // 添加商品，请求数据
                const {data: res} = await this.$http.post('goods',form)
                if(res.meta.status !== 201){
                    return this.$message.error('添加商品失败')
                }
                this.$message.success('添加商品成功')
                this.$router.push('/goods')
            })
        }
    },

    computed:{
        cateID(){
            if(this.addForm.goods_cat.length === 3){
                return this.addForm.goods_cat[2]
            }
        return null
        },
    }
    
}
</script>

<style lang="scss" scoped>
.el-steps{
    margin: 15px 0;
  
}
.el-steps-title{
        font-size: 12px;
}
.btnAdd{
    margin-top: 15px;
}
</style>