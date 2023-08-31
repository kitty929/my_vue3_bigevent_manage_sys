import request from '@/utils/request'

// 注册接口
export const userRegisterService = ({ username, password, repassword }) => {
  return request.post('/api/reg', { username, password, repassword })
}

// 登录接口
export const userLoginService = ({ username, password }) => {
  return request.post('/api/login', { username, password })
}

// 获取用户信息接口
export const userGetInfoService = () => request.get('/my/userinfo')

// 更新个人信息
export const userUpdateInfoService = ({ id, nickname, email }) => {
  return request.put('/my/userinfo', { id, nickname, email })
}

// 更换头像
export const userUploadAvatarService = (avatar) => {
  return request.patch('/my/update/avatar', { avatar })
}

// 修改密码
export const userUpdatePassService = ({ old_pwd, new_pwd, re_pwd }) =>
  request.patch('/my/updatepwd', { old_pwd, new_pwd, re_pwd })
