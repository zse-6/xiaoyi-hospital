// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: 'cloud1-7g8bdxuy3b74f5b2D' 
})
const db = cloud.database()

exports.main = async (event, context) => {
  try {
    // 接收前端传来的参数（标准化后的症状、年龄、性别）
    const { standardSymptoms, age, gender } = event;
    const symptomCombination = standardSymptoms.join('+');

    // 1. 决策树第一层：精确匹配症状组合
    let exactMatch = await db.collection('symptom_rule')
      .where({ symptomCombination: symptomCombination })
      .orderBy('priority', 'asc')
      .get();

    if (exactMatch.data.length > 0) {
      const result = exactMatch.data[0];
      // 结合年龄/性别调整推荐（决策树分支）
      const finalResult = adjustByAgeGender(result, age, gender);
      // 关联导航和流程数据
      const [navigation, processSteps] = await Promise.all([
        getNavigation(finalResult.department),
        getProcessSteps(finalResult.department)
      ]);
      return {
        code: 200,
        data: {
          department: finalResult.department,
          warningLevel: finalResult.warningLevel,
          reason: finalResult.reason,
          navigation,
          processSteps
        },
        msg: "分诊成功"
      };
    }

    // 2. 决策树第二层：模糊匹配（关键词）
    let fuzzyMatch = await db.collection('symptom_rule')
      .where({
        symptomCombination: db.RegExp({
          regexp: standardSymptoms.join('|'),
          options: 'i' // 不区分大小写
        })
      })
      .orderBy('priority', 'asc')
      .get();

    if (fuzzyMatch.data.length > 0) {
      const result = fuzzyMatch.data[0];
      const finalResult = adjustByAgeGender(result, age, gender);
      const [navigation, processSteps] = await Promise.all([
        getNavigation(finalResult.department),
        getProcessSteps(finalResult.department)
      ]);
      return {
        code: 200,
        data: {
          department: finalResult.department,
          warningLevel: finalResult.warningLevel,
          reason: finalResult.reason,
          navigation,
          processSteps
        },
        msg: "分诊成功"
      };
    }

    // 3. 兜底推荐：全科门诊
    const [navigation, processSteps] = await Promise.all([
      getNavigation("全科门诊"),
      getProcessSteps("全科门诊")
    ]);
    return {
      code: 200,
      data: {
        department: "全科门诊",
        warningLevel: "无",
        reason: "症状组合未匹配到特定科室，建议全科初步诊断",
        navigation,
        processSteps
      },
      msg: "分诊成功"
    };
  } catch (err) {
    console.error("分诊失败：", err);
    return { code: 500, msg: "分诊服务异常，请重试" };
  }
};

// 辅助函数：根据年龄性别调整推荐（决策树分支逻辑）
function adjustByAgeGender(result, age, gender) {
  const ageNum = parseInt(age);
  // 60岁以上患者，心血管相关症状优先级提升
  if (ageNum >= 60 && result.department.includes("心血管内科")) {
    result.reason += "（老年患者心血管疾病风险较高，优先推荐）";
  }
  // 女性患者，妇科相关症状补充提示
  if (gender === "female" && result.symptomCombination.includes("腹痛")) {
    result.reason += "（女性患者若伴随月经异常，可考虑妇科就诊）";
  }
  return result;
}

// 辅助函数：获取院内导航数据
async function getNavigation(department) {
  const res = await db.collection('hospital_nav')
    .where({ department: department })
    .get();
  return res.data.length > 0 ? res.data[0] : null;
}

// 辅助函数：获取就医流程步骤
async function getProcessSteps(department) {
  const res = await db.collection('medical_process')
    .where({ processType: `${department}就诊` })
    .get();
  return res.data.length > 0 ? res.data[0] : null;
}