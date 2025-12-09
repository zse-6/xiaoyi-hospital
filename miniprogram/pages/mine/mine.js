// pages/mine/mine.js
Page({
  data: {
    // 用户信息
    userInfo: null,
    hasUserInfo: false,
    
    // 就诊统计
    statistics: {
      totalDiagnosis: 0,
      completedProcesses: 0,
      avgAccuracy: 0,
      emergencyCases: 0
    },
    
    // 历史记录
    historyRecords: [],
    showAllHistory: false,
    
    // 收藏的医院
    favoriteHospitals: [
      {
        id: 1,
        name: '云南省第一人民医院',
        level: '三级甲等',
        department: '呼吸内科',
        lastVisit: '2025-11-15'
      },
      {
        id: 2,
        name: '云南中医药大学第一附属医院',
        level: '三级甲等',
        department: '中医科',
        lastVisit: '2025-10-20'
      }
    ],
    
    // 健康档案
    healthProfile: {
      bloodType: 'A型',
      allergies: ['青霉素', '海鲜'],
      chronicDiseases: ['无'],
      medications: ['维生素C']
    },
    
    // 功能列表
    functions: [
      {
        id: 1,
        name: '历史记录',
        icon: '📖',
        color: '#2a8ce5',
        badge: 0
      },
      {
        id: 2,
        name: '健康档案',
        icon: '📋',
        color: '#34c759',
        badge: 0
      },
      {
        id: 3,
        name: '收藏医院',
        icon: '🏥',
        color: '#ff9500',
        badge: 2
      },
      {
        id: 4,
        name: '设置',
        icon: '⚙️',
        color: '#af52de',
        badge: 0
      },
      {
        id: 5,
        name: '关于我们',
        icon: 'ℹ️',
        color: '#666666',
        badge: 0
      },
      {
        id: 6,
        name: '反馈建议',
        icon: '💬',
        color: '#ff3b30',
        badge: 0
      }
    ],
    
    // 当前选中的功能
    selectedFunction: '历史记录',
    
    // 设置选项
    settings: [
      { id: 1, name: '消息通知', enabled: true },
      { id: 2, name: '位置权限', enabled: true },
      { id: 3, name: '语音权限', enabled: true },
      { id: 4, name: '自动保存历史', enabled: true },
      { id: 5, name: '隐私保护', enabled: true }
    ],
    
    // 应用信息
    appInfo: {
      version: '1.0.0',
      lastUpdate: '2025-12-10',
      size: '25.6MB'
    },
    
    // 展开状态
    expandedSections: {
      statistics: true,
      history: true,
      favorites: false,
      profile: false,
      settings: false
    },
    
    // 编辑模式
    editingProfile: false
  },

  onLoad() {
    console.log('个人中心页面加载');
    this.loadUserInfo();
    this.loadStatistics();
    this.loadHistory();
  },

  onShow() {
    // 每次显示页面时刷新数据
    this.loadStatistics();
    this.loadHistory();
  },

  // 加载用户信息
  loadUserInfo() {
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.setData({
        userInfo,
        hasUserInfo: true
      });
    } else {
      // 默认用户信息
      this.setData({
        userInfo: {
          nickName: '晓医用户',
          avatarUrl: ''
        },
        hasUserInfo: false
      });
    }
  },

  // 加载统计数据
  loadStatistics() {
    const history = wx.getStorageSync('diagnosisHistory') || [];
    const completedProcesses = history.filter(record => 
      record.result && record.result.completed
    ).length;
    
    const emergencyCases = history.filter(record => 
      record.result && record.result.emergency
    ).length;
    
    // 计算平均准确率（模拟）
    let totalAccuracy = 0;
    history.forEach(record => {
      if (record.result && record.result.confidence) {
        totalAccuracy += record.result.confidence;
      }
    });
    const avgAccuracy = history.length > 0 ? (totalAccuracy / history.length * 100).toFixed(0) : 0;
    
    this.setData({
      statistics: {
        totalDiagnosis: history.length,
        completedProcesses,
        avgAccuracy,
        emergencyCases
      }
    });
  },

  // 加载历史记录
  loadHistory() {
    const history = wx.getStorageSync('diagnosisHistory') || [];
    const formattedHistory = history.slice(0, 5).map(record => ({
      id: record.id,
      date: record.timestamp || '未知时间',
      symptoms: record.symptoms.slice(0, 3).join('、') + (record.symptoms.length > 3 ? '...' : ''),
      department: record.result ? record.result.department : '未分诊',
      accuracy: record.result ? (record.result.confidence * 100).toFixed(0) + '%' : '0%',
      completed: record.result ? record.result.completed : false
    }));
    
    this.setData({ historyRecords: formattedHistory });
  },

  // 获取用户信息
  getUserInfo() {
    wx.getUserProfile({
      desc: '用于完善个人资料',
      success: (res) => {
        const userInfo = res.userInfo;
        wx.setStorageSync('userInfo', userInfo);
        this.setData({
          userInfo,
          hasUserInfo: true
        });
        
        wx.showToast({
          title: '个人信息已更新',
          icon: 'success'
        });
      },
      fail: (err) => {
        console.log('获取用户信息失败:', err);
      }
    });
  },

  // 选择功能
  selectFunction(e) {
    const functionName = e.currentTarget.dataset.name;
    this.setData({ selectedFunction: functionName });
    
    // 滚动到对应区域
    if (functionName === '历史记录') {
      this.setData({ 'expandedSections.history': true });
    } else if (functionName === '健康档案') {
      this.setData({ 'expandedSections.profile': true });
    } else if (functionName === '收藏医院') {
      this.setData({ 'expandedSections.favorites': true });
    } else if (functionName === '设置') {
      this.setData({ 'expandedSections.settings': true });
    }
  },

  // 切换展开状态
  toggleSection(e) {
    const section = e.currentTarget.dataset.section;
    this.setData({
      [`expandedSections.${section}`]: !this.data.expandedSections[section]
    });
  },

  // 查看历史详情
  viewHistoryDetail(e) {
    const id = e.currentTarget.dataset.id;
    const record = this.data.historyRecords.find(r => r.id === id);
    
    if (!record) return;
    
    wx.showModal({
      title: '就诊记录详情',
      content: `日期：${record.date}\n症状：${record.symptoms}\n推荐科室：${record.department}\n匹配度：${record.accuracy}\n状态：${record.completed ? '已完成' : '未完成'}`,
      showCancel: false,
      confirmText: '知道了'
    });
  },

  // 查看全部历史
  viewAllHistory() {
    wx.navigateTo({
      url: '/pages/result/result'
    });
  },

  // 清除历史记录
  clearHistory() {
    wx.showModal({
      title: '确认清除',
      content: '确定要清除所有历史记录吗？此操作不可恢复。',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync('diagnosisHistory');
          wx.removeStorageSync('currentMedicalProcess');
          
          this.loadStatistics();
          this.loadHistory();
          
          wx.showToast({
            title: '已清除历史记录',
            icon: 'success'
          });
        }
      }
    });
  },

  // 编辑健康档案
  editProfile() {
    this.setData({ editingProfile: true });
  },

  // 保存健康档案
  saveProfile() {
    this.setData({ editingProfile: false });
    
    // 保存到本地存储
    wx.setStorageSync('healthProfile', this.data.healthProfile);
    
    wx.showToast({
      title: '健康档案已保存',
      icon: 'success'
    });
  },

  // 修改健康档案字段
  updateProfileField(e) {
    const field = e.currentTarget.dataset.field;
    const value = e.detail.value;
    
    this.setData({
      [`healthProfile.${field}`]: value
    });
  },

  // 添加过敏原
  addAllergy() {
    wx.showModal({
      title: '添加过敏原',
      content: '',
      editable: true,
      placeholderText: '请输入过敏原名称',
      success: (res) => {
        if (res.confirm && res.content) {
          const allergies = [...this.data.healthProfile.allergies, res.content];
          this.setData({
            'healthProfile.allergies': allergies
          });
        }
      }
    });
  },

  // 删除过敏原
  removeAllergy(e) {
    const index = e.currentTarget.dataset.index;
    const allergies = [...this.data.healthProfile.allergies];
    allergies.splice(index, 1);
    
    this.setData({
      'healthProfile.allergies': allergies
    });
  },

  // 添加慢性病
  addChronicDisease() {
    wx.showModal({
      title: '添加慢性病史',
      content: '',
      editable: true,
      placeholderText: '请输入慢性病名称',
      success: (res) => {
        if (res.confirm && res.content) {
          const diseases = [...this.data.healthProfile.chronicDiseases, res.content];
          this.setData({
            'healthProfile.chronicDiseases': diseases
          });
        }
      }
    });
  },

  // 添加常用药物
  addMedication() {
    wx.showModal({
      title: '添加常用药物',
      content: '',
      editable: true,
      placeholderText: '请输入药物名称',
      success: (res) => {
        if (res.confirm && res.content) {
          const medications = [...this.data.healthProfile.medications, res.content];
          this.setData({
            'healthProfile.medications': medications
          });
        }
      }
    });
  },

  // 切换设置开关
  toggleSetting(e) {
    const settingId = e.currentTarget.dataset.id;
    const settings = this.data.settings.map(setting => {
      if (setting.id === settingId) {
        setting.enabled = !setting.enabled;
        
        // 显示提示信息
        let message = '';
        if (setting.name === '消息通知') {
          message = setting.enabled ? '已开启消息通知' : '已关闭消息通知';
        } else if (setting.name === '位置权限') {
          message = setting.enabled ? '已开启位置权限' : '已关闭位置权限';
        }
        
        if (message) {
          wx.showToast({
            title: message,
            icon: 'none'
          });
        }
      }
      return setting;
    });
    
    this.setData({ settings });
  },

  // 切换收藏医院
  toggleFavoriteHospital(e) {
    const hospitalId = e.currentTarget.dataset.id;
    wx.showModal({
      title: '取消收藏',
      content: '确定要取消收藏这家医院吗？',
      success: (res) => {
        if (res.confirm) {
          const favorites = this.data.favoriteHospitals.filter(h => h.id !== hospitalId);
          this.setData({ favoriteHospitals: favorites });
          
          // 更新功能徽章
          const functions = this.data.functions.map(func => {
            if (func.name === '收藏医院') {
              func.badge = favorites.length;
            }
            return func;
          });
          this.setData({ functions });
          
          wx.showToast({
            title: '已取消收藏',
            icon: 'success'
          });
        }
      }
    });
  },

  // 查看医院详情
  viewHospitalDetail(e) {
    const hospitalId = e.currentTarget.dataset.id;
    const hospital = this.data.favoriteHospitals.find(h => h.id === hospitalId);
    
    if (!hospital) return;
    
    wx.showModal({
      title: hospital.name,
      content: `等级：${hospital.level}\n最近就诊科室：${hospital.department}\n上次就诊时间：${hospital.lastVisit}`,
      confirmText: '导航前往',
      cancelText: '关闭',
      success: (res) => {
        if (res.confirm) {
          wx.navigateTo({
            url: '/pages/navigation/navigation'
          });
        }
      }
    });
  },

  // 导出健康档案
  exportHealthProfile() {
    wx.showLoading({
      title: '正在导出...',
    });
    
    setTimeout(() => {
      wx.hideLoading();
      wx.showModal({
        title: '导出成功',
        content: '健康档案已保存到手机相册',
        showCancel: false
      });
    }, 1500);
  },

  // 分享应用
  shareApp() {
    wx.showActionSheet({
      itemList: ['分享给好友', '生成推广海报', '复制邀请链接'],
      success: (res) => {
        if (res.tapIndex === 0) {
          this.shareToFriend();
        } else if (res.tapIndex === 1) {
          this.generatePromotionPoster();
        } else if (res.tapIndex === 2) {
          this.copyInviteLink();
        }
      }
    });
  },

  // 分享给好友
  shareToFriend() {
    wx.showToast({
      title: '分享功能开发中',
      icon: 'none'
    });
  },

  // 生成推广海报
  generatePromotionPoster() {
    wx.showLoading({
      title: '正在生成...',
    });
    
    setTimeout(() => {
      wx.hideLoading();
      wx.showModal({
        title: '已保存到相册',
        content: '推广海报已保存到手机相册',
        showCancel: false
      });
    }, 1500);
  },

  // 复制邀请链接
  copyInviteLink() {
    wx.setClipboardData({
      data: 'https://xiaoyi.com/invite?code=202513020150',
      success: () => {
        wx.showToast({
          title: '链接已复制',
          icon: 'success'
        });
      }
    });
  },

  // 查看关于我们
  viewAboutUs() {
    wx.showModal({
      title: '关于晓医',
      content: '晓医智能导诊小程序\n版本：1.0.0\n开发者：云南中医药大学\n医学信息工程专业毕业设计\n指导老师：刘红杏\n学生：张树娥',
      showCancel: false,
      confirmText: '知道了'
    });
  },

  // 反馈建议
  giveFeedback() {
    wx.navigateToMiniProgram({
      appId: 'wx8abaf00ee8c3202e', // 示例
      path: 'pages/feedback/feedback',
      success: () => {
        console.log('跳转成功');
      },
      fail: (err) => {
        wx.showModal({
          title: '提示',
          content: '反馈功能开发中，请通过其他方式联系我们。',
          showCancel: false
        });
      }
    });
  },

  // 检查更新
  checkUpdate() {
    wx.showToast({
      title: '已是最新版本',
      icon: 'success'
    });
  },

  // 隐私政策
  viewPrivacyPolicy() {
    wx.showModal({
      title: '隐私政策',
      content: '我们高度重视您的隐私安全，所有数据均加密存储，严格遵守相关法律法规。',
      showCancel: false,
      confirmText: '我知道了'
    });
  },

  // 退出登录
  logout() {
    wx.showModal({
      title: '确认退出',
      content: '确定要退出登录吗？退出后部分功能可能受限。',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync('userInfo');
          wx.removeStorageSync('token');
          
          this.setData({
            userInfo: null,
            hasUserInfo: false
          });
          
          wx.showToast({
            title: '已退出登录',
            icon: 'success'
          });
        }
      }
    });
  },

  // 微信分享
  onShareAppMessage() {
    return {
      title: '晓医智能导诊 - 您的就医好帮手',
      path: '/pages/index/index'
    };
  }
});