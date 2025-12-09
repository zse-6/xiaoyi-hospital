// app.js - 小程序入口文件
App({
  onLaunch: function () {
    console.log('晓医小程序启动');
    
    // 初始化云开发（暂时注释，需要你的云环境ID）
    // wx.cloud.init({
    //   env: 'YOUR-CLOUD-ENV-ID', // 需要替换为你的云环境ID
    //   traceUser: true
    // });
    
    // 获取系统信息
    wx.getSystemInfo({
      success: res => {
        this.globalData.systemInfo = res;
        console.log('系统信息:', res);
      }
    });
  },
  
  globalData: {
    userInfo: null,
    systemInfo: null,
    diagnosisHistory: [],
    currentHospital: null
  }
});