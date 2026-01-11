// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const { symptoms, age, gender } = event
  
  // 这里实现你的分诊逻辑（决策树算法）
  // 根据症状匹配科室
  const result = diagnosisLogic(symptoms, age, gender)
  
  return {
    success: true,
    data: result
  }
}

// 分诊逻辑（简化版）
function diagnosisLogic(symptoms, age, gender) {
  const rules = {
    '头痛+发热': '发热门诊',
    '头痛+恶心+呕吐': '神经内科',
    '腹痛+腹泻': '消化内科',
    '胸痛+呼吸困难': '急诊科',
    '咳嗽+发热': '呼吸内科',
    '关节痛': age > 50 ? '风湿免疫科' : '骨科',
    '皮疹': '皮肤科',
    '视力模糊': '眼科',
    '耳痛': '耳鼻喉科'
  }
  
  const symptomKey = symptoms.join('+')
  let department = rules[symptomKey] || '全科医学科'
  
  return {
    department,
    confidence: 0.85,
    suggestion: `根据您的症状，建议前往${department}就诊。如症状加重，请及时就医。`,
    emergency: symptomKey.includes('胸痛') || symptomKey.includes('呼吸困难')
  }
}