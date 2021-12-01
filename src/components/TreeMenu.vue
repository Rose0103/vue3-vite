<template>
    <div v-for="menu in userMenu">
        <el-sub-menu 
            v-if="menu.children && menu.children.length > 0 && menu.children[0].menuType == 1 "
            :key="menu._id"
            :index="menu.path"
        >
          <template #title>
            <el-icon :size='20'><i-menu /></el-icon>
            <span :class="['menu-title', isCollapse ? 'shows' : 'hides']">{{menu.menuName}}</span>
          </template>
          <tree-menu :userMenu="menu.children"></tree-menu>
        </el-sub-menu>
        <el-menu-item v-else-if="menu.menuType == 1" :key="menu._id"  :index="menu.path">{{menu.menuName}}</el-menu-item>
    </div>
</template>

<script>
export default {
    name: "TreeMenu",
    props: {
        userMenu: {
            type: Array,
            default() {
                return [];
            }
        },
        isCollapse: {
            type: Boolean,
            default() {
                return false
            }
        }
    }
}
</script>
<style lang="scss" scoped>
    .menu-title {
        &.shows {
            display: none;
        }
    }
    
</style>