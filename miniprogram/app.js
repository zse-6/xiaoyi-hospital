App({
  onLaunch() {
    // 初始化云开发环境
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        env: 'cloud1-7g8bdxuy3b74f5b2', // 替换为你之前记下来的云环境ID（如cloud1-xxxxxxx）
        traceUser: true, // 跟踪用户行为（匿名化，符合隐私保护）
      });
    }

    this.globalData = {
      userInfo: null,
      cloudEnv: 'cloud1-7g8bdxuy3b74f5b2D' 
    };
  },
  globalData: {}
});