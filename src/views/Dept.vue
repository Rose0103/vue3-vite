<template>
  <div class="dept-manage">
    <div class="query-form">
      <el-form :inline="true" :model="dept" ref="form">
        <el-form-item label="角色名称:" prop="deptName">
          <el-input
            v-model="dept.deptName"
            placeholder="请输入角色名称"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getDeptList">查询</el-button>
          <el-button @click="handleReset('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleCreate">创建</el-button>
      </div>
      <el-table
        :data="deptList"
        default-expand-all
        style="width: 100%"
        row-key="_id"
        :tree-props="{ children: 'children' }"
        stripe
      >
        <el-table-column
          v-for="item in columns"
          :prop="item.prop"
          :label="item.label"
          :key="item.prop"
        />
        <el-table-column label="操作" width="250">
          <template #default="scope">
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
      :title="action == 'create' ? '创建部门' : '编辑部门'"
      v-model="showModel"
      :before-close="handleColseDialog"
    >
      <el-form
        :model="deptForm"
        ref="dialogForm"
        label-width="100px"
        :rules="rulesForm"
      >
        <el-form-item prop="parentId" label="上级部门">
          <el-cascader
            placeholder="请选择上级部门"
            v-model="deptForm.parentId"
            :options="deptList"
            :props="{ checkStrictly: true, value: '_id', label: 'deptName' }"
            :show-all-levels="true"
            clearable
          />
        </el-form-item>
        <el-form-item prop="deptName" label="部门名称">
          <el-input placeholder="请输入部门名称" v-model="deptForm.deptName" />
        </el-form-item>
        <el-form-item prop="user" label="负责人">
          <el-select
            v-model="deptForm.user"
            placeholder="请选择部门负责人"
            style="width: 100%"
            @change="handleUser"
          >
            <el-option
              v-for="item in userList"
              :key="item.userId"
              :label="item.userName"
              :value="`${item.userId}/${item.userName}/${item.userEmail}`"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="userEmail" label="负责人邮箱">
          <el-input v-model="deptForm.userEmail" disabled />
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

<script>
export default {
  name: "Dept",
  data() {
    return {
      dept: {
        deptName: "",
      },
      deptList: [],
      columns: [
        {
          label: "部门名称",
          prop: "deptName",
        },
        {
          label: "负责人",
          prop: "userName",
        },
        {
          label: "更新时间",
          prop: "updateTime",
        },
        {
          label: "创建时间",
          prop: "createTime",
        },
      ],
      pager: {
        total: 0,
        pageNum: 1,
        pageSize: 10,
      },
      action: "create",
      showModel: false,
      deptForm: {
        parentId: [null],
      },
      userList: [],
      rulesForm: {
        parentId: [
          { required: true, message: "请选择上级部门", trigger: "blur" },
        ],
        deptName: [
          { required: true, message: "请输入部门名称", trigger: "blur" },
        ],
        user: [{ required: true, message: "请选择负责人", trigger: "blur" }],
      },
    };
  },
  mounted() {
    this.getDeptList();
    this.getUserList();
  },
  methods: {
    async getDeptList() {
      let res = await this.$api.DeptList(this.dept);
      this.deptList = res;
    },
    handleReset(form) {
      this.$refs[form].resetFields();
    },
    handleCreate() {
      this.action = "create";
      this.showModel = true;
    },
    handleCurrentChange() {},
    handleEdit(row) {
      this.action = "edit";
      this.showModel = true;
      this.$nextTick(() => {
        Object.assign(this.deptForm, row, {
          user: `${row.userId}/${row.userName}/${row.userEmail}`,
        });
      });
    },
    async handleDelete(_id) {
      this.action = "delete";
      await this.$api.deptOperate({ _id, action: this.action });
      this.$message.success("删除成功");
      this.getDeptList();
    },
    handleColse() {
      this.showModel = false;
    },
    handleSubmit() {
      this.$refs.dialogForm.validate(async (valid) => {
        if (valid) {
          let params = { ...this.deptForm, action: this.action };
          delete params.user;
          await this.$api.deptOperate(params);
          this.showModel = false;
          this.$message.success("操作成功");
          this.handleColse();
          this.handleReset('dialogForm');
          this.getDeptList();
        }
      });
    },
    handleColseDialog() {},
    async getUserList() {
      this.userList = await this.$api.getAllUserList();
    },
    handleUser(val) {
      const [userId, userName, userEmail] = val.split("/");
      Object.assign(this.deptForm, { userId, userName, userEmail });
    },
  },
};
</script>
<style lang='' scoped>
</style>