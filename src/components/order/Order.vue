<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb>
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-card>
             <!-- 搜索栏 -->
            <el-row :gutter="20">
                <el-col :span="8">
                <el-input placeholder="请输入内容"  clearable v-model="queryInfo.query"  @clear="getOrderlist" >
                    <el-button slot="append" icon="el-icon-search"  @click="getOrderlist"></el-button>
                </el-input>
                </el-col>
            </el-row>

            <!-- 订单数据列表 -->
            <el-table :data="orderlist" border stripe>
              <el-table-column type="index" label="#"></el-table-column>
              <el-table-column label="订单编号" prop="order_id"></el-table-column>
              <el-table-column label="订单价格" prop="order_price"></el-table-column>
              <el-table-column label="是否付款" prop="pay_status">
                    <template slot-scope="scope">
                      <el-tag type="danger" v-if="scope.row.pay_status === '0'">未付款</el-tag>
                      <el-tag type="primary" v-else>已付款</el-tag>
                     
                  </template>
              </el-table-column>
              <el-table-column label="是否发货" prop="is_send"></el-table-column>
              <el-table-column label="下单时间" prop="create_time">
                  <template slot-scope="scope">
                      {{scope.row.create_time | dataFormat}}
                  </template>
              </el-table-column>
              <el-table-column label="操作">
                  <template slot-scope="scope">
                      <el-button type="primary" size="mini"  icon="el-icon-edit" @click="editRess"></el-button>
                      <el-button type="success" size="mini"  icon="el-icon-location" @click="processon"></el-button>

                  </template>
              </el-table-column>
            </el-table>

            <!-- 分页列表 -->
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[3, 5, 10, 15]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total=" total">
            </el-pagination>

        </el-card>

        <!-- 修改地址的对话框 -->
        <el-dialog title="修改地址" :visible.sync="editRessDialogVisible"
        width="50%" @close="closeRess">
        <!-- 主体内容 -->
        <el-form :model="editRessForm" :rules="editRessFormRules" ref="editRessFormRef" label-width="100px" >
            <el-form-item label="省市区/县" prop="address1">
            <!-- 城市级联选择器 -->
                <el-cascader  v-model="editRessForm.address1" :options="cityData"
                  :props="{ expandTrigger: 'hover' }" >
               </el-cascader>
            </el-form-item>
            <el-form-item label="详细地址" prop="address2">
                <el-input v-model="editRessForm.address2"></el-input>
            </el-form-item>
        </el-form>
        <!-- 按钮区域 -->
        <span slot="footer" class="dialog-footer">
            <el-button @click="editRessDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editRessDialogVisible = false">确 定</el-button>
        </span>
        </el-dialog>

        <!-- 物流进度对话框 -->
        <el-dialog title="物流进度" :visible.sync="processDialogVisible" width="50%">
            <!-- 时间线 -->
             <el-timeline>
                <el-timeline-item
                v-for="(activity, index) in processData"
                :key="index"
                :timestamp="activity.time">
                {{activity.context}}
                </el-timeline-item>
            </el-timeline>
        </el-dialog>
    </div>
</template>
<script>
import cityData from './citydata.js'
import kuaidi from './kuaidi.js'

export default {
    data(){
        return {
               // 获取订单列表
            queryInfo: {
                query: '',
                pagenum: 1,
                pagesize: 8,
            },
            // 页数
            total:0,
            // 订单列表
            orderlist:[],
            // 控制修改对话框的显示与隐藏
            editRessDialogVisible: false,
            // 地址对象
            editRessForm:{
                address1:[],
                address2:''
            },
            // 地址的验证规则
            editRessFormRules:{
                address1:[
                     { required: true, message: "请选择地址", 
                  trigger: "blur" }
                ],
                address2:[
                      { required: true, message: "请输入详细地址", 
                  trigger: "blur" }
                ]
            },
            cityData,
            // 控制物流进度对话框的显示与隐藏
            processDialogVisible:false,
            processData:[]
        }
    },
    created(){
        this.getOrderlist()
    },
    methods:{
         async getOrderlist(){
             const {data: res} = await this.$http.get('orders',{params: this.queryInfo})
             if(res.meta.status !== 200){
                 return this.$message.error('获取订单列表失败')
             }
             this.orderlist = res.data.goods
             this.total = res.data.total
         },
        //  监听pagesize
         handleSizeChange(newSize){
           this.queryInfo.pagesize = newSize
           this.getOrderlist()
         },
        //  监听pagenum
        handleCurrentChange(newNum){
            this.queryInfo.pagenum = newNum
            this.getOrderlist() 
        },
        // 修改按钮
        editRess(){
            this.editRessDialogVisible = true
        },
        closeRess(){
            this.$refs.editRessFormRef.resetFields()
        },
        // 物流进度
        async processon(){
            // const {data: res} = await this.$http.get('/kuaidi/804909574412544580')
            // if(res.meta.status !== 200){
            //     return this.$message.error('获取物流信息失败')
            // }
            this.processData = kuaidi.data
            console.log(this.processData)
            this.processDialogVisible = true
        }

    }
}
</script>
<style lang="scss" scoped>
.el-cascader{
    width: 100%;
}
</style>