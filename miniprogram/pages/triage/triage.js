Page({
  data: {
    // 当前输入模式：text-文本, voice-语音, body-人体图示（开题报告多模态输入）
    inputMode: 'text',
    
    // 症状相关
    symptoms: [],
    inputValue: '',
    
    // 语音识别
    recording: false,
    voiceResult: '',
    
    // 人体图示（兼容旧版+组件版，开题报告扩展功能）
    bodyParts: [
      { id: 'head', name: '头部', icon: '👤', selected: false, symptoms: ['头痛', '头晕', '耳鸣'] },
      { id: 'chest', name: '胸部', icon: '🫀', selected: false, symptoms: ['胸痛', '胸闷', '心悸'] },
      { id: 'abdomen', name: '腹部', icon: '🫁', selected: false, symptoms: ['腹痛', '腹泻', '恶心'] },
      { id: 'limbs', name: '四肢', icon: '🦵', selected: false, symptoms: ['关节痛', '肿胀', '麻木'] }
    ],
    
    // 常见症状（开题报告知识库核心数据）
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
    loading: false,

    // 人体图示组件相关
    selectedBodyParts: [],
    bodyMapSymptoms: [],
    // 分诊结果临时存储
    triageResult: null,
    // 系统信息（替代废弃的wx.getSystemInfo）
    systemInfo: {}
  },

  onLoad(options) {
    console.log('分诊页面加载', options);
    
    // 处理快速入口症状
    if (options.quickSymptom) {
      this.addSymptom(options.quickSymptom);
    }
    
    // 处理模式参数
    if (options.mode) {
      this.setData({ inputMode: options.mode });
    }
    
    // 加载历史症状记录
    this.loadHistory();
    
    // 初始化系统信息（开题报告技术路线：兼容新版API）
    this.getSystemSetting();
  },

  // 修复：使用新版API获取系统信息（替代wx.getSystemInfo）
  getSystemSetting() {
    wx.getSystemSetting({
      success: (res) => {
        this.setData({ systemInfo: res });
        console.log('系统信息:', res);
      },
      fail: (err) => {
        console.warn('获取系统信息失败:', err);
      }
    });
  },

  // 加载历史分诊记录（开题报告个人健康档案功能）
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

  // 输入框内容变化
  onInputChange(e) {
    this.setData({ inputValue: e.detail.value });
  },

  // 添加症状（含重复校验、空值校验）
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

  // 删除单个症状
  removeSymptom(e) {
    const index = e.currentTarget.dataset.index;
    const newSymptoms = [...this.data.symptoms];
    newSymptoms.splice(index, 1);
    this.setData({ symptoms: newSymptoms });
  },

  // 清除所有症状（含确认弹窗）
  clearSymptoms() {
    wx.showModal({
      title: '提示',
      content: '确定要清除所有症状吗？',
      success: (res) => {
        if (res.confirm) {
          this.setData({ 
            symptoms: [],
            bodyMapSymptoms: [] // 同步清空人体图示选中症状
          });
        }
      }
    });
  },

  // 语音输入（开题报告重点功能，模拟自然语言识别）
  startVoiceInput() {
    if (this.data.recording) return;
    
    this.setData({ recording: true });
    
    // 模拟语音识别过程（实际可对接微信原生语音API）
    setTimeout(() => {
      const mockResults = ['头痛发热', '腹痛腹泻', '咳嗽胸闷', '心慌乏力', '关节肿痛'];
      const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)];
      
      // 解析识别结果为单个症状
      const symptoms = randomResult.split(/(?=[\u4e00-\u9fa5])/).filter(s => s.length > 1);
      symptoms.forEach(symptom => {
        if (!this.data.symptoms.includes(symptom)) {
          this.data.symptoms.push(symptom);
        }
      });
      
      this.setData({ 
        symptoms: this.data.symptoms,
        recording: false, // 修复：结束录音状态
        voiceResult: randomResult
      });
      
      wx.showToast({
        title: '语音识别完成',
        icon: 'success'
      });
    }, 2000);
  },

  // 旧版身体部位选择（兼容备用）
  selectBodyPart(e) {
    const index = e.currentTarget.dataset.index;
    const bodyParts = [...this.data.bodyParts]; // 修复：避免直接修改原数组
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

  // ========== 人体图示组件事件处理（开题报告扩展功能） ==========
  // 1. 处理组件部位选择变化
  onBodyMapChange(e) {
    console.log('人体部位选择变化:', e.detail);
    const { parts, selectedSymptomMap } = e.detail;
    
    // 提取并去重症状
    const bodyMapSymptoms = Object.values(selectedSymptomMap).flat().filter((item, idx, arr) => arr.indexOf(item) === idx);
    
    this.setData({
      selectedBodyParts: parts,
      bodyMapSymptoms: bodyMapSymptoms
    });
    
    // 自动将组件选择的症状添加到总列表
    bodyMapSymptoms.forEach(symptom => {
      this.addSymptom(symptom);
    });
  },

  // 2. 处理组件症状选择事件
  onBodyMapSymptomSelect(e) {
    console.log('症状选择:', e.detail);
    const { symptom } = e.detail;
    this.addSymptom(symptom);
  },

  // 3. 删除人体图示选择的症状
  removeBodyMapSymptom(e) {
    const { index, symptom } = e.currentTarget.dataset;
    // 从人体图示症状列表中删除
    const newBodyMapSymptoms = [...this.data.bodyMapSymptoms];
    newBodyMapSymptoms.splice(index, 1);
    
    // 从总症状列表中删除
    const newSymptoms = this.data.symptoms.filter(item => item !== symptom);
    
    this.setData({
      bodyMapSymptoms: newBodyMapSymptoms,
      symptoms: newSymptoms
    });
    
    wx.showToast({
      title: '已删除',
      icon: 'none',
      duration: 1000
    });
  },

  // ========== 用户信息相关 ==========
  // 切换用户信息显示面板
  toggleUserInfo() {
    this.setData({ showUserInfo: !this.data.showUserInfo });
  },

  // 年龄输入变化
  onAgeChange(e) {
    this.setData({ age: e.detail.value });
  },

  // 性别选择
  selectGender(e) {
    const gender = e.currentTarget.dataset.gender;
    this.setData({ gender });
  },

  // ========== 核心分诊流程（开题报告核心功能） ==========
  // 开始分诊（含输入验证）
  startDiagnosis() {
    const { symptoms, age, gender } = this.data;
    
    // 验证症状非空
    if (symptoms.length === 0) {
      wx.showToast({
        title: '请至少输入一个症状',
        icon: 'none'
      });
      return;
    }
    
    // 验证用户信息（可选，提升准确性）
    if (!age || !gender) {
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

  // 执行分诊逻辑（调用云函数，含完整错误处理）
  performDiagnosis() {
    this.setData({ loading: true });
    
    // 保存本次记录到本地
    this.saveHistory();
    
    const { symptoms, age, gender } = this.data;

    // 1. 调用症状标准化云函数（开题报告数据清洗要求）
    wx.cloud.callFunction({
      name: 'symptom_standard',
      data: { symptoms },
      success: (res1) => {
        // 新增：完整错误兜底，避免undefined报错
        if (!res1 || !res1.result || res1.result.code !== 200 || !res1.result.data) {
          this.setData({ loading: false });
          wx.showToast({ title: '症状标准化失败，请重试', icon: 'none' });
          return;
        }
        
        const standardSymptoms = res1.result.data.standardSymptoms || [];
        if (standardSymptoms.length === 0) {
          this.setData({ loading: false });
          wx.showToast({ title: '未识别到有效症状', icon: 'none' });
          return;
        }

        // 2. 调用核心分诊云函数（开题报告规则引擎+决策树）
        wx.cloud.callFunction({
          name: 'analyze_symptom',
          data: { standardSymptoms, age, gender },
          success: (res2) => {
            this.setData({ loading: false });
            
            // 新增：分诊结果校验
            if (!res2 || !res2.result || res2.result.code !== 200 || !res2.result.data) {
              wx.showToast({ title: '分诊失败，请重试', icon: 'none' });
              return;
            }
            
            const triageResult = res2.result.data;
            this.setData({ triageResult });

            // 3. 保存分诊记录到云数据库
            wx.cloud.callFunction({
              name: 'record',
              data: {
                openid: wx.getStorageSync('openid') || `test_${Date.now()}`, // 匿名标识，符合隐私保护
                symptoms: standardSymptoms,
                age,
                gender,
                recommendedDept: triageResult.department,
                warningLevel: triageResult.warningLevel || '无'
              },
              fail: (err) => {
                console.error('云数据库记录保存失败:', err);
                // 不阻断流程，仅日志提示
              }
            });

            // 跳转到结果页（参数编码，避免特殊字符问题）
            wx.navigateTo({
              url: `/pages/result/result?symptoms=${encodeURIComponent(JSON.stringify(standardSymptoms))}&age=${encodeURIComponent(age)}&gender=${encodeURIComponent(gender)}&result=${encodeURIComponent(JSON.stringify(triageResult))}`
            });
          },
          fail: (err) => {
            this.setData({ loading: false });
            console.error('分诊云函数调用失败:', err);
            wx.showToast({ title: '网络异常，请检查网络', icon: 'none' });
          }
        });
      },
      fail: (err) => {
        this.setData({ loading: false });
        console.error('症状标准化云函数调用失败:', err);
        wx.showToast({ title: '网络异常，请检查网络', icon: 'none' });
      }
    });
  },

  // 保存历史记录到本地缓存（开题报告历史记录功能）
  saveHistory() {
    const history = wx.getStorageSync('diagnosisHistory') || [];
    const newRecord = {
      id: Date.now(),
      symptoms: this.data.symptoms,
      age: this.data.age,
      gender: this.data.gender,
      timestamp: new Date().toLocaleString(),
      result: this.data.triageResult || null
    };
    
    // 插入到数组头部，保留最近10条
    history.unshift(newRecord);
    wx.setStorageSync('diagnosisHistory', history.slice(0, 10));
  },

  // 返回首页
  backToHome() {
    wx.switchTab({
      url: '/pages/index/index'
    });
  },

  // 页面卸载时重置状态
  onUnload() {
    this.setData({ 
      recording: false,
      loading: false
    });
  }
});