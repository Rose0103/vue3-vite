<script>
import utils from "../utils/utils";
export default {
  name: "Role",
  data() {
    return {
      role: {
        roleName: "",
      },
      roleList: [],
      columns: [
        {
          label: "角色名称",
          prop: "roleName",
        },
        {
          label: "备注",
          prop: "remark",
        },
        {
          label: "权限列表",
          prop: "permissionList",
          formatter: (row, column, value) => {
            let names = [];
            let list = value.halfCheckedKeys || [];
            list.map((key) => {
              let _name = this.actionMap[key];
              if (key && _name) names.push(_name);
            });
            return names.join(",");
          },
        },
        {
          label: "更新时间",
          prop: "updateTime",
          formatter(row, column, value) {
            return utils.formateDate(new Date(value));
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
      roleForm: {},
      rulesForm: {
        roleName: [
          { required: true, message: "请输入角色的名称", trigger: "blur" },
          { min: 2, max: 10, message: "长度在2-8个字符", trigger: "blur" },
        ],
      },
      pager: {
        total: 0,
        pageNum: 1,
        pageSize: 10,
      },
      action: "create",
      showModel: false,
      showPermission: false,
      curRoleId: null,
      curRoleName: "",
      menuList: [],
      // 权限键值对映射
      actionMap: {},
    };
  },
  mounted() {
    this.getRoleList();
    this.getMenuList();
  },
  methods: {
    async getRoleList() {
      const { list, page } = await this.$api.roleList({
        ...this.role,
        ...this.pager,
      });
      this.pager.total = page.total;
      this.roleList = list;
    },
    async getMenuList() {
      let list = await this.$api.menuList();
      this.menuList = list;
      this.getActionMap(list);
    },
    // 重置按钮
    handleReset(form) {
      this.$refs[form].resetFields();
    },
    // 角色新增
    handleAdd() {
      this.action = "create";
      this.showModel = true;
    },
    // 角色编辑
    handleEdit(row) {
      this.showModel = true;
      this.action = "edit";
      this.$nextTick(() => {
        Object.assign(this.roleForm, {
          _id: row._id,
          roleName: row.roleName,
          remark: row.remark,
        });
      });
    },
    async handleDelete(_id) {
      await this.$api.roleOperate({ _id, action: "delete" });
      this.$message.success("删除成功");
      this.getRoleList();
    },
    handleCurrentChange(page) {
      this.pager.pageNum = page;
      this.getRoleList();
    },
    handleColseDialog() {},
    // 关闭弹窗
    handleColse() {
      this.handleReset("dialogForm");
      this.showModel = false;
    },
    // 角色提交
    handleSubmit() {
      this.$refs.dialogForm.validate(async (valid) => {
        if (valid) {
          let { roleForm, action } = this;
          let params = { ...roleForm, action };
          let res = await this.$api.roleOperate(params);
          if (res) {
            this.showModel = false;
            this.$message.success("操作成功");
            this.handleReset("dialogForm");
            this.getRoleList();
          }
        }
      });
    },
    handleColseDialog() {},
    // 设置权限按钮
    handleOpenPermission(row) {
      this.curRoleId = row._id;
      this.curRoleName = row.roleName;
      this.showPermission = true;
      let { checkedKeys } = row.permissionList;
      // 赋值节点选择
      this.$nextTick(() => {
        this.$refs.premissionTree.setCheckedKeys(checkedKeys);
      });
    },
    // 设置权限确定按钮操作
    async handlePermissionSubmit() {
      let nodes = this.$refs.premissionTree.getCheckedNodes(); //获取选中的节点
      let halfKeys = this.$refs.premissionTree.getHalfCheckedKeys(); //获取半选中的节点
      let checkedKeys = []; //选中的按钮数组
      let checkedhalfKeys = []; //选中的父级
      nodes.map((node) => {
        if (!node.children) {
          checkedKeys.push(node._id);
        } else {
          checkedhalfKeys.push(node._id);
        }
      });
      let params = {
        _id: this.curRoleId,
        permissionList: {
          checkedKeys,
          halfCheckedKeys: checkedhalfKeys.concat(halfKeys),
        },
      };
      await this.$api.roleUpdatePermission(params);
      this.showPermission = false;
      this.$message.success("操作成功");
      this.getRoleList();
    },
    getActionMap(list) {
      let actionMap = {};
      const deep = (arr) => {
        while (arr.length) {
          let item = arr.pop();
          if (item.children && item.action) {
            actionMap[item._id] = item.menuName;
          }
          if (item.children && !item.action) {
            deep(item.children);
          }
        }
      };
      deep(JSON.parse(JSON.stringify(list)));
      this.actionMap = actionMap;
    },
  },
};
</script>

<template>
  <div class="role-manage">
    <div class="query-form">
      <el-form :inline="true" :model="role" ref="form">
        <el-form-item label="角色名称:" prop="roleName">
          <el-input
            v-model="role.roleName"
            placeholder="请输入角色名称"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getRoleList">查询</el-button>
          <el-button @click="handleReset('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleAdd">创建</el-button>
      </div>
      <el-table :data="roleList" style="width: 100%" row-key="_id">
        <el-table-column
          v-for="item in columns"
          :prop="item.prop"
          :label="item.label"
          :key="item.prop"
          :width="item.width"
          :formatter="item.formatter"
        />
        <el-table-column label="操作" width="250">
          <template #default="scope">
            <el-button
              type="primary"
              size="mini"
              @click="handleOpenPermission(scope.row)"
            >
              设置权限
            </el-button>
            <el-button size="mini" @click="handleEdit(scope.row)">
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
      <el-pagination
        background
        layout="prev, pager, next"
        :total="pager.total"
        class="pagination"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </div>

    <el-dialog
      :title="action == 'create' ? '创建角色' : '编辑角色'"
      v-model="showModel"
      :before-close="handleColseDialog"
    >
      <el-form
        :model="roleForm"
        ref="dialogForm"
        label-width="100px"
        :rules="rulesForm"
      >
        <el-form-item prop="roleName" label="角色名称">
          <el-input placeholder="请输入角色名称" v-model="roleForm.roleName" />
        </el-form-item>
        <el-form-item prop="remark" label="备注">
          <el-input
            placeholder="请输入备注"
            type="textarea"
            :row="2"
            v-model="roleForm.remark"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleColse">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 权限弹窗 -->
    <el-dialog title="设置权限" v-model="showPermission">
      <el-form label-width="100px">
        <el-form-item label="角色名称">
          {{ curRoleName }}
        </el-form-item>
        <el-form-item label="选择权限">
          <el-tree
            ref="premissionTree"
            :data="menuList"
            show-checkbox
            node-key="_id"
            default-expand-all
            :props="{ label: 'menuName' }"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showPermission = false">取消</el-button>
          <el-button type="primary" @click="handlePermissionSubmit"
            >确定</el-button
          >
        </span>
      </template>
    </el-dialog>
    <!-- 权限弹窗 -->
  </div>
</template>
<style lang="scss" scope>
</style>