const cloud = require('wx-server-sdk')
cloud.init({
  env: 'cloud1-7g8bdxuy3b74f5b2D' 
})
const db = cloud.database()

exports.main = async (event, context) => {
  try {
    const { department } = event;
    const navRes = await db.collection('hospital_nav')
      .where({ department: department })
      .get();
    const processRes = await db.collection('medical_process')
      .where({ processType: `${department}就诊` })
      .get();
    return {
      code: 200,
      data: {
        navigation: navRes.data.length > 0 ? navRes.data[0] : null,
        processSteps: processRes.data.length > 0 ? processRes.data[0] : null
      },
      msg: "查询成功"
    };
  } catch (err) {
    console.error("导航查询失败：", err);
    return { code: 500, msg: "查询失败，请重试" };
  }
};