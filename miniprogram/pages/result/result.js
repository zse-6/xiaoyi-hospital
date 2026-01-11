// pages/result/result.js
Page({
  data: {
    // 路由参数（必须同时添加这两个）
    __route__: 'default',
    route_: 'default',
    
    // 传入参数
    symptoms: [],
    age: '',
    gender: '',
    
    // 分诊结果
    diagnosisResult: null,
    loading: true,
    
    // 科室信息
    departments: [
      { id: 1, name: '呼吸内科', icon: '🫁', color: '#2a8ce5' },
      { id: 2, name: '消化内科', icon: '🍽️', color: '#34c759' },
      { id: 3, name: '神经内科', icon: '🧠', color: '#ff9500' },
      { id: 4, name: '心内科', icon: '❤️', color: '#ff3b30' },
      { id: 5, name: '急诊科', icon: '🚨', color: '#ff3b30' },
      { id: 6, name: '全科医学科', icon: '👨‍⚕️', color: '#af52de' }
    ],
    
    // 模拟医院数据
    hospitals: [
      {
        id: 1,
        name: '云南省第一人民医院',
        level: '三级甲等',
        distance: '3.5km',
        rating: 4.8,
        departments: ['呼吸内科', '消化内科', '心内科'],
        address: '昆明市金碧路157号',
        phone: '0871-63622938'
      },
      {
        id: 2,
        name: '云南中医药大学第一附属医院',
        level: '三级甲等',
        distance: '5.2km',
        rating: 4.6,
        departments: ['中医内科', '针灸科', '中西医结合科'],
        address: '昆明市光华街120号',
        phone: '0871-63622939'
      }
    ],
    
    // 紧急情况标识
    emergency: false,
    
    // 展开状态
    expandedSections: {
      explanation: true,
      hospitals: false,
      advice: false
    }
  },

  onLoad(options) {
  console.log('结果页面参数:', options);
  
  // 初始化症状数组
  let symptoms = [];
  
  // 安全解析症状参数
  if (options.symptoms && typeof options.symptoms === 'string') {
    try {
      // 解码 + 分割 + 过滤空值 + 去重
      symptoms = decodeURIComponent(options.symptoms)
        .split(',')
        .filter(s => s.trim() !== '' && typeof s === 'string') // 过滤空字符串/空格
        .filter((item, index, arr) => arr.indexOf(item) === index); // 去重
    } catch (e) {
      console.error('解析症状参数失败:', e);
      symptoms = [];
    }
  }
  
  // 设置页面数据
  this.setData({
    symptoms: symptoms,
    age: options.age || '',
    gender: options.gender || '',
    __route__: options.__route__ || 'default',
    route_: options.route_ || 'default'
  });
  
  console.log('设置数据:', {
    symptoms: this.data.symptoms, // 此时应为 ["胸闷", "肌肉酸痛"]
    age: this.data.age,
    gender: this.data.gender,
    __route__: this.data.__route__,
    route_: this.data.route_
  });
  
  // 执行症状分析逻辑
  this.analyzeSymptoms();
},

  // 执行分诊分析
  performDiagnosis() {
    wx.showLoading({
      title: '正在分析症状...',
    });
    
    // 模拟分析延迟
    setTimeout(() => {
      const result = this.generateDiagnosisResult();
      
      this.setData({
        diagnosisResult: result,
        emergency: result.emergency,
        loading: false
      });
      
      wx.hideLoading();
      
      // 保存到历史记录
      this.saveToHistory(result);
      
      // 如果是紧急情况，显示提示
      if (result.emergency) {
        setTimeout(() => {
          wx.showModal({
            title: '⚠️ 紧急情况提示',
            content: '根据您的症状，可能存在紧急情况。建议立即前往急诊科就诊！',
            showCancel: false,
            confirmText: '我知道了'
          });
        }, 500);
      }
    }, 2000);
  },

  // 生成分诊结果（模拟算法）
  generateDiagnosisResult() {
    const { symptoms, age, gender } = this.data;
    
    // 症状匹配规则
    const rules = [
      {
        symptoms: ['头痛', '发热', '咳嗽'],
        department: '呼吸内科',
        confidence: 0.9,
        explanation: '症状组合符合上呼吸道感染特征'
      },
      {
        symptoms: ['腹痛', '腹泻', '恶心'],
        department: '消化内科',
        confidence: 0.85,
        explanation: '症状指向消化系统问题'
      },
      {
        symptoms: ['胸痛', '胸闷', '呼吸困难'],
        department: '心内科',
        confidence: 0.95,
        emergency: true,
        explanation: '需要排除心血管急症'
      },
      {
        symptoms: ['头痛', '头晕', '呕吐'],
        department: '神经内科',
        confidence: 0.8,
        explanation: '神经系统症状明显'
      }
    ];
    
    // 查找匹配规则
    let matchedRule = null;
    let maxMatch = 0;
    
    for (const rule of rules) {
      const matchCount = rule.symptoms.filter(s => 
        symptoms.some(userSymptom => 
          userSymptom.includes(s) || s.includes(userSymptom)
        )
      ).length;
      
      if (matchCount > maxMatch && matchCount > 0) {
        maxMatch = matchCount;
        matchedRule = rule;
      }
    }
    
    // 默认结果
    if (!matchedRule) {
      matchedRule = {
        department: '全科医学科',
        confidence: 0.6,
        explanation: '症状不典型，建议先到全科医学科进行初步检查',
        advice: '全科医生会根据您的具体情况进行全面评估'
      };
    }
    
    // 根据年龄和性别调整建议
    let specificAdvice = '';
    if (age) {
      if (parseInt(age) > 60) {
        specificAdvice += '考虑到您的年龄，建议进行全面健康检查。';
      } else if (parseInt(age) < 18) {
        specificAdvice += '建议前往儿科进行专业诊疗。';
      }
    }
    
    if (gender) {
      specificAdvice += gender === 'female' ? '女性患者请注意妇科相关排查。' : '';
    }
    
    // 构建最终结果
    return {
      department: matchedRule.department,
      confidence: matchedRule.confidence,
      emergency: matchedRule.emergency || false,
      explanation: matchedRule.explanation,
      specificAdvice: specificAdvice || '建议及时就医，避免延误病情。',
      matchedSymptoms: symptoms.slice(0, 3),
      timestamp: new Date().toLocaleString()
    };
  },

  // 保存到历史记录
  saveToHistory(result) {
    const history = wx.getStorageSync('diagnosisHistory') || [];
    const currentRecord = history.find(record => 
      record.symptoms.join(',') === this.data.symptoms.join(',')
    );
    
    if (currentRecord) {
      currentRecord.result = result;
      currentRecord.timestamp = new Date().toLocaleString();
    } else {
      const newRecord = {
        id: Date.now(),
        symptoms: this.data.symptoms,
        age: this.data.age,
        gender: this.data.gender,
        timestamp: new Date().toLocaleString(),
        result: result
      };
      history.unshift(newRecord);
    }
    
    wx.setStorageSync('diagnosisHistory', history.slice(0, 10));
  },

  // 切换展开状态
  toggleSection(e) {
    const section = e.currentTarget.dataset.section;
    this.setData({
      [`expandedSections.${section}`]: !this.data.expandedSections[section]
    });
  },

  // 重新分诊
  restartTriage() {
    wx.navigateTo({
      url: '/pages/triage/triage'
    });
  },

  // 返回首页
  backToHome() {
    wx.switchTab({
      url: '/pages/index/index'
    });
  },

  // 查看医院详情
  viewHospitalDetail(e) {
    const id = e.currentTarget.dataset.id;
    const hospital = this.data.hospitals.find(h => h.id === id);
    
    wx.showModal({
      title: hospital.name,
      content: `等级：${hospital.level}\n地址：${hospital.address}\n电话：${hospital.phone}`,
      confirmText: '导航前往',
      cancelText: '关闭',
      success: (res) => {
        if (res.confirm) {
          this.navigateToHospital(hospital);
        }
      }
    });
  },

  // 导航到医院
  navigateToHospital(hospital) {
    wx.showModal({
      title: '导航提示',
      content: '将跳转到地图应用进行导航',
      success: (res) => {
        if (res.confirm) {
          // 这里可以调用微信地图API
          wx.showToast({
            title: '导航功能开发中',
            icon: 'none'
          });
        }
      }
    });
  },

  // 拨打医院电话
  callHospital(e) {
    const phone = e.currentTarget.dataset.phone;
    wx.showActionSheet({
      itemList: [`拨打 ${phone}`, '取消'],
      success: (res) => {
        if (res.tapIndex === 0) {
          wx.makePhoneCall({
            phoneNumber: phone
          });
        }
      }
    });
  },

  // 分享结果
  onShareAppMessage() {
    const { diagnosisResult } = this.data;
    return {
      title: `晓医智能导诊 - 建议就诊${diagnosisResult.department}`,
      path: `/pages/result/result`
    };
  },

  // 保存为图片（模拟）
  saveResult() {
    wx.showLoading({
      title: '生成分享图中...',
    });
    
    setTimeout(() => {
      wx.hideLoading();
      wx.showToast({
        title: '已保存到相册',
        icon: 'success'
      });
    }, 1500);
  }
});