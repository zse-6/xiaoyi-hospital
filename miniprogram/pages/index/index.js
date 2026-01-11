// miniprogram/pages/index/index.js
Page({
  data: {
    // 轮播图数据
    banners: [
      { image: '/images/banner/banner1.jpg' },
      { image: '/images/banner/banner2.jpg' },
      { image: '/images/banner/banner3.jpg' },
      { image: '/images/banner/banner4.jpg' }
    ],
    currentSwiperIndex: 0,
    
    // 登录状态
    isLogin: false,
    userInfo: null,
    
    // 就诊人信息
    patientList: [],
    currentPatient: null,
    currentPatientId: null,
    
    // 当前选中的标签页
    currentTab: 0
  },

  onLoad() {
    // 初始化轮播图
    this.initBanners();
    this.checkLoginStatus();
  },

  onShow() {
    this.checkLoginStatus();
    if (this.data.isLogin) {
      this.loadPatientList();
    }
  },

  // 初始化轮播图
  initBanners() {
    // 检查图片是否存在，如果不存在使用占位图
    const banners = this.data.banners.map(item => {
      // 这里可以添加图片存在性检查
      // 如果图片不存在，使用默认图片
      return {
        image: item.image || '/images/default-banner.jpg'
      };
    });
    
    this.setData({ banners });
  },

  // 轮播图切换事件
  onSwiperChange(e) {
    this.setData({
      currentSwiperIndex: e.detail.current
    });
  },

  // 图片加载失败
  onImageError(e) {
    console.error('图片加载失败:', e.detail.errMsg);
    // 可以设置默认图片
    const index = e.currentTarget.dataset.index;
    const banners = this.data.banners;
    banners[index].image = '/images/default-banner.jpg';
    this.setData({ banners });
  },

  // 检查登录状态
  checkLoginStatus() {
    const token = wx.getStorageSync('token');
    const userInfo = wx.getStorageSync('userInfo');
    const isLogin = !!token;
    
    this.setData({
      isLogin,
      userInfo: userInfo || null
    });
  },

  // 加载就诊人列表
  loadPatientList() {
    const patientList = wx.getStorageSync('patientList') || [];
    let currentPatientId = wx.getStorageSync('currentPatientId');
    let currentPatient = null;
    
    if (patientList.length > 0) {
      if (currentPatientId) {
        currentPatient = patientList.find(p => p.id === currentPatientId) || patientList[0];
      } else {
        currentPatient = patientList[0];
        currentPatientId = patientList[0].id;
        wx.setStorageSync('currentPatientId', currentPatientId);
      }
    }
    
    this.setData({
      patientList,
      currentPatient,
      currentPatientId
    });
  },

  // 处理就诊人区域点击
  handlePatientTap() {
    if (!this.data.isLogin) {
      this.gotoLogin();
      return;
    }
    
    if (!this.data.currentPatient) {
      this.gotoAddPatient();
    }
  },

  // 切换就诊人
  switchPatient(e) {
    e.stopPropagation();
    if (!this.data.isLogin) {
      this.gotoLogin();
      return;
    }
    
    wx.navigateTo({
      url: '/pages/patient/select'
    });
  },

  // 去登录
  gotoLogin() {
    wx.navigateTo({
      url: '/pages/login/login'
    });
  },

  // 去添加就诊人
  gotoAddPatient() {
    if (!this.data.isLogin) {
      this.gotoLogin();
      return;
    }
    
    wx.navigateTo({
      url: '/pages/patient/add'
    });
  },

  // 分诊功能跳转
  gotoVoiceDiagnosis() {
    this.gotoWithLoginCheck('/pages/triage/triage?type=voice');
  },

  gotoBodyDiagnosis() {
    this.gotoWithLoginCheck('/pages/triage/triage?type=body');
  },

  gotoTextDiagnosis() {
    this.gotoWithLoginCheck('/pages/triage/triage?type=text');
  },

  gotoAppointment() {
    this.gotoWithLoginCheck('/pages/appointment/index'); // 需要创建这个页面
  },

  // 通用跳转方法（检查登录）
  gotoWithLoginCheck(url) {
    if (!this.data.isLogin) {
      this.gotoLogin();
      return;
    }
    
    if (url.includes('triage') && !this.data.currentPatient) {
      wx.showModal({
        title: '提示',
        content: '请先添加就诊人',
        success: (res) => {
          if (res.confirm) {
            this.gotoAddPatient();
          }
        }
      });
      return;
    }
    
    wx.navigateTo({ url });
  },

  // 切换自定义底部标签页
  switchTab(e) {
    const tab = parseInt(e.currentTarget.dataset.tab);
    this.setData({ currentTab: tab });
    
    const pages = [
      '/pages/index/index',
      '/pages/process/process',
      '/pages/navigation/navigation',
      '/pages/mine/mine'
    ];
    
    if (tab !== 0) {
      wx.redirectTo({
        url: pages[tab]
      });
    }
  },

  // 去个人中心
  gotoMine() {
    this.gotoWithLoginCheck('/pages/mine/mine');
  }
});