// miniprogram/pages/login/login.js
Page({
  data: {
    phone: '',
    code: '',
    countdown: 0,
    timer: null
  },

  onLoad() {
    // 检查是否已登录
    const token = wx.getStorageSync('token')
    if (token) {
      this.goBackToIndex()
    }
  },

  onUnload() {
    // 清除定时器
    if (this.data.timer) {
      clearInterval(this.data.timer)
    }
  },

  // 手机号输入
  onPhoneInput(e) {
    this.setData({
      phone: e.detail.value.replace(/\D/g, '')
    })
  },

  // 验证码输入
  onCodeInput(e) {
    this.setData({
      code: e.detail.value.replace(/\D/g, '')
    })
  },

  // 获取验证码
  getCode() {
    const { phone, countdown } = this.data
    
    if (!phone) {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none'
      })
      return
    }
    
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      })
      return
    }
    
    if (countdown > 0) return
    
    // 这里调用获取验证码的API
    wx.showLoading({
      title: '发送中...'
    })
    
    // 模拟API请求
    setTimeout(() => {
      wx.hideLoading()
      wx.showToast({
        title: '验证码已发送',
        icon: 'success'
      })
      
      // 开始倒计时
      this.startCountdown()
    }, 1000)
  },

  // 开始倒计时
  startCountdown() {
    this.setData({
      countdown: 60
    })
    
    const timer = setInterval(() => {
      if (this.data.countdown <= 1) {
        clearInterval(timer)
        this.setData({
          countdown: 0,
          timer: null
        })
      } else {
        this.setData({
          countdown: this.data.countdown - 1
        })
      }
    }, 1000)
    
    this.setData({ timer })
  },

  // 登录/注册
  login() {
    const { phone, code } = this.data
    
    if (!phone) {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none'
      })
      return
    }
    
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      })
      return
    }
    
    if (!code) {
      wx.showToast({
        title: '请输入验证码',
        icon: 'none'
      })
      return
    }
    
    wx.showLoading({
      title: '登录中...'
    })
    
    // 模拟登录API请求
    setTimeout(() => {
      wx.hideLoading()
      
      // 模拟登录成功
      const userInfo = {
        phone: phone,
        userId: 'user_' + Date.now(),
        name: '用户' + phone.slice(-4),
        avatar: '/images/default-avatar.png'
      }
      
      // 保存登录状态
      wx.setStorageSync('token', 'mock_token_' + Date.now())
      wx.setStorageSync('userInfo', userInfo)
      wx.setStorageSync('isLogin', true)
      
      wx.showToast({
        title: '登录成功',
        icon: 'success',
        duration: 1500,
        success: () => {
          setTimeout(() => {
            this.goBackToIndex()
          }, 1500)
        }
      })
    }, 1500)
  },

  // 微信手机号一键登录
  onGetPhoneNumber(e) {
    if (e.detail.errMsg === 'getPhoneNumber:ok') {
      // 这里可以调用后端接口解密手机号并登录
      wx.showLoading({
        title: '登录中...'
      })
      
      setTimeout(() => {
        wx.hideLoading()
        
        // 模拟登录成功
        const userInfo = {
          phone: '138****8888',
          userId: 'wx_user_' + Date.now(),
          name: '微信用户',
          avatar: '/images/wx-avatar.png'
        }
        
        wx.setStorageSync('token', 'wx_token_' + Date.now())
        wx.setStorageSync('userInfo', userInfo)
        wx.setStorageSync('isLogin', true)
        
        wx.showToast({
          title: '登录成功',
          icon: 'success',
          duration: 1500,
          success: () => {
            setTimeout(() => {
              this.goBackToIndex()
            }, 1500)
          }
        })
      }, 1500)
    } else {
      wx.showToast({
        title: '用户拒绝授权',
        icon: 'none'
      })
    }
  },

  // 返回首页
  goBackToIndex() {
    // 获取上一页路径
    const pages = getCurrentPages()
    if (pages.length > 1) {
      wx.navigateBack()
    } else {
      wx.switchTab({
        url: '/pages/index/index'
      })
    }
  }
})