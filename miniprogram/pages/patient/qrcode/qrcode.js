// miniprogram/pages/patient/qrcode.js
const QRCode = require('../../utils/qrcode.js') // 需要引入二维码生成库

Page({
  data: {
    patientInfo: null
  },

  onLoad(options) {
    if (options.id) {
      this.loadPatientInfo(options.id)
    }
  },

  loadPatientInfo(patientId) {
    const patientList = wx.getStorageSync('patientList') || []
    const patient = patientList.find(p => p.id === patientId)
    
    if (patient) {
      this.setData({ patientInfo: patient })
      
      // 生成二维码
      this.generateQRCode(patient)
    }
  },

  generateQRCode(patient) {
    // 生成二维码数据
    const qrData = JSON.stringify({
      patientId: patient.id,
      name: patient.name,
      idCard: patient.idCard,
      outpatientNo: patient.outpatientNo,
      timestamp: Date.now(),
      type: 'patient_qrcode'
    })
    
    // 使用二维码库生成
    new QRCode('qrcodeCanvas', {
      text: qrData,
      width: 200,
      height: 200,
      colorDark: '#000000',
      colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.H
    })
  }
})