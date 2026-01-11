// miniprogram/pages/patient/select.js
Page({
  data: {
    patientList: [],
    currentPatientId: null
  },

  onLoad() {
    this.loadPatientList();
  },

  onShow() {
    this.loadPatientList();
  },

  loadPatientList() {
    const patientList = wx.getStorageSync('patientList') || [];
    const currentPatientId = wx.getStorageSync('currentPatientId');
    
    this.setData({
      patientList,
      currentPatientId
    });
  },

  // 格式化身份证号（显示首尾，中间用*代替）
  formatIdCard(idCard) {
    if (!idCard || idCard.length < 18) return idCard;
    return idCard.substring(0, 3) + '*'.repeat(11) + idCard.substring(14);
  },

  // 格式化门诊档案号
  formatMedicalNo(medicalNo) {
    if (!medicalNo || medicalNo.length < 8) return medicalNo;
    return medicalNo.substring(0, 4) + '*'.repeat(8) + medicalNo.substring(12);
  },

  // 选择就诊人
  selectPatient(e) {
    const patientId = e.currentTarget.dataset.id;
    
    // 更新当前就诊人
    wx.setStorageSync('currentPatientId', patientId);
    
    wx.showToast({
      title: '切换成功',
      icon: 'success',
      duration: 1000,
      success: () => {
        setTimeout(() => {
          wx.navigateBack();
        }, 1000);
      }
    });
  },

  // 编辑就诊人
  editPatient(e) {
    e.stopPropagation();
    const patientId = e.currentTarget.dataset.id;
    
    wx.navigateTo({
      url: `/pages/patient/add?id=${patientId}`
    });
  },

  // 删除就诊人
  deletePatient(e) {
    e.stopPropagation();
    const patientId = e.currentTarget.dataset.id;
    const patientList = this.data.patientList;
    const patient = patientList.find(p => p.id === patientId);
    
    if (patient && patient.relationship === '本人') {
      wx.showToast({
        title: '本人就诊人不能删除',
        icon: 'none'
      });
      return;
    }
    
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这个就诊人吗？删除后可能影响就医记录。',
      confirmText: '删除',
      confirmColor: '#ff4444',
      success: (res) => {
        if (res.confirm) {
          this.deletePatientById(patientId);
        }
      }
    });
  },

  deletePatientById(patientId) {
    let patientList = wx.getStorageSync('patientList') || [];
    const index = patientList.findIndex(p => p.id === patientId);
    
    if (index !== -1) {
      // 检查是否为当前就诊人
      const currentPatientId = wx.getStorageSync('currentPatientId');
      if (currentPatientId === patientId) {
        // 如果删除的是当前就诊人，切换到第一个就诊人
        const newPatient = patientList[0]?.id === patientId ? patientList[1] : patientList[0];
        if (newPatient) {
          wx.setStorageSync('currentPatientId', newPatient.id);
        } else {
          wx.removeStorageSync('currentPatientId');
        }
      }
      
      // 删除就诊人
      patientList.splice(index, 1);
      
      wx.setStorageSync('patientList', patientList);
      
      // 重新加载列表
      this.loadPatientList();
      
      wx.showToast({
        title: '删除成功',
        icon: 'success'
      });
    }
  },

  // 添加就诊人
  gotoAddPatient() {
    wx.navigateTo({
      url: '/pages/patient/add'
    });
  }
});