// pages/navigation/navigation.js
Page({
  data: {
    // 当前医院
    currentHospital: {
      id: 1,
      name: '云南省第一人民医院',
      level: '三级甲等',
      address: '昆明市金碧路157号',
      phone: '0871-63622938',
      hours: '门诊：08:00-17:30，急诊：24小时',
      imageUrl: '' // 这里可以放医院实景图
    },
    
    // 导航模式
    navigationMode: 'floor', // floor-楼层导航, indoor-室内导航, out-院外导航
    
    // 楼层导航数据
    floors: [
      {
        floor: '一楼',
        departments: [
          { id: 1, name: '门诊大厅', icon: '🏥', type: '公共区域' },
          { id: 2, name: '挂号收费处', icon: '💳', type: '服务窗口' },
          { id: 3, name: '药房', icon: '💊', type: '药房' },
          { id: 4, name: '急诊科', icon: '🚨', type: '急诊' }
        ]
      },
      {
        floor: '二楼',
        departments: [
          { id: 5, name: '内科门诊', icon: '🫁', type: '门诊' },
          { id: 6, name: '外科门诊', icon: '🔪', type: '门诊' },
          { id: 7, name: '检验科', icon: '🧪', type: '检验' },
          { id: 8, name: '心电图室', icon: '📈', type: '检查' }
        ]
      },
      {
        floor: '三楼',
        departments: [
          { id: 9, name: '妇产科', icon: '🤰', type: '专科' },
          { id: 10, name: '儿科', icon: '👶', type: '专科' },
          { id: 11, name: '中医科', icon: '🌿', type: '专科' },
          { id: 12, name: '康复科', icon: '⚕️', type: '专科' }
        ]
      }
    ],
    
    // 室内导航数据（模拟医院地图节点）
    indoorMap: {
      nodes: [
        { id: 'A1', name: '门诊入口', x: 50, y: 100, type: 'entrance' },
        { id: 'A2', name: '挂号处', x: 150, y: 100, type: 'service' },
        { id: 'A3', name: '门诊大厅', x: 250, y: 100, type: 'hall' },
        { id: 'B1', name: '内科诊室', x: 150, y: 200, type: 'clinic' },
        { id: 'B2', name: '外科诊室', x: 250, y: 200, type: 'clinic' },
        { id: 'C1', name: '电梯间', x: 200, y: 300, type: 'elevator' },
        { id: 'C2', name: '药房', x: 100, y: 300, type: 'pharmacy' }
      ],
      connections: [
        { from: 'A1', to: 'A2' },
        { from: 'A2', to: 'A3' },
        { from: 'A3', to: 'B1' },
        { from: 'A3', to: 'B2' },
        { from: 'B1', to: 'C1' },
        { from: 'B2', to: 'C1' },
        { from: 'C1', to: 'C2' }
      ]
    },
    
    // 院外导航数据
    hospitals: [
      {
        id: 1,
        name: '云南省第一人民医院',
        distance: '3.5km',
        time: '15分钟',
        level: '三级甲等',
        address: '昆明市金碧路157号',
        departments: ['内科', '外科', '急诊', '儿科'],
        coords: { latitude: 25.0516, longitude: 102.705 }
      },
      {
        id: 2,
        name: '云南中医药大学第一附属医院',
        distance: '5.2km',
        time: '22分钟',
        level: '三级甲等',
        address: '昆明市光华街120号',
        departments: ['中医科', '针灸科', '康复科'],
        coords: { latitude: 25.0621, longitude: 102.713 }
      },
      {
        id: 3,
        name: '昆明市延安医院',
        distance: '4.8km',
        time: '20分钟',
        level: '三级甲等',
        address: '昆明市人民东路245号',
        departments: ['心内科', '神经科', '妇产科'],
        coords: { latitude: 25.0435, longitude: 102.728 }
      }
    ],
    
    // 搜索相关
    searchKeyword: '',
    searchResults: [],
    showSearch: false,
    
    // 当前位置
    currentLocation: '门诊大厅',
    targetLocation: '',
    
    // 导航路径
    navigationPath: [],
    showNavigation: false,
    
    // 展开的楼层
    expandedFloor: '一楼',
    
    // 图片预览
    previewImages: [
      { id: 1, url: '', description: '门诊大楼正门' },
      { id: 2, url: '', description: '门诊大厅' },
      { id: 3, url: '', description: '挂号处' },
      { id: 4, url: '', description: '药房' }
    ]
  },

  onLoad() {
    console.log('院内导航页面加载');
    this.checkLocationPermission();
  },

  // 检查位置权限
  checkLocationPermission() {
    wx.getSetting({
      success: (res) => {
        if (!res.authSetting['scope.userLocation']) {
          wx.showModal({
            title: '位置权限提示',
            content: '需要获取您的位置信息以提供精准导航服务',
            success: (modalRes) => {
              if (modalRes.confirm) {
                wx.authorize({
                  scope: 'scope.userLocation',
                  success: () => {
                    this.getCurrentLocation();
                  },
                  fail: () => {
                    wx.showToast({
                      title: '位置授权失败',
                      icon: 'none'
                    });
                  }
                });
              }
            }
          });
        } else {
          this.getCurrentLocation();
        }
      }
    });
  },

  // 获取当前位置
  getCurrentLocation() {
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        console.log('当前位置:', res);
        // 这里可以计算距离最近的医院
      },
      fail: (err) => {
        console.warn('获取位置失败:', err);
      }
    });
  },

  // 切换导航模式
  switchMode(e) {
    const mode = e.currentTarget.dataset.mode;
    this.setData({ 
      navigationMode: mode,
      showSearch: false,
      showNavigation: false
    });
  },

  // 切换楼层展开
  toggleFloor(e) {
    const floor = e.currentTarget.dataset.floor;
    this.setData({
      expandedFloor: this.data.expandedFloor === floor ? '' : floor
    });
  },

  // 搜索输入
  onSearchInput(e) {
    const keyword = e.detail.value;
    this.setData({ searchKeyword: keyword });
    
    if (keyword) {
      this.performSearch(keyword);
    } else {
      this.setData({ searchResults: [], showSearch: false });
    }
  },

  // 执行搜索
  performSearch(keyword) {
    const allDepartments = this.data.floors.flatMap(floor => 
      floor.departments.map(dept => ({
        ...dept,
        floor: floor.floor
      }))
    );
    
    const results = allDepartments.filter(dept => 
      dept.name.includes(keyword) || 
      dept.type.includes(keyword) ||
      dept.floor.includes(keyword)
    );
    
    this.setData({ 
      searchResults: results,
      showSearch: true 
    });
  },

  // 选择搜索项
  selectSearchResult(e) {
    const result = e.currentTarget.dataset.result;
    this.setData({
      targetLocation: result.name,
      searchKeyword: result.name,
      showSearch: false,
      showNavigation: true
    });
    
    // 生成导航路径
    this.generateNavigationPath(this.data.currentLocation, result.name);
  },

  // 选择科室
  selectDepartment(e) {
    const department = e.currentTarget.dataset.department;
    const floor = e.currentTarget.dataset.floor;
    
    this.setData({
      targetLocation: department.name,
      showNavigation: true
    });
    
    // 展开对应的楼层
    this.setData({ expandedFloor: floor });
    
    // 生成导航路径
    this.generateNavigationPath(this.data.currentLocation, department.name);
    
    // 显示科室详情
    this.showDepartmentDetail(department);
  },

  // 生成导航路径（模拟）
  generateNavigationPath(from, to) {
    // 模拟路径生成逻辑
    const path = [
      { step: 1, instruction: `从${from}出发`, icon: '📍' },
      { step: 2, instruction: '直行50米至电梯间', icon: '🚶' },
      { step: 3, instruction: '乘坐电梯到二楼', icon: '🛗' },
      { step: 4, instruction: '出电梯右转', icon: '↪️' },
      { step: 5, instruction: '直行30米到达' + to, icon: '🎯' }
    ];
    
    this.setData({ navigationPath: path });
  },

  // 显示科室详情
  showDepartmentDetail(department) {
    wx.showModal({
      title: department.name,
      content: `楼层：${this.findFloorByDepartment(department.id)}\n类型：${department.type}\n\n是否开始导航？`,
      confirmText: '开始导航',
      cancelText: '查看详情',
      success: (res) => {
        if (res.confirm) {
          // 开始导航
          this.startNavigation();
        } else {
          // 显示更多详情
          this.showMoreDetail(department);
        }
      }
    });
  },

  // 查找科室所在楼层
  findFloorByDepartment(departmentId) {
    for (const floor of this.data.floors) {
      if (floor.departments.some(dept => dept.id === departmentId)) {
        return floor.floor;
      }
    }
    return '未知楼层';
  },

  // 显示更多详情
  showMoreDetail(department) {
    const detailText = `
🏥 ${department.name}
📌 楼层：${this.findFloorByDepartment(department.id)}
📋 类型：${department.type}
⏰ 就诊时间：08:00-12:00, 14:00-17:30
👨‍⚕️ 医生值班：李医生、王医生
📞 咨询电话：0871-6362xxxx
    `.trim();
    
    wx.showModal({
      title: '科室详情',
      content: detailText,
      showCancel: false,
      confirmText: '知道了'
    });
  },

  // 开始导航
  startNavigation() {
    wx.showToast({
      title: '导航开始',
      icon: 'success'
    });
    
    // 模拟导航过程
    let currentStep = 0;
    const totalSteps = this.data.navigationPath.length;
    
    const timer = setInterval(() => {
      if (currentStep < totalSteps) {
        const step = this.data.navigationPath[currentStep];
        wx.showToast({
          title: step.instruction,
          icon: 'none',
          duration: 2000
        });
        currentStep++;
      } else {
        clearInterval(timer);
        wx.showModal({
          title: '导航完成',
          content: '已到达目的地！',
          showCancel: false
        });
      }
    }, 3000);
  },

  // 选择医院
  selectHospital(e) {
    const hospital = e.currentTarget.dataset.hospital;
    this.setData({ currentHospital: hospital });
    
    wx.showModal({
      title: '切换医院',
      content: `已切换到${hospital.name}，是否查看该院导航？`,
      success: (res) => {
        if (res.confirm) {
          this.setData({ navigationMode: 'floor' });
        }
      }
    });
  },

  // 拨打医院电话
  callHospital() {
    wx.makePhoneCall({
      phoneNumber: this.data.currentHospital.phone
    });
  },

  // 查看医院位置
  viewHospitalLocation() {
    wx.openLocation({
      latitude: 25.0516, // 示例坐标
      longitude: 102.705,
      name: this.data.currentHospital.name,
      address: this.data.currentHospital.address
    });
  },

  // 查看实景图片
  viewRealImage(e) {
    const image = e.currentTarget.dataset.image;
    wx.previewImage({
      urls: ['https://example.com/hospital.jpg'], // 这里放实际图片URL
      current: 'https://example.com/hospital.jpg'
    });
  },

  // 分享导航
  onShareAppMessage() {
    return {
      title: `${this.data.currentHospital.name} - 院内导航`,
      path: '/pages/navigation/navigation'
    };
  },

  // 重置导航
  resetNavigation() {
    this.setData({
      targetLocation: '',
      showNavigation: false,
      navigationPath: [],
      searchKeyword: ''
    });
  }
});