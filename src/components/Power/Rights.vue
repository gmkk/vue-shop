<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <el-table :data="rightlist" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="authName" label="权限名称"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level == '0'">等级一</el-tag>
            <el-tag type="success" v-else-if="scope.row.level == '1'">等级二</el-tag>
            <el-tag type="warning" v-else>等级三</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      rightlist: [],
    }
  },
  created() {
    this.getRightList()
  },
  methods: {
    async getRightList() {
      const { data: res } = await this.$http.get('rights/list')
      if (res.meta.status !== 200) {
        this.$message.error('获取权限列表失败')
      }
      this.rightlist = res.data
      // console.log(res)
    }
  },
}
</script>
<style lang="scss" scoped>
</style>