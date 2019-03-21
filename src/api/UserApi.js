/**
 * 认证用户相关操作统一管理
 */
import request from '../common/request'
import {Notice} from  'iview'
import AuthenticationApi from './AuthenticationApi'
import qs from  'qs'

const user = {

  /**
   * 请求邮箱验证码
   */
  mailCode(email,type){
    return request({
      url:'/user/request_mail',
      method:'get',
      params:{
        value:email,
        type:type
      }
    }).then(res=>{
      console.log("发送邮件输出:",res);
      if (res.data.data){
        Notice.success({
          title:'邮件发送成功',
          desc:'邮件已成功发送，请注意查收'
        })
      }
    })
  },


  /**
   * 获取用户信息（不包括密码等重要隐私信息）
   */
  getUserInfo(openID){
    return request({
      url: '/user/getUserInfo',
      method: 'get',
      params: {
        openID:openID,
      }
    }).then( async res => {
      if (res.data.code === '404') {
        return null;
      }else{
        return res.data.data;
      }
    })
  },

  /**
   * 保存修改后的我的个人信息
   */
  updateUserInfo(userInfo) {
    return request({
      url:'/user/updateUserInfo',
      method:'post',
      data:qs.stringify({
        nickname:userInfo.nickname,
        wishCard:userInfo.wishCard,
        gender:userInfo.gender,
        myDescribe:userInfo.myDescribe
      })
    }).then( async res => {
      if (res.data.code === '200') {
        return true;
      } else if (res.data.code === '402') {
        const result = await AuthenticationApi.getToken();
        if (result)
          return this.updateUserInfo(userInfo);
        else
          return null;
      } else {
        return res.data.data;
      }
    })
  },

  /**
   * 用户更换头像,需要验证
   */
  updateUserIcon(formData){
    return request({
      url:'user/updateUserIcon',
      method:'post',
      data:formData,  //上传的为文件类型，不需要qs格式化
    }).then( async res => {
      console.log("updateUserIcon 输出res :", res);
      if (res.data.code === '402') {
        const result = await AuthenticationApi.getToken();
        if (result)
          return this.updateUserIcon(formData);
        else
          return null;
      }else {
        return res.data.data;
      }
    })
  },

  /**
   * 用户点击关注按钮，根据按钮点击前的状态，判断是执行新增关注还是取消关注
   */
  clickMark(openID,aim_openID,executeType){
    return request({
      url:'user/clickMark',
      method:"post",
      data:qs.stringify({
        openID:openID,
        aim_openID:aim_openID,
        executeType:executeType
      })
    }).then( res =>{
      return res.data.data;
    })
  },

  //获取请求用户对该目标用户的关注状态
  getMarkStatus(openID,aim_openID) {
    return request({
      url:'user/getMarkStatus',
      method:"get",
      params:{
        openID:openID,
        aim_openID:aim_openID,
      }
    }).then( res =>{
      return res.data.data;
    });
  },

};

export default user
