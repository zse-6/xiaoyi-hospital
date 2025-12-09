// pages/process/process.js
Page({
  data: {
    // 当前就诊流程
    currentProcess: {
      id: 1,
      title: '普通门诊就诊流程',
      estimatedTime: '2-3小时',
      departments: ['门诊部', '检验科', '药房'],
      description: '从挂号到取药的完整就诊流程'
    },
    
    // 流程步骤
    processSteps: [
      {
        id: 1,
        title: '预约挂号',
        status: 'completed', // completed, current, pending
        icon: '📅',
        color: '#2a8ce5',
        time: '已完成',
        details: [
          '方式：微信小程序/医院公众号',
          '科室：根据分诊结果选择',
          '时间：建议提前1-3天预约',
          '准备：身份证、医保卡信息'
        ],
        tips: [
          '高峰期需提前预约',
          '可预约未来7天号源',
          '取消预约需提前2小时'
        ]
      },
      {
        id: 2,
        title: '医院报到',
        status: 'current',
        icon: '🏥',
        color: '#34c759',
        time: '预计30分钟前',
        details: [
          '地点：门诊大厅自助机/人工窗口',
          '方式：刷身份证/医保卡/预约码',
          '签到：领取就诊序号',
          '等候：查看叫号屏幕'
        ],
        tips: [
          '建议提前30分钟到达',
          '迟到需重新排队',
          '保持手机畅通'
        ]
      },
      {
        id: 3,
        title: '医生问诊',
        status: 'pending',
        icon: '👨‍⚕️',
        color: '#ff9500',
        time: '预计20-30分钟',
        details: [
          '描述：清晰说明症状、持续时间',
          '病史：既往病史、过敏史',
          '检查：配合医生体格检查',
          '沟通：主动询问不清楚的地方'
        ],
        tips: [
          '提前准备好问题清单',
          '带上既往检查报告',
          '如实告知用药情况'
        ]
      },
      {
        id: 4,
        title: '缴费检查',
        status: 'pending',
        icon: '💳',
        color: '#af52de',
        time: '预计40-60分钟',
        details: [
          '缴费：自助机/窗口缴费',
          '检查：根据医嘱进行检查',
          '等候：等待检查结果',
          '领取：自助机打印报告'
        ],
        tips: [
          '保存好所有缴费单据',
          '空腹检查需提前准备',
          '复杂检查需提前预约'
        ]
      },
      {
        id: 5,
        title: '复诊确诊',
        status: 'pending',
        icon: '📋',
        color: '#ff3b30',
        time: '预计20-30分钟',
        details: [
          '复诊：拿检查结果回诊室',
          '诊断：医生给出明确诊断',
          '治疗方案：药物治疗/物理治疗',
          '医嘱：注意事项和复查时间'
        ],
        tips: [
          '仔细听取医嘱说明',
          '确认用药方法和剂量',
          '记录复查时间'
        ]
      },
      {
        id: 6,
        title: '缴费取药',
        status: 'pending',
        icon: '💊',
        color: '#34c759',
        time: '预计20-30分钟',
        details: [
          '缴费：处方缴费',
          '取药：药房窗口排队',
          '核对：核对药品信息',
          '咨询：用药指导咨询'
        ],
        tips: [
          '确认药品用法用量',
          '询问药物相互作用',
          '保存好药品说明书'
        ]
      },
      {
        id: 7,
        title: '完成就诊',
        status: 'pending',
        icon: '✅',
        color: '#666666',
        time: '就诊结束',
        details: [
          '整理：收好所有单据',
          '复查：记录复查时间',
          '反馈：填写就诊反馈',
          '健康管理：建立健康档案'
        ],
        tips: [
          '保存病历资料',
          '按时复查',
          '关注健康宣教'
        ]
      }
    ],
    
    // 其他流程选项
    otherProcesses: [
      {
        id: 2,
        title: '急诊就诊流程',
        estimatedTime: '1-2小时',
        departments: ['急诊科', '抢救室'],
        description: '紧急情况下的快速就诊流程',
        urgent: true
      },
      {
        id: 3,
        title: '住院治疗流程',
        estimatedTime: '3-7天',
        departments: ['住院部', '手术室'],
        description: '需要住院治疗的全流程管理',
        inpatient: true
      },
      {
        id: 4,
        title: '体检检查流程',
        estimatedTime: '2-4小时',
        departments: ['体检中心'],
        description: '健康体检的标准化流程',
        checkup: true
      }
    ],
    
    // 当前时间
    currentTime: '',
    appointmentTime: '2025-12-10 09:00',
    
    // 提醒设置
    reminders: [
      { id: 1, name: '就诊前1小时', enabled: true },
      { id: 2, name: '检查结果出来', enabled: false },
      { id: 3, name: '用药时间', enabled: true },
      { id: 4, name: '复查提醒', enabled: true }
    ],
    
    // 当前步骤详情
    currentStepDetail: null,
    showStepDetail: false,
    
    // 是否正在就诊
    isInProcess: true,
    
    // 待办事项
    todos: [
      { id: 1, title: '带身份证和医保卡', completed: true },
      { id: 2, title: '准备既往病历资料', completed: true },
      { id: 3, title: '空腹8小时', completed: false },
      { id: 4, title: '准备问题清单', completed: false }
    ],
    
    // 当前状态
    status: {
      waiting: false,
      inProgress: true,
      completed: false
    }
  },

  onLoad() {
    console.log('就诊流程页面加载');
    this.updateCurrentTime();
    this.loadProcessFromStorage();
  },

  onShow() {
    // 每次显示页面时更新时间
    this.updateCurrentTime();
    
    // 检查是否有进行中的流程
    this.checkActiveProcess();
  },

  // 更新时间
  updateCurrentTime() {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    this.setData({ currentTime: timeStr });
  },

  // 从存储加载流程
  loadProcessFromStorage() {
    const savedProcess = wx.getStorageSync('currentMedicalProcess');
    if (savedProcess) {
      this.setData({
        currentProcess: savedProcess.process,
        processSteps: savedProcess.steps,
        isInProcess: savedProcess.isInProcess
      });
    }
  },

  // 检查是否有进行中的流程
  checkActiveProcess() {
    const history = wx.getStorageSync('diagnosisHistory') || [];
    if (history.length > 0) {
      const latest = history[0];
      if (latest.result && !latest.result.completed) {
        this.setData({
          isInProcess: true,
          appointmentTime: this.generateAppointmentTime()
        });
      }
    }
  },

  // 生成预约时间
  generateAppointmentTime() {
    const now = new Date();
    now.setDate(now.getDate() + 1); // 明天
    now.setHours(9, 0, 0, 0); // 上午9点
    
    return `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  },

  // 切换步骤状态
  toggleStepStatus(e) {
    const stepId = e.currentTarget.dataset.id;
    const steps = this.data.processSteps.map(step => {
      if (step.id === stepId) {
        if (step.status === 'current') {
          step.status = 'completed';
          
          // 激活下一个步骤
          const nextStep = this.data.processSteps.find(s => s.id === stepId + 1);
          if (nextStep) {
            nextStep.status = 'current';
          }
        }
      }
      return step;
    });
    
    this.setData({ processSteps: steps });
    
    // 保存到存储
    this.saveProcessToStorage();
    
    wx.showToast({
      title: '步骤已完成',
      icon: 'success'
    });
  },

  // 查看步骤详情
  viewStepDetail(e) {
    const stepId = e.currentTarget.dataset.id;
    const step = this.data.processSteps.find(s => s.id === stepId);
    
    this.setData({
      currentStepDetail: step,
      showStepDetail: true
    });
  },

  // 关闭步骤详情
  closeStepDetail() {
    this.setData({ showStepDetail: false });
  },

  // 切换待办事项
  toggleTodo(e) {
    const todoId = e.currentTarget.dataset.id;
    const todos = this.data.todos.map(todo => {
      if (todo.id === todoId) {
        todo.completed = !todo.completed;
      }
      return todo;
    });
    
    this.setData({ todos });
  },

  // 切换提醒
  toggleReminder(e) {
    const reminderId = e.currentTarget.dataset.id;
    const reminders = this.data.reminders.map(reminder => {
      if (reminder.id === reminderId) {
        reminder.enabled = !reminder.enabled;
      }
      return reminder;
    });
    
    this.setData({ reminders });
    
    const reminder = this.data.reminders.find(r => r.id === reminderId);
    wx.showToast({
      title: `${reminder.name} ${reminder.enabled ? '已开启' : '已关闭'}`,
      icon: 'none'
    });
  },

  // 选择流程
  selectProcess(e) {
    const processId = e.currentTarget.dataset.id;
    const process = this.data.otherProcesses.find(p => p.id === processId);
    
    wx.showModal({
      title: '切换就诊流程',
      content: `确定切换到${process.title}吗？`,
      success: (res) => {
        if (res.confirm) {
          this.setData({
            currentProcess: process,
            isInProcess: true
          });
          
          // 重置步骤状态
          const newSteps = this.resetStepsForProcess(process);
          this.setData({ processSteps: newSteps });
          
          // 保存到存储
          this.saveProcessToStorage();
          
          wx.showToast({
            title: '已切换到' + process.title,
            icon: 'success'
          });
        }
      }
    });
  },

  // 根据流程重置步骤
  resetStepsForProcess(process) {
    const baseSteps = JSON.parse(JSON.stringify(this.data.processSteps));
    
    if (process.id === 2) { // 急诊流程
      return baseSteps.slice(0, 3).map((step, index) => {
        step.status = index === 0 ? 'current' : 'pending';
        return step;
      });
    } else if (process.id === 3) { // 住院流程
      return baseSteps.map(step => {
        step.status = 'pending';
        return step;
      });
    }
    
    // 默认普通门诊流程
    return baseSteps.map((step, index) => {
      step.status = index === 0 ? 'completed' : index === 1 ? 'current' : 'pending';
      return step;
    });
  },

  // 保存流程到存储
  saveProcessToStorage() {
    const processData = {
      process: this.data.currentProcess,
      steps: this.data.processSteps,
      isInProcess: this.data.isInProcess,
      lastUpdated: new Date().toISOString()
    };
    
    wx.setStorageSync('currentMedicalProcess', processData);
  },

  // 开始就诊流程
  startProcess() {
    this.setData({ isInProcess: true });
    
    // 重置第一个步骤为当前状态
    const steps = this.data.processSteps.map((step, index) => {
      step.status = index === 0 ? 'current' : 'pending';
      return step;
    });
    
    this.setData({ processSteps: steps });
    this.saveProcessToStorage();
    
    wx.showToast({
      title: '就诊流程已开始',
      icon: 'success'
    });
  },

  // 完成就诊流程
  completeProcess() {
    wx.showModal({
      title: '完成就诊',
      content: '确定要标记为已完成吗？',
      success: (res) => {
        if (res.confirm) {
          // 更新历史记录
          const history = wx.getStorageSync('diagnosisHistory') || [];
          if (history.length > 0) {
            history[0].result.completed = true;
            history[0].result.completedAt = new Date().toLocaleString();
            wx.setStorageSync('diagnosisHistory', history);
          }
          
          this.setData({ 
            isInProcess: false,
            processSteps: this.data.processSteps.map(step => ({
              ...step,
              status: 'completed'
            }))
          });
          
          wx.showToast({
            title: '就诊已完成',
            icon: 'success'
          });
        }
      }
    });
  },

  // 分享流程
  shareProcess() {
    wx.showActionSheet({
      itemList: ['分享给微信好友', '生成分享卡片', '取消'],
      success: (res) => {
        if (res.tapIndex === 0) {
          this.shareToFriend();
        } else if (res.tapIndex === 1) {
          this.generateShareCard();
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

  // 生成分享卡片
  generateShareCard() {
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
  },

  // 查看流程统计
  viewStatistics() {
    const stats = {
      totalProcesses: 4,
      completedProcesses: 1,
      averageTime: '2.5小时',
      mostCommonProcess: '普通门诊'
    };
    
    wx.showModal({
      title: '就诊统计',
      content: `总流程数：${stats.totalProcesses}\n已完成：${stats.completedProcesses}\n平均耗时：${stats.averageTime}\n最常用流程：${stats.mostCommonProcess}`,
      showCancel: false,
      confirmText: '知道了'
    });
  },

  // 添加待办事项
  addTodo() {
    wx.showModal({
      title: '添加待办事项',
      content: '',
      editable: true,
      placeholderText: '请输入待办事项',
      success: (res) => {
        if (res.confirm && res.content) {
          const newTodo = {
            id: Date.now(),
            title: res.content,
            completed: false
          };
          
          const todos = [...this.data.todos, newTodo];
          this.setData({ todos });
          
          wx.showToast({
            title: '已添加',
            icon: 'success'
          });
        }
      }
    });
  },

  // 设置预约时间
  setAppointmentTime() {
    wx.showToast({
      title: '预约功能开发中',
      icon: 'none'
    });
  },

  // 微信分享
  onShareAppMessage() {
    return {
      title: `${this.data.currentProcess.title} - 就诊流程管理`,
      path: '/pages/process/process'
    };
  }
});