import request from '../utils/request'

export default {
    // 登录接口
    login(params) {
        return request({
            url: '/users/login',
            method: 'post',
            data: params,
            mock: false
        })
    },
    // 消息提醒接口
    noticeCount() {
        return request({
            url: '/leave/count',
            method: 'get',
            data: {},
            mock: true
        })
    },
    // 菜单列表接口
    menuList() {
        return request({
            url: '/menu/list',
            method: 'get',
            data: {},
            mock: false
        })
    },
    // 查询所有用户接口
    userList(params) {
        return request({
            url: '/users/list',
            method: 'get',
            data: params,
            mock: false
        })
    },
    // 删除用户接口（修改状态）
    userDelete(params) {
        return request({
            url: '/users/delete',
            method: 'post',
            data: params,
            mock: false
        })
    },
    // 查询角色名称接口
    RoleNameList() {
        return request({
            url: '/roles/allList',
            method: 'get',
            data: {},
            mock: false
        })
    },
    // 查询所有部门
    DeptList() {
        return request({
            url: '/dept/list',
            method: 'get',
            data: {},
            mock: true
        })
    },
    // 新增和编辑用户接口
    userSubmit(params) {
        return request({
            url: '/users/operate',
            method: 'post',
            data: params,
            mock: false
        })
    },
    // 新增和编辑菜单接口
    menuSubmit(params) {
        return request({
            url: '/menu/operate',
            method: 'post',
            data: params,
            mock: false
        })
    },
    // 查询角色接口
    roleList(params) {
        return request({
            url: '/roles/list',
            method: 'get',
            data: params,
            mock: false
        })
    },
     // 新增和编辑角色接口
     roleOperate(params) {
        return request({
            url: '/roles/operate',
            method: 'post',
            data: params,
            mock: false
        })
    },
     // 设置权限角色接口
     roleUpdatePermission(params) {
        return request({
            url: '/roles/update/permission',
            method: 'post',
            data: params,
            mock: false
        })
    },
    
}


