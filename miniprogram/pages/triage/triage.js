// pages/triage/triage.js
Page({
  data: {
    // 当前输入模式：text-文本, voice-语音, body-人体图示
    inputMode: 'text',
    
    // 症状相关
    symptoms: [],
    inputValue: '',
    
    // 语音识别
    recording: false,
    voiceResult: '',
    
    // 人体图示
    bodyParts: [
      { id: 'head', name: '头部', icon: '👤', selected: false, symptoms: ['头痛', '头晕', '耳鸣'] },
      { id: 'chest', name: '胸部', icon: '🫀', selected: false, symptoms: ['胸痛', '胸闷', '心悸'] },
      { id: 'abdomen', name: '腹部', icon: '🫁', selected: false, symptoms: ['腹痛', '腹泻', '恶心'] },
      { id: 'limbs', name: '四肢', icon: '🦵', selected: false, symptoms: ['关节痛', '肿胀', '麻木'] }
    ],
    
    // 常见症状
    commonSymptoms: [
      { name: '头痛', category: '神经系统' },
      { name: '发热', category: '全身症状' },
      { name: '咳嗽', category: '呼吸系统' },
      { name: '腹痛', category: '消化系统' },
      { name: '头晕', category: '神经系统' },
      { name: '恶心', category: '消化系统' },
      { name: '胸闷', category: '心血管' },
      { name: '乏力', category: '全身症状' }
    ],
    
    // 用户信息
    age: '',
    gender: '',
    showUserInfo: false,
    
    // 加载状态
    loading: false
  },

  onLoad(options) {
    console.log('分诊页面加载', options);
    
    // 处理快速入口
    if (options.quickSymptom) {
      this.addSymptom(options.quickSymptom);
    }
    
    // 处理模式参数
    if (options.mode) {
      this.setData({ inputMode: options.mode });
    }
    
    // 加载历史症状
    this.loadHistory();
  },

  // 加载历史记录
  loadHistory() {
    const history = wx.getStorageSync('diagnosisHistory') || [];
    if (history.length > 0) {
      const latest = history[0];
      this.setData({
        'age': latest.age || '',
        'gender': latest.gender || ''
      });
    }
  },

  // 切换输入模式
  switchMode(e) {
    const mode = e.currentTarget.dataset.mode;
    this.setData({ inputMode: mode });
  },

  // 输入框变化
  onInputChange(e) {
    this.setData({ inputValue: e.detail.value });
  },

  // 添加症状
  addSymptom(symptom = null) {
    const symptomToAdd = symptom || this.data.inputValue.trim();
    
    if (!symptomToAdd) {
      wx.showToast({
        title: '请输入症状',
        icon: 'none'
      });
      return;
    }
    
    if (this.data.symptoms.includes(symptomToAdd)) {
      wx.showToast({
        title: '症状已添加',
        icon: 'none'
      });
      return;
    }
    
    const newSymptoms = [...this.data.symptoms, symptomToAdd];
    this.setData({
      symptoms: newSymptoms,
      inputValue: symptom ? '' : this.data.inputValue
    });
    
    if (symptom) {
      wx.showToast({
        title: '已添加',
        icon: 'success'
      });
    }
  },

  // 快速选择常见症状
  selectCommonSymptom(e) {
    const symptom = e.currentTarget.dataset.symptom;
    this.addSymptom(symptom);
  },

  // 删除症状
  removeSymptom(e) {
    const index = e.currentTarget.dataset.index;
    const newSymptoms = [...this.data.symptoms];
    newSymptoms.splice(index, 1);
    this.setData({ symptoms: newSymptoms });
  },

  // 清除所有症状
  clearSymptoms() {
    wx.showModal({
      title: '提示',
      content: '确定要清除所有症状吗？',
      success: (res) => {
        if (res.confirm) {
          this.setData({ symptoms: [] });
        }
      }
    });
  },

  // 语音输入
  startVoiceInput() {
    if (this.data.recording) return;
    
    this.setData({ recording: true });
    
    // 模拟语音识别过程
    setTimeout(() => {
      const mockResults = ['头痛发热', '腹痛腹泻', '咳嗽胸闷'];
      const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)];
      
      wx.navigateTo({
  url: `/pages/result/result?symptoms=${this.data.symptoms.join(',')}&age=${this.data.age}&gender=${this.data.gender}&route=triage&__route__=triage`
});
      
      // 自动添加到症状列表
      const symptoms = randomResult.split(/(?=[\u4e00-\u9fa5])/).filter(s => s.length > 1);
      symptoms.forEach(symptom => {
        if (!this.data.symptoms.includes(symptom)) {
          this.data.symptoms.push(symptom);
        }
      });
      
      this.setData({ symptoms: this.data.symptoms });
      
      wx.showToast({
        title: '语音识别完成',
        icon: 'success'
      });
    }, 2000);
  },

  // 选择身体部位
  selectBodyPart(e) {
    const index = e.currentTarget.dataset.index;
    const bodyParts = this.data.bodyParts;
    bodyParts[index].selected = !bodyParts[index].selected;
    
    this.setData({ bodyParts });
    
    // 显示症状选择弹窗
    if (bodyParts[index].selected) {
      const symptoms = bodyParts[index].symptoms;
      wx.showActionSheet({
        itemList: symptoms,
        success: (res) => {
          const selectedSymptom = symptoms[res.tapIndex];
          this.addSymptom(selectedSymptom);
        },
        fail: () => {
          bodyParts[index].selected = false;
          this.setData({ bodyParts });
        }
      });
    }
  },

  // 切换用户信息显示
  toggleUserInfo() {
    this.setData({ showUserInfo: !this.data.showUserInfo });
  },

  // 年龄选择
  onAgeChange(e) {
    this.setData({ age: e.detail.value });
  },

  // 性别选择
  selectGender(e) {
    const gender = e.currentTarget.dataset.gender;
    this.setData({ gender });
  },

  // 开始分诊
  startDiagnosis() {
    // 验证输入
    if (this.data.symptoms.length === 0) {
      wx.showToast({
        title: '请至少输入一个症状',
        icon: 'none'
      });
      return;
    }
    
    // 验证用户信息（年龄和性别可提高准确性）
    if (!this.data.age || !this.data.gender) {
      wx.showModal({
        title: '提示',
        content: '填写年龄和性别可以提高分诊准确性，是否继续？',
        cancelText: '去填写',
        confirmText: '继续',
        success: (res) => {
          if (res.confirm) {
            this.performDiagnosis();
          }
        }
      });
    } else {
      this.performDiagnosis();
    }
  },

  // 执行分诊逻辑
  performDiagnosis() {
    this.setData({ loading: true });
    
    // 保存本次记录
    this.saveHistory();
    
    // 模拟API调用延迟
    setTimeout(() => {
      this.setData({ loading: false });
      
      // 跳转到结果页面，传递症状数据
      wx.navigateTo({
        url: `/pages/result/result?symptoms=${this.data.symptoms.join(',')}&age=${this.data.age}&gender=${this.data.gender}`
      });
    }, 1500);
  },

  // 保存历史记录
  saveHistory() {
    const history = wx.getStorageSync('diagnosisHistory') || [];
    const newRecord = {
      id: Date.now(),
      symptoms: this.data.symptoms,
      age: this.data.age,
      gender: this.data.gender,
      timestamp: new Date().toLocaleString(),
      result: null // 会在结果页面填充
    };
    
    history.unshift(newRecord);
    wx.setStorageSync('diagnosisHistory', history.slice(0, 10)); // 只保存最近10条
  },

  // 返回首页
  backToHome() {
    wx.switchTab({
      url: '/pages/index/index'
    });
  }
});