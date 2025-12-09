// pages/index/index.js
Page({
  data: {
    motto: '晓医智能导诊',
    subtitle: '精准分诊 · 便捷就医',
    features: [
      {
        id: 1,
        icon: '🔊',
        title: '语音分诊',
        desc: '说话就能描述症状',
        color: '#2a8ce5',
        bgColor: '#e8f4ff'
      },
      {
        id: 2,
        icon: '👤',
        title: '人体图示',
        desc: '点选身体部位选择症状',
        color: '#34c759',
        bgColor: '#e8f8f0'
      },
      {
        id: 3,
        icon: '🧭',
        title: '院内导航',
        desc: '图文指引快速找到科室',
        color: '#ff9500',
        bgColor: '#fff4e6'
      },
      {
        id: 4,
        icon: '📋',
        title: '就诊流程',
        desc: '全流程陪伴式就医指导',
        color: '#af52de',
        bgColor: '#f5e8ff'
      }
    ],
    quickSymptoms: ['头痛', '发热', '咳嗽', '腹痛', '头晕', '恶心'],
    emergencyNotice: {
      show: true,
      title: '紧急提示',
      content: '如有胸痛、呼吸困难、大出血等紧急情况，请立即前往急诊科！'
    }
  },

  onLoad() {
    console.log('首页加载');
    this.checkLoginStatus();
  },

  onShow() {
    // 每次显示页面时检查是否有历史记录
    this.checkHistory();
  },

  // 检查登录状态
  checkLoginStatus() {
    const token = wx.getStorageSync('token');
    if (token) {
      console.log('用户已登录');
    } else {
      console.log('用户未登录，使用游客模式');
    }
  },

  // 检查历史记录
  checkHistory() {
    const history = wx.getStorageSync('diagnosisHistory') || [];
    if (history.length > 0) {
      this.setData({
        hasHistory: true,
        latestHistory: history[0]
      });
    }
  },

  // 开始智能分诊
  startTriage() {
    wx.navigateTo({
      url: '/pages/triage/triage'
    });
  },

  // 快速症状选择
  quickStart(e) {
    const symptom = e.currentTarget.dataset.symptom;
    wx.navigateTo({
      url: `/pages/triage/triage?quickSymptom=${symptom}`
    });
  },

  // 功能模块点击
  featureTap(e) {
    const id = e.currentTarget.dataset.id;
    const urls = {
      1: '/pages/triage/triage?mode=voice',  // 语音分诊
      2: '/pages/triage/triage?mode=body',   // 人体图示
      3: '/pages/navigation/navigation',     // 院内导航
      4: '/pages/process/process'            // 就诊流程
    };
    
    wx.navigateTo({
      url: urls[id]
    });
  },

  // 查看历史记录
  viewHistory() {
    wx.navigateTo({
      url: '/pages/mine/mine'
    });
  },

  // 关闭紧急提示
  closeEmergencyNotice() {
    this.setData({
      'emergencyNotice.show': false
    });
  },

  // 分享小程序
  onShareAppMessage() {
    return {
      title: '晓医智能导诊 - 精准分诊，便捷就医',
      path: '/pages/index/index'
    };
  }
});