<script>
import { onMounted, reactive, getCurrentInstance, ref, toRaw } from "vue";
import utils from '../utils/utils'
export default {
  name: "User",
  setup() {
    // 获取全局对象 类似于 options api 里面的this
    const { proxy } = getCurrentInstance();
    //生命周期函数
    onMounted(() => {
      getUserList();
      getRoleNameList();
      getdeptList();
    });
    // 查找的数据
    const user = reactive({
      state: 0,
    });
    // 用户列表
    const userList = reactive({
      arr: [],
    });
    // 表格的列的配置
    const columns = reactive([
      {
        label: "用户ID",
        prop: "userId",
      },
      {
        label: "用户名",
        prop: "userName",
      },
      {
        label: "用户邮箱",
        prop: "userEmail",
      },
      {
        label: "用户角色",
        prop: "role",
        formatter(row, column, value) {
          return {
            0: "管理员",
            1: "普通用户",
          }[value];
        },
      },
      {
        label: "用户状态",
        prop: "state",
        formatter(row, column, value) {
          return {
            1: "在职",
            2: "离职",
            3: "试用期",
          }[value];
        },
      },
      {
        label: "注册时间",
        prop: "createTime",
        formatter(row,column,value) {
            return utils.formateDate(new Date(value))
        }
      },
      {
        label: "最后登录时间",
        prop: "lastLoginTime",
        formatter(row,column,value) {
            return utils.formateDate(new Date(value))
        }
      },
    ]);
    // 分页的配置
    const pager = reactive({
      pageNum: 1,
      pageSize: 10,
      total: 10,
    });
    // 获取用户列表
    const getUserList = async () => {
      let params = { ...user, ...pager };
      const { page, list } = await proxy.$api.userList(params);
      pager.total = page.total;
      userList.arr = list;
    };
    // 查找功能
    const handleQuery = () => {
      getUserList();
    };
    // 重置功能
    const handleReset = (form) => {
      proxy.$refs[form].resetFields();
       getUserList();
    };
    // 分页
    const handleCurrentChange = (current) => {
      pager.pageNum = current;
      getUserList();
    };
    // 用户单个删除
    const handleDelete = async (row) => {
      const res = await proxy.$api.userDelete({
        userIds: [row.userId],
      });
      if (res.modifiedCount > 0) {
        proxy.$message.success("删除成功");
        getUserList();
      } else {
        proxy.$message.error("删除失败");
      }
    };
    const checkedUsersIds = ref([]);
    // 用户批量删除
    const handlePatchDelete = async () => {
      if (checkedUsersIds.value.length == 0) {
        proxy.$message.error("请选择要删除的用户");
        return;
      }

      const res = await proxy.$api.userDelete({
        userIds: checkedUsersIds.value,
      });
      if (res.modifiedCount > 0) {
        proxy.$message.success("删除成功");
        getUserList();
      } else {
        proxy.$message.error("删除失败");
      }
    };
    const handleSelectionChange = (list) => {
      let arr = [];
      list.forEach((ele) => {
        arr.push(ele.userId);
      });
      checkedUsersIds.value = arr;
    };

    const showModel = ref(false);
    // 新增
    const handleCreate = () => {
      action.value = "add";
      showModel.value = true;
    };
    const userForm = reactive({
      state: 1,
    });

    const rulesForm = reactive({
      userName: [
        {
          required: true,
          message: "请输入用户名称",
          trigger: "blur",
        },
      ],
      userEmail: [
        {
          required: true,
          message: "请输入用户邮箱",
          trigger: "blur",
        },
      ],
      deptId: [
        {
          required: true,
          message: "请输入部门",
          trigger: "blur",
        },
      ],
      mobile: [
        {
          pattern: /1[3-9]\d{9}/,
          required: true,
          message: "请输入正确的手机格式",
          trigger: "blur",
        },
      ],
    });

    //用户角色
    const roleList = ref([]);
    const getRoleNameList = async () => {
      const res = await proxy.$api.RoleNameList();
      roleList.value = res;
    };
    //用户角色
    const deptList = ref([]);
    const getdeptList = async () => {
      const res = await proxy.$api.DeptList();
      deptList.value = res;
    };
    //新增取消按钮
    const handleColse = () => {
      showModel.value = false;
      handleReset("dialogForm");
    };
    // 新增确定按钮
    const action = ref("add");
    const handleSubmit = () => {
      proxy.$refs.dialogForm.validate(async (valid) => {
        if (valid) {
          let params = toRaw(userForm);
          params.userEmail += "@gaolengleng.com";
          params.action = action.value;
          const res = await proxy.$api.userSubmit(params);
          if (res) {
            showModel.value = false;
            if(action.value == 'add') {
              proxy.$message.success("新增用户成功");
            }else {
              proxy.$message.success("编辑用户成功");
            }
            handleReset("dialogForm");
            getUserList();
          }
        }
      });
    };
    // 用户编辑
    const handleEdit = (row) => {
      action.value = "edit";
      showModel.value = true;
      proxy.$nextTick(() => {
        row.state = row.state - 0;
        Object.assign(userForm, row);
      });
    };

    // 弹窗右上角的×x
    const handleColseDialog = () => {
      showModel.value = false;
      handleReset("dialogForm")
    }

    return {
      user,
      userList,
      columns,
      handleQuery,
      handleReset,
      pager,
      handleCurrentChange,
      handleDelete,
      handlePatchDelete,
      checkedUsersIds,
      handleSelectionChange,
      handleCreate,
      showModel,
      userForm,
      rulesForm,
      getRoleNameList,
      roleList,
      deptList,
      getdeptList,
      handleColse,
      handleSubmit,
      handleEdit,
      action,
      handleColseDialog
    };
  },
};
</script>

<template>
  <div class="user-manage">
    <div class="query-form">
      <el-form :inline="true" :model="user" ref="form">
        <el-form-item label="用户ID:" prop="userId">
          <el-input v-model="user.userId" placeholder="请输入用户ID"></el-input>
        </el-form-item>
        <el-form-item label="用户名:" prop="userName">
          <el-input
            v-model="user.userName"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户状态:" prop="state">
          <el-select v-model="user.state" placeholder="请选择">
            <el-option :value="0" label="所有"></el-option>
            <el-option :value="1" label="在职"></el-option>
            <el-option :value="2" label="离职"></el-option>
            <el-option :value="3" label="试用期"></el-option>
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
        <el-button type="primary" @click="handleCreate">新增</el-button>
        <el-button type="danger" @click="handlePatchDelete">批量删除</el-button>
      </div>
      <el-table
        :data="userList.arr"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column
          v-for="item in columns"
          :prop="item.prop"
          :label="item.label"
          :key="item.prop"
          :width="item.width"
          :formatter="item.formatter"
        />
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button
              type="primary"
              size="mini"
              @click="handleEdit(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              type="danger"
              size="mini"
              @click="handleDelete(scope.row)"
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

    <el-dialog :title="action == 'add' ? '用户新增' : '用户编辑'" v-model="showModel"  :before-close="handleColseDialog">
      <el-form
        :model="userForm"
        ref="dialogForm"
        label-width="100px"
        :rules="rulesForm"
      >
        <el-form-item prop="userName" label="用户名">
          <el-input
            placeholder="请输入用户名"
            v-model="userForm.userName"
            :disabled="action == 'edit'"
          />
        </el-form-item>
        <el-form-item prop="userEmail" label="邮箱">
          <el-input
            placeholder="请输入邮箱"
            v-model="userForm.userEmail"
            :disabled="action == 'edit'"
          >
            <template #append> @gaolengleng.com </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="mobile" label="手机号码">
          <el-input placeholder="请输入手机号码" v-model="userForm.mobile" />
        </el-form-item>
        <el-form-item prop="job" label="岗位">
          <el-input placeholder="请输入岗位" v-model="userForm.job" />
        </el-form-item>
        <el-form-item prop="state" label="状态">
          <el-select v-model="userForm.state" placeholder="请选择">
            <el-option :value="1" label="在职"></el-option>
            <el-option :value="2" label="离职"></el-option>
            <el-option :value="3" label="试用期"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="roleList" label="系统角色">
          <el-select
            v-model="userForm.roleList"
            placeholder="请选择用户系统角色"
            multiple
            style="width: 100%"
          >
            <el-option
              v-for="role in roleList"
              :key="role._id"
              :value="role._id"
              :label="role.roleName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="deptId" label="部门">
          <el-cascader
            v-model="userForm.deptId"
            placeholder="请选择部门"
            :options="deptList"
            :props="{ checkStrictly: true, value: '_id', label: 'deptName' }"
            clearable
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
  </div>
</template>
<style lang="scss" scope>
</style>