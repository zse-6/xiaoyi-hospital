// miniprogram/pages/patient/add.js
Page({
  data: {
    idTypes: ['居民身份证', '护照', '军官证', '港澳居民来往内地通行证', '台湾居民来往大陆通行证'],
    hospitalName: '单外深圳医院',
    
    formData: {
      name: '',
      idType: '居民身份证',
      idTypeIndex: 0,
      idNumber: '',
      agree: false
    },
    
    editMode: false,
    patientId: null,
    isSubmitting: false
  },

  onLoad(options) {
    // 如果是编辑模式，获取就诊人ID
    if (options.id) {
      this.setData({ 
        editMode: true, 
        patientId: options.id 
      });
      wx.setNavigationBarTitle({
        title: '编辑就诊人'
      });
      this.loadPatientData(options.id);
    }
  },

  // 加载就诊人数据（编辑模式）
  loadPatientData(id) {
    const patientList = wx.getStorageSync('patientList') || [];
    const patient = patientList.find(p => p.id === id);
    
    if (patient) {
      const formData = {
        name: patient.name,
        idType: patient.idType || '居民身份证',
        idTypeIndex: this.data.idTypes.indexOf(patient.idType || '居民身份证'),
        idNumber: patient.idCard,
        agree: true
      };
      
      this.setData({ formData });
    }
  },

  // 选择证件类型
  onIdTypeChange(e) {
    const index = e.detail.value;
    const formData = this.data.formData;
    formData.idType = this.data.idTypes[index];
    formData.idTypeIndex = index;
    this.setData({ formData });
  },

  // 协议选择
  onAgreementChange(e) {
    const formData = this.data.formData;
    formData.agree = e.detail.value.length > 0;
    this.setData({ formData });
  },

  // 提交表单
  submitForm(e) {
    const formData = e.detail.value;
    
    // 验证必填字段
    if (!this.validateForm(formData)) {
      return;
    }
    
    if (this.data.editMode) {
      this.updatePatient(formData);
    } else {
      this.addPatient(formData);
    }
  },

  // 验证表单
  validateForm(data) {
    if (!data.name || !data.name.trim()) {
      wx.showToast({ 
        title: '请输入姓名', 
        icon: 'none',
        duration: 2000
      });
      return false;
    }
    
    if (!data.idNumber || !data.idNumber.trim()) {
      wx.showToast({ 
        title: '请输入证件号码', 
        icon: 'none',
        duration: 2000
      });
      return false;
    }
    
    if (!this.data.formData.agree) {
      wx.showToast({ 
        title: '请同意用户协议', 
        icon: 'none',
        duration: 2000
      });
      return false;
    }
    
    return true;
  },

  // 添加就诊人
  addPatient(data) {
    this.setData({ isSubmitting: true });
    
    // 生成就诊人ID和档案号
    const id = 'patient_' + Date.now();
    const outpatientNo = '0077' + Math.floor(Math.random() * 100000000).toString().padStart(8, '0') + '062';
    
    // 获取当前用户信息
    const userInfo = wx.getStorageSync('userInfo');
    
    const newPatient = {
      id: id,
      name: data.name.trim(),
      idType: data.idType || '居民身份证',
      idCard: data.idNumber.trim(),
      outpatientNo: outpatientNo,
      relationship: userInfo && data.name.trim() === userInfo.name ? '本人' : '其他',
      createTime: new Date().toISOString(),
      isDefault: false
    };
    
    // 获取现有就诊人列表
    let patientList = wx.getStorageSync('patientList') || [];
    
    // 检查是否已存在相同证件号的就诊人
    const existingPatient = patientList.find(p => p.idCard === newPatient.idCard);
    if (existingPatient) {
      this.setData({ isSubmitting: false });
      wx.showModal({
        title: '提示',
        content: '该证件号已存在就诊人记录',
        showCancel: false
      });
      return;
    }
    
    // 如果是第一个就诊人，设为默认
    if (patientList.length === 0) {
      newPatient.isDefault = true;
      newPatient.relationship = '本人';
    }
    
    // 添加到列表
    patientList.push(newPatient);
    
    // 保存到本地存储
    wx.setStorageSync('patientList', patientList);
    
    // 如果是第一个就诊人，设为当前就诊人
    if (patientList.length === 1) {
      wx.setStorageSync('currentPatientId', id);
    }
    
    this.setData({ isSubmitting: false });
    
    wx.showToast({
      title: '添加成功',
      icon: 'success',
      duration: 1500,
      success: () => {
        setTimeout(() => {
          wx.navigateBack();
        }, 1500);
      }
    });
  },

  // 更新就诊人（编辑模式）
  updatePatient(data) {
    this.setData({ isSubmitting: true });
    
    let patientList = wx.getStorageSync('patientList') || [];
    const index = patientList.findIndex(p => p.id === this.data.patientId);
    
    if (index !== -1) {
      // 检查是否修改了证件号，如果修改了需要检查是否重复
      if (data.idNumber.trim() !== patientList[index].idCard) {
        const existingPatient = patientList.find(p => p.idCard === data.idNumber.trim() && p.id !== this.data.patientId);
        if (existingPatient) {
          this.setData({ isSubmitting: false });
          wx.showModal({
            title: '提示',
            content: '该证件号已存在就诊人记录',
            showCancel: false
          });
          return;
        }
      }
      
      patientList[index] = {
        ...patientList[index],
        name: data.name.trim(),
        idType: data.idType || '居民身份证',
        idCard: data.idNumber.trim(),
        updateTime: new Date().toISOString()
      };
      
      wx.setStorageSync('patientList', patientList);
      
      this.setData({ isSubmitting: false });
      
      wx.showToast({
        title: '更新成功',
        icon: 'success',
        duration: 1500,
        success: () => {
          setTimeout(() => {
            wx.navigateBack();
          }, 1500);
        }
      });
    } else {
      this.setData({ isSubmitting: false });
    }
  }
});