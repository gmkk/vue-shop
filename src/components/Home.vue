<template>
  <el-container class="home_container">
    <!-- 头部 -->
    <el-header>
      <div>
        <img src="../assets/logo.jpg" alt />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="loginout">退出</el-button>
    </el-header>
    <!-- 主体 -->
    <el-container>
      <!-- 侧边 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="nav" @click="changecollapse">|||</div>
        <!-- 侧边栏菜单 -->
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409BFF"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
          <!-- 一级菜单 -->
          <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/' + subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="isactivePath('/' + subItem.path)"
            >
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu no-active"></i>
                <!-- 文本 -->
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 中心 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      menulist: [],
      iconObj: {
        125: 'iconfont icon-ziyuan',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-suo',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao',
      },
      isCollapse: false,
      activePath: '',
    }
  },
  created() {
    this.getMenuList(),
      (this.activePath = window.sessionStorage.getItem('activePath'))
  },
  methods: {
    loginout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menulist = res.data
      console.log(res)
    },

    changecollapse() {
      this.isCollapse = !this.isCollapse
    },
    // 高亮显示
    isactivePath(activePath) {
      window.sessionStorage.setItem('activePath', activePath),
        (this.activePath = activePath)
    }
  },
}
</script>
<style lang="scss" scoped>
.home_container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 5px;
  align-items: center;
  div {
    display: flex;
    align-items: center;
    span {
      color: white;
      margin-left: 10px;
    }
    img {
      width: 61px;
      height: 60px;
      border-radius: 50%;
    }
  }
}
.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}

.el-main {
  background-color: #eaedf1;
}
.iconfont {
  margin-right: 10px;
}
.nav {
  background-color: #4a5064;
  font-size: 14px;
  color: white;
  height: 24px;
  line-height: 24px;
  text-align: center;
  letter-spacing: 0.2em;
}
</style>