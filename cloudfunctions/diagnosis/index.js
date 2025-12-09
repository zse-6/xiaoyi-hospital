const cloud = require('wx-server-sdk') 
cloud.init() 
 
exports.main = async (event, context) =
  return { 
    success: true, 
    data: { 
      message: '分诊引擎云函数', 
      function: 'diagnosis' 
    } 
  } 
} 
