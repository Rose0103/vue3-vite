<script>
import utils from "../utils/utils";
export default {
  name: "Menu",
  data() {
    return {
      menu: {
        menuState: 1,
      },
      menuList: [],
      columns: [
        {
          label: "菜单名称",
          prop: "menuName",
        },
        {
          label: "图标",
          prop: "icon",
        },
        {
          label: "菜单类型",
          prop: "menuType",
          formatter(row, column, value) {
            return {
              1: "菜单",
              2: "按钮",
            }[value];
          },
        },
        {
          label: "权限标识",
          prop: "menuCode",
        },
        {
          label: "路由地址",
          prop: "path",
        },
        {
          label: "组件路径",
          prop: "component",
        },
        {
          label: "菜单状态",
          prop: "menuState",
          formatter(row, column, value) {
            return {
              1: "正常",
              2: "停用",
            }[value];
          },
        },
        {
          label: "创建时间",
          prop: "createTime",
          formatter(row, column, value) {
            return utils.formateDate(new Date(value));
          },
        },
      ],
      menuForm: {
          menuType:1,
          menuState:1,
          parentId: [null]
      },
      action: "add",
      showModel:false,
      rulesForm: {
          menuName:
          [{required: true,message:'请输入菜单的名称',trigger: 'blur'},{min:2,max:10,message:'长度在2-8个字符',trigger:'blur'}]
      }
    };
  },
  mounted() {
    this.getMenuList();
  },
  methods: {
    // 获取全部菜单
    async getMenuList() {
      const res = await this.$api.menuList(this.menuForm);
      this.menuList = res;
    },
    handleQuery() {
        this.menuForm.menuState = this.menu.menuState;
        this.menuForm.menuName = this.menu.menuName;
        this.getMenuList()
    },
    handleReset(form) {
         this.$refs[form].resetFields();
    },
    handleAdd(type,row) {
        this.showModel = true;
        this.action = 'add';
        if(type == 2) {
            this.menuForm.parentId = [...row.parentId, row._id].filter((item)=> item)
        }
    },
    handleEdit(row) {
        this.showModel = true;
        this.action = 'edit';
        this.$nextTick(() => {
            Object.assign(this.menuForm,row)
        })
         this.getMenuList()
    },
    async handleDelete(_id) {
       await this.$api.menuSubmit({_id,action: 'delete'});
       this.$message.success('删除成功');
       this.getMenuList()
    },
    handleColse() {
        this.handleReset("dialogForm")
        this.showModel = false
    },
    handleSubmit() {
        this.$refs.dialogForm.validate(async (valid) => {
            if(valid) {
                let {action,menuForm} = this;
                let params = {...menuForm, action};
                let res = await this.$api.menuSubmit(params);
                if(res) {
                  this.showModel = false;
                  this.$message.success('操作成功');
                  this.handleReset('dialogForm');
                  this.getMenuList()
                }         
            }
        })
    },
    handleColseDialog(){
        this.handleReset("dialogForm")
        this.showModel = false
    }

  },
};
</script>

<template>
  <div class="user-manage">
    <div class="query-form">
      <el-form :inline="true" :model="menu" ref="form">
        <el-form-item label="菜单名称:" prop="menuName">
          <el-input
            v-model="menu.menuName"
            placeholder="请输入菜单名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户状态:" prop="menuState">
          <el-select v-model="menu.menuState" placeholder="请选择">
            <el-option :value="1" label="正常"></el-option>
            <el-option :value="2" label="停用"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="handleReset('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleAdd(1)">创建</el-button>
      </div>
      <el-table :data="menuList" style="width: 100%" row-key="_id">
        <el-table-column
          v-for="item in columns"
          :prop="item.prop"
          :label="item.label"
          :key="item.prop"
          :width="item.width"
          :formatter="item.formatter"
        />
        <el-table-column label="操作" width="220">
          <template #default="scope">
            <el-button type="primary" size="mini" @click="handleAdd(2,scope.row)">
              新增
            </el-button>
            <el-button
              size="mini"
              @click="handleEdit(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              type="danger"
              size="mini"
              @click="handleDelete(scope.row._id)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog
      :title="action == 'add' ? '新增菜单' : '编辑菜单'"
      v-model="showModel"
      :before-close="handleColseDialog"
    >
      <el-form
        :model="menuForm"
        ref="dialogForm"
        label-width="100px"
        :rules="rulesForm"
      >
        <el-form-item prop="parentId" label="父级菜单">
          <el-cascader
            v-model="menuForm.parentId"
            :options="menuList"
            :props="{ checkStrictly: true, value: '_id', label: 'menuName' }"
            clearable
          />
          <span>不选择则默认是创建一级菜单</span>
        </el-form-item>
        <el-form-item prop="menuType" label="菜单类型">
          <el-radio-group v-model="menuForm.menuType">
            <el-radio :label="1">菜单</el-radio>
            <el-radio :label="2">按钮</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="menuName" label="菜单名称">
          <el-input placeholder="请输入菜单名称" v-model="menuForm.menuName" />
        </el-form-item>
        <el-form-item prop="icon" label="菜单图标"  v-show="menuForm.menuType === 1">
          <el-input placeholder="请输入菜单图标" v-model="menuForm.icon" />
        </el-form-item>
        <el-form-item prop="path" label="路由地址"  v-show="menuForm.menuType === 1">
          <el-input placeholder="请输入路由地址" v-model="menuForm.path" />
        </el-form-item>
        <el-form-item prop="menuCode" label="权限标识" v-show="menuForm.menuType === 2">
          <el-input placeholder="请输入权限标识" v-model="menuForm.menuCode" />
        </el-form-item>
        <el-form-item prop="component" label="组件路径"  v-show="menuForm.menuType === 1">
          <el-input placeholder="请输入组件路径" v-model="menuForm.component" />
        </el-form-item>
         <el-form-item prop="menuState" label="菜单状态"  v-show="menuForm.menuType === 1">
          <el-radio-group v-model="menuForm.menuState">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="2">停用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleColse">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<style lang="scss" scope>
</style>