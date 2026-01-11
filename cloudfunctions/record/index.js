const cloud = require('wx-server-sdk')
cloud.init({
  env: 'cloud1-7g8bdxuy3b74f5b2D' 
})
const db = cloud.database()

exports.main = async (event, context) => {
  try {
    const { openid, symptoms, age, gender, recommendedDept, warningLevel } = event;
    await db.collection('diagnosis_record').add({
      data: {
        openid: openid,
        symptoms: symptoms,
        age: age,
        gender: gender,
        recommendedDept: recommendedDept,
        warningLevel: warningLevel,
        createTime: db.serverDate(),
        isCompleted: false
      }
    });
    return { code: 200, msg: "记录保存成功" };
  } catch (err) {
    console.error("记录保存失败：", err);
    return { code: 500, msg: "记录保存失败" };
  }
};