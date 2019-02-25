/**
 * 角色权限相关统一管理
 */
import request from '../common/request'
import {Notice} from 'iview'
import router from '../router/router'
import store from '../blog_vuex/store'



const authentication = {

  //用户注册请求
  register(username,password,email,emailCode) {
    return request({
        url: '/Authentication/register',
        method: 'post',
        data:{
          username: username,//用户名
          password: password,//密码
          userMail: email,//绑定邮箱
          MailVerificationCode: emailCode//邮箱验证码
        }
    }).then(res =>{
      if (res.data.code === '200'){
        console.log("register : ",res);
        console.log("register openID",res.data.data.openID);
        const userInfo = {
          openID: res.data.data.openID,
          nickname: res.data.data.nickname,
          avatar: res.data.data.avatar,
          token: res.data.data.token,
        };
        store.dispatch("saveLoginInfo",userInfo);
        router.push({name:'index'});
      }else {
        console.log("register else info :",res)
      }
    })
  },

  //登录请求
  login(username,password) {
    return request({
      url: '/Authentication/login',
      method: 'post',
      data: {
        username: username,
        password: password,
      }
    }).then(response => {
      if (response.data.code === '200') { //登录成功
        const userInfo = {
          openID: response.data.data.openID,
          nickname: response.data.data.nickname,
          avatar: response.data.data.avatar,
          token: response.data.data.token,
        };
        store.dispatch("saveLoginInfo", userInfo);
        router.push({name: 'index'});
      }
    })
  },

  //注销请求，需要带token，但这个token并不用于验证，所以不需要判断402
  logout(){
   return request({
     url:'/Authentication/logout',
     method:"post",
    }).then(res =>{
      console.log("logout 返回的信息 ： ",res);
      if (res.data.code === '200'){
        console.log("登出成功");
        return 'success'
      }else{
        return 'fail'
      }
   })
  },


  //token过期，请求重新获取token,header中需要带上token，但同样不用于验证，不用判断402,失败返回405
  getToken(){
  return request({
      url:'/Authentication/getToken',
      method:'get',
    }).then(res=>{//这里不用考虑402
      if (res.data.code === '200'){
        console.log("getToken 刷新成功 输出：",res);
        localStorage.setItem("token",res.data.data); //保存刷新后的token到本地
        return true;
      }else{ //token刷新失败（405）,已在拦截器中做处理,跳转到登录页面
        console.log("getToken else info：",res);
        return false;
      }
    });
  },


  //判断邮箱是否可用（已注册）
  isExist(email){
    return request({
      url:'/Authentication/isExist',
      method:'get',
      params:{
        username:email,
      }
    }).then( res =>{
      console.log("isExist : ",res);
      return res.data.code === '200';
    })
  },

};

export default authentication