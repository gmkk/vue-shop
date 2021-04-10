<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色 -->
      <el-button type="primary" @click="addDialogVisible = true">添加角色</el-button>
      <!-- 主体内容 -->
      <el-table :data="roleslist" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeItemByid(scope.row,item1.id)">{{ item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二三级权限 -->
              <el-col :span="19">
                <el-row
                  :class="[i2 === 0 ? '':'bdtop', 'vcenter']"
                  v-for="(item2,i2) in item1.children"
                  :key="item2.id"
                >
                  <!-- 二级权限 -->
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeItemByid(scope.row,item2.id)"
                    >{{ item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级权限 -->
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="(item3) in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeItemByid(scope.row,item3.id)"
                    >{{ item2.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 修改 -->
            <el-tooltip effect="dark" content=" 修改" placement="top-start">
              <el-button type="primary" icon="el-icon-edit" @click="editDialog(scope.row.id)">修改</el-button>
            </el-tooltip>
            <!-- 删除 -->
            <el-tooltip effect="dark" content="删除 " placement="top-start">
              <el-button type="danger" icon="el-icon-delete" @click="deleteUser(scope.row.id)">删除</el-button>
            </el-tooltip>
            <!-- 分配角色 -->
            <el-tooltip effect="dark" content="分配角色" placement="top-start" :enterable="false">
              <el-button
                type="warning"
                icon="el-icon-setting"
                @click="setRightDialog(scope.row)"
              >分配角色</el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加角色 -->
    <el-dialog title="添加角色" :visible.sync="addDialogVisible" width="40%" @close="addDialogClose">
      <!-- 主体内容 -->
      <el-form :model="addForm" :rules="addFormrules" ref="addFormRef" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改角色 -->
    <el-dialog title="修改角色" :visible.sync="editDialogVisible" width="40%" @close="editDialogClose">
      <!-- 主体内容 -->
      <el-form :model="editForm" :rules="editFormrules" ref="editFormRef" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="setRightdialogVisible"
      @close="setRightdialogclose"
      width="40%"
    >
      <!-- 树形控件主体内容 -->
      <el-tree
        :data="rightlist"
        :props="treeProps"
        show-checkbox
        default-expand-all
        node-key="id"
        :default-checked-keys="defaultkeys"
        ref="treeRef"
      ></el-tree>
      <!-- 按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightdialogVisible= false">取 消</el-button>
        <el-button type="primary" @click="getAllRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 角色数据
      roleslist: [],
      // 控制添加角色按钮
      addDialogVisible: false,
      // 添加角色数据
      addForm: {
        roleName: '',
        roleDesc: '',
      },
      // 添加角色规则
      addFormrules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' },
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' },
        ],
      },
      // 控制修改角色按钮
      editDialogVisible: false,
      // 修改角色数据
      editForm: {
        roleName: '',
        roleDesc: '',
      },
      // 添加角色规则
      editFormrules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' },
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          { min: 0, max: 8, message: '长度在 0 到 8 个字符', trigger: 'blur' },
        ],
      },
      // 控制分配权限的开关
      setRightdialogVisible: false,
      rightlist: [],
      treeProps: {
        children: 'children',
        label: 'authName',
      },
      defaultkeys: [],
      // 当前即将分配权限的id
      roleId: '',
    }
  },
  created() {
    // 角色函数
    this.RolesList()
  },
  methods: {
    // 获取角色数据
    async RolesList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        this.$message.error('角色列表获取失败')
      }
      this.roleslist = res.data
      console.log(res)
    },
    //  监听添加角色对话框的关闭
    addDialogClose() {
      this.$refs.addFormRef.resetFields()
    },
    //  添加角色
    addUser() {
      this.$refs.addFormRef.validate(async (vaild) => {
        if (!vaild) return
        // 发起请求
        const { data: res } = await this.$http.post('roles', this.addForm)
        if (res.meta.status !== 201) {
          this.$message.error('创建角色失败')
        }
        this.$message.success('创建角色成功')
        this.addDialogVisible = false
        this.RolesList()
      })
    },
    // 查询用户信息
    async editDialog(id) {
      const { data: res } = await this.$http.get('roles/' + id)
      if (res.meta.status !== 200) {
        this.$message.error('查询用户信息失败')
      }
      console.log(res)
      this.editFrom = res.data
      this.editDialogVisible = true
    },
    //  监听修改角色对话框的关闭
    editDialogClose() {
      this.$refs.editFormRef.resetFields()
    },
    //  修改角色
    editUser() {
      this.$refs.editFormRef.validate(async (vaild) => {
        if (!vaild) return
        // 发起请求
        const { data: res } = await this.$http.put(
          'roles/' + this.editForm.id,
          this.editForm
        )
        if (res.meta.status !== 200) {
          this.$message.error('修改角色失败')
        }
        this.$message.success('修改角色成功')
        this.editDialogVisible = false
        this.RolesList()
      })
    },
    //删除角色
    async deleteUser(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)
      if (confirmResult !== 'confirm') {
        this.$message.info('已取消删除')
      } else {
        const { data: res } = await this.$http.delete('roles/' + id)
        if (res.meta.status !== 200) {
          this.$message.error('删除失败')
        }
        this.$message.success('删除成功')
        this.RolesList()
      }
    },
    // 删除三级权限
    async removeItemByid(role, rightId) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)
      if (confirmResult !== 'confirm') {
        this.$message.info('已取消删除')
      } else {
        const { data: res } = await this.$http.delete(
          `roles/${role.id}/rights/${rightId}`
        )
        if (res.meta.status !== 200) {
          this.$message.error('删除权限失败')
        }
        role.children = res.data
        // this.RolesList()
      }
    },
    // 控制分配权限的开关
    async setRightDialog(role) {
      // 请求权限树状数据
      this.roleId = role.id
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        this.$message.error('获取权限数据失败')
      }
      this.rightlist = res.data
      console.log(this.rightlist)

      //获取三级节点的id
      this.getdefaultkeys(role, this.defaultkeys)
      this.setRightdialogVisible = true
    },
    //通过递归的形式，获取角色下所有的三级权限id，并保存到defkeys数组中
    getdefaultkeys(node, arr) {
      //  如果当前node节点不包含
      //  children属性，则是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach((item) => this.getdefaultkeys(item, arr))
    },
    //每次清空权限
    setRightdialogclose() {
      this.defaultkeys = []
    },
    async getAllRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ]
      const idStr = keys.join(',')
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        { rids: idStr }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('更新权限失败')
      }
      this.$message.success('更新权限成功！')
      this.RolesList()
      this.setRightdialogVisible = false
    }
  },
}
</script>
<style lang="scss" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>