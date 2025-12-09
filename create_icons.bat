@echo off
chcp 65001 > nul
echo ========================================
echo   晓医小程序 - 最终修复脚本
echo ========================================
echo.

cd /d D:\MyProjects\Xiaoyi-Medical-Guide\miniprogram

echo [1/3] 修复 app.js...
echo // app.js - 小程序入口文件 > app.js
echo App({ >> app.js
echo   onLaunch: function () { >> app.js
echo     console.log('晓医小程序启动'); >> app.js
echo     >> app.js
echo     // 初始化云开发（暂时注释，需要你的云环境ID） >> app.js
echo     // wx.cloud.init({ >> app.js
echo     //   env: 'YOUR-CLOUD-ENV-ID', // 需要替换为你的云环境ID >> app.js
echo     //   traceUser: true >> app.js
echo     // }); >> app.js
echo     >> app.js
echo     // 获取系统信息 >> app.js
echo     wx.getSystemInfo({ >> app.js
echo       success: res => { >> app.js
echo         this.globalData.systemInfo = res; >> app.js
echo         console.log('系统信息:', res); >> app.js
echo       } >> app.js
echo     }); >> app.js
echo   }, >> app.js
echo   >> app.js
echo   globalData: { >> app.js
echo     userInfo: null, >> app.js
echo     systemInfo: null, >> app.js
echo     diagnosisHistory: [], >> app.js
echo     currentHospital: null >> app.js
echo   } >> app.js
echo }) >> app.js

echo [2/3] 修复 app.json...
echo { > app.json
echo   "pages": [ >> app.json
echo     "pages/index/index", >> app.json
echo     "pages/triage/triage", >> app.json
echo     "pages/navigation/navigation", >> app.json
echo     "pages/process/process", >> app.json
echo     "pages/mine/mine", >> app.json
echo     "pages/result/result" >> app.json
echo   ], >> app.json
echo   "window": { >> app.json
echo     "backgroundTextStyle": "light", >> app.json
echo     "navigationBarBackgroundColor": "#2a8ce5", >> app.json
echo     "navigationBarTitleText": "晓医智能导诊", >> app.json
echo     "navigationBarTextStyle": "white", >> app.json
echo     "backgroundColor": "#f5f5f5" >> app.json
echo   }, >> app.json
echo   "tabBar": { >> app.json
echo     "color": "#999999", >> app.json
echo     "selectedColor": "#2a8ce5", >> app.json
echo     "backgroundColor": "#ffffff", >> app.json
echo     "borderStyle": "black", >> app.json
echo     "list": [ >> app.json
echo       { >> app.json
echo         "pagePath": "pages/index/index", >> app.json
echo         "text": "首页", >> app.json
echo         "iconPath": "images/icons/home.png", >> app.json
echo         "selectedIconPath": "images/icons/home-active.png" >> app.json
echo       }, >> app.json
echo       { >> app.json
echo         "pagePath": "pages/triage/triage", >> app.json
echo         "text": "分诊", >> app.json
echo         "iconPath": "images/icons/diagnosis.png", >> app.json
echo         "selectedIconPath": "images/icons/diagnosis-active.png" >> app.json
echo       }, >> app.json
echo       { >> app.json
echo         "pagePath": "pages/mine/mine", >> app.json
echo         "text": "我的", >> app.json
echo         "iconPath": "images/icons/profile.png", >> app.json
echo         "selectedIconPath": "images/icons/profile-active.png" >> app.json
echo       } >> app.json
echo     ] >> app.json
echo   }, >> app.json
echo   "permission": { >> app.json
echo     "scope.record": { >> app.json
echo       "desc": "需要您的语音授权进行语音输入" >> app.json
echo     }, >> app.json
echo     "scope.userLocation": { >> app.json
echo       "desc": "需要获取您的位置信息提供院内导航" >> app.json
echo     } >> app.json
echo   }, >> app.json
echo   "requiredPrivateInfos": ["getLocation"], >> app.json
echo   "style": "v2", >> app.json
echo   "sitemapLocation": "sitemap.json" >> app.json
echo } >> app.json

echo [3/3] 创建简单的首页 index.js...
echo Page({ > pages\index\index.js
echo   data: { >> pages\index\index.js
echo     motto: '晓医智能导诊' >> pages\index\index.js
echo   }, >> pages\index\index.js
echo   onLoad() { >> pages\index\index.js
echo     console.log('首页加载成功'); >> pages\index\index.js
echo   } >> pages\index\index.js
echo }) >> pages\index\index.js

echo {} > pages\index\index.json

echo <view class="container"> > pages\index\index.wxml
echo   <text>{{motto}}</text> >> pages\index\index.wxml
echo </view> >> pages\index\index.wxml

echo .container { > pages\index\index.wxss
echo   padding: 100rpx; >> pages\index\index.wxss
echo   text-align: center; >> pages\index\index.wxss
echo   font-size: 48rpx; >> pages\index\index.wxss
echo   color: #2a8ce5; >> pages\index\index.wxss
echo } >> pages\index\index.wxss

echo.
echo ========================================
echo   修复完成！
echo ========================================
echo.
echo 📱 现在应该能正常启动了！
echo 操作步骤：
echo 1. 点击"编译"按钮
echo 2. 或者重启微信开发者工具
echo.
echo ✅ 如果还有错误，请截图发给我
echo.
pause