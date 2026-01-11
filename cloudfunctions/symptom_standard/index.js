const cloud = require('wx-server-sdk')
cloud.init({
  env: 'cloud1-7g8bdxuy3b74f5b2D' 
})
const db = cloud.database()

exports.main = async (event, context) => {
  try {
    const { symptoms } = event;
    const standardSymptoms = [];

    for (const symptom of symptoms) {
      const res = await db.collection('symptom_standard')
        .where({
          originalSymptom: db.RegExp({ regexp: symptom.trim(), options: 'i' })
        })
        .get();

      if (res.data.length > 0) {
        standardSymptoms.push(res.data[0].standardSymptom);
      } else {
        standardSymptoms.push(symptom.trim());
      }
    }

    const uniqueStandardSymptoms = [...new Set(standardSymptoms)];
    return {
      code: 200,
      data: { standardSymptoms: uniqueStandardSymptoms },
      msg: "症状标准化成功"
    };
  } catch (err) {
    console.error("症状标准化失败：", err);
    return { code: 500, msg: "症状处理失败，请重试" };
  }
};