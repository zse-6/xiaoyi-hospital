Component({
  properties: {
    // 组件外部传入的已选部位列表（支持name或id）
    value: {
      type: Array,
      value: []
    },
    // 是否多选
    multiple: {
      type: Boolean,
      value: false
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      value: false
    },
    // 是否显示标题栏
    showHeader: {
      type: Boolean,
      value: true
    }
  },

  data: {
    // 人体部位数据
    bodyParts: [
      {
        id: 'head',
        name: '头部',
        icon: '👤',
        description: '头痛、头晕、耳鸣、视力模糊',
        displayDesc: '', // 用于显示已选症状的描述
        position: { x: 50, y: 10 },
        size: 80,
        symptoms: ['头痛', '头晕', '耳鸣', '视力模糊', '鼻塞', '牙痛']
      },
      {
        id: 'neck',
        name: '颈部',
        icon: '💪',
        description: '喉咙痛、颈椎痛、甲状腺问题',
        displayDesc: '',
        position: { x: 50, y: 22 },
        size: 60,
        symptoms: ['喉咙痛', '颈椎痛', '吞咽困难', '颈部肿块']
      },
      {
        id: 'chest',
        name: '胸部',
        icon: '🫀',
        description: '胸痛、胸闷、心悸、呼吸困难',
        displayDesc: '',
        position: { x: 50, y: 35 },
        size: 100,
        symptoms: ['胸痛', '胸闷', '心悸', '呼吸困难', '咳嗽', '乳房胀痛']
      },
      {
        id: 'abdomen',
        name: '腹部',
        icon: '🫁',
        description: '腹痛、腹泻、恶心、胃胀',
        displayDesc: '',
        position: { x: 50, y: 55 },
        size: 120,
        symptoms: ['腹痛', '腹泻', '恶心', '呕吐', '胃胀', '消化不良']
      },
      {
        id: 'back',
        name: '背部',
        icon: '🦴',
        description: '腰痛、背痛、脊柱问题',
        displayDesc: '',
        position: { x: 50, y: 75 },
        size: 100,
        symptoms: ['腰痛', '背痛', '脊柱痛', '肌肉酸痛']
      },
      {
        id: 'limbs',
        name: '四肢',
        icon: '🦵',
        description: '关节痛、肿胀、麻木、无力',
        displayDesc: '',
        position: { x: 25, y: 40 },
        size: 60,
        symptoms: ['关节痛', '肿胀', '麻木', '无力', '肌肉痛', '皮肤问题']
      }
    ],
    
    // 选中的部位
    selectedParts: [],
    // 选中部位的ID列表（用于WXML判断选中状态）
    selectedIds: [],
    // 存储“部位ID-选中症状”的映射
    selectedSymptomMap: {},
    
    // 当前显示的症状列表（带选中状态）
    currentSymptoms: [],
    // 是否显示症状选择弹窗
    showSymptomModal: false,
    // 当前选中的部位ID
    currentPartId: '',
    // 当前选中的部位名称
    currentPartName: ''
  },

  lifetimes: {
    attached() {
      // 初始化选中的部位
      this.initSelectedParts();
    }
  },

  methods: {
    // 初始化选中部位
    initSelectedParts() {
      if (!this.properties.value || this.properties.value.length === 0) return;
      
      const selectedParts = this.properties.value.map(item => {
        // 支持传入part.id或part.name匹配
        return this.data.bodyParts.find(part => 
          part.id === item || part.name === item
        );
      }).filter(Boolean); // 过滤匹配失败的项
      
      // 初始化选中ID列表
      const selectedIds = selectedParts.map(part => part.id);
      
      this.setData({ 
        selectedParts,
        selectedIds
      });
    },

    // 点击人体部位
    onBodyPartTap(e) {
      if (this.properties.disabled) return;
      
      const partId = e.currentTarget.dataset.id;
      const part = this.data.bodyParts.find(p => p.id === partId);
      
      if (!part) return;
      
      // 更新选中状态
      let selectedParts = [...this.data.selectedParts];
      let selectedIds = [...this.data.selectedIds];
      const partIndex = selectedParts.findIndex(p => p.id === partId);
      
      if (this.properties.multiple) {
        // 多选模式
        if (partIndex > -1) {
          // 取消选中：移除部位和对应症状
          selectedParts.splice(partIndex, 1);
          selectedIds = selectedIds.filter(id => id !== partId);
          const newSymptomMap = { ...this.data.selectedSymptomMap };
          delete newSymptomMap[partId];
          this.setData({ selectedSymptomMap: newSymptomMap });
        } else {
          // 新增选中：添加部位
          selectedParts.push(part);
          selectedIds.push(partId);
        }
      } else {
        // 单选模式：先清空所有选中
        selectedParts = partIndex > -1 ? [] : [part];
        selectedIds = partIndex > -1 ? [] : [partId];
        // 清空症状映射（单选时只保留当前部位症状）
        const newSymptomMap = {};
        if (selectedParts.length > 0) {
          newSymptomMap[partId] = this.data.selectedSymptomMap[partId] || [];
        }
        this.setData({ selectedSymptomMap: newSymptomMap });
      }
      
      this.setData({ 
        selectedParts,
        selectedIds
      });
      
      // 显示症状选择弹窗（仅选中时显示）
      if (selectedParts.includes(part)) {
        this.showSymptomSelection(part);
      }
      
      // 通知父组件选中状态变化
      this.triggerEvent('change', {
        value: selectedParts.map(p => p.name),
        parts: selectedParts,
        selectedSymptomMap: this.data.selectedSymptomMap
      });
    },

    // 显示症状选择弹窗（带已选状态）
    showSymptomSelection(part) {
      const { selectedSymptomMap } = this.data;
      // 给症状列表添加选中状态标记
      const currentSymptoms = part.symptoms.map(symptom => ({
        name: symptom,
        isSelected: selectedSymptomMap[part.id]?.includes(symptom) || false
      }));
      
      this.setData({
        currentPartId: part.id,
        currentPartName: part.name,
        currentSymptoms: currentSymptoms,
        showSymptomModal: true
      });
    },

    // 选择症状
    onSymptomSelect(e) {
      const symptom = e.currentTarget.dataset.symptom;
      const { currentPartId } = this.data;
      
      // 更新症状映射
      const newSymptomMap = { ...this.data.selectedSymptomMap };
      if (newSymptomMap[currentPartId]) {
        // 去重：已选中则移除，未选中则添加
        const symptomIndex = newSymptomMap[currentPartId].indexOf(symptom);
        if (symptomIndex > -1) {
          newSymptomMap[currentPartId].splice(symptomIndex, 1);
        } else {
          newSymptomMap[currentPartId].push(symptom);
        }
      } else {
        newSymptomMap[currentPartId] = [symptom];
      }
      
      // 更新部位的显示描述（原描述 + 已选症状）
      const bodyParts = [...this.data.bodyParts];
      const partIndex = bodyParts.findIndex(p => p.id === currentPartId);
      if (partIndex > -1) {
        const selectedSymptoms = newSymptomMap[currentPartId] || [];
        bodyParts[partIndex].displayDesc = selectedSymptoms.length > 0 
          ? `${bodyParts[partIndex].description}\n已选症状：${selectedSymptoms.map(s => `●${s}`).join(' ')}`
          : bodyParts[partIndex].description;
      }
      
      this.setData({ 
        selectedSymptomMap: newSymptomMap,
        bodyParts
      });
      
      // 刷新症状弹窗的选中状态
      this.showSymptomSelection(this.data.bodyParts.find(p => p.id === currentPartId));
      
      // 通知父组件症状选择结果
      this.triggerEvent('symptomselect', {
        symptom,
        partId: currentPartId,
        partName: this.data.currentPartName,
        selectedSymptomMap: newSymptomMap
      });
    },

    // 关闭症状弹窗
    closeSymptomModal() {
      this.setData({
        showSymptomModal: false,
        currentSymptoms: [],
        currentPartId: '',
        currentPartName: ''
      });
    },

    // 清除所有选中
    clearSelection() {
      this.setData({
        selectedParts: [],
        selectedIds: [],
        selectedSymptomMap: {}
      });
      
      // 重置部位显示描述
      const bodyParts = this.data.bodyParts.map(part => ({
        ...part,
        displayDesc: ''
      }));
      this.setData({ bodyParts });
      
      // 通知父组件
      this.triggerEvent('change', {
        value: [],
        parts: [],
        selectedSymptomMap: {}
      });
    },

    // 获取选中的部位
    getSelectedParts() {
      return this.data.selectedParts;
    },

    // 获取选中的症状
    getSelectedSymptoms() {
      return Object.values(this.data.selectedSymptomMap).flat();
    },

    // 获取用于分诊的完整数据（核心方法）
    getTriageData() {
      const { selectedParts, selectedSymptomMap } = this.data;
      return selectedParts.map(part => ({
        partId: part.id,
        partName: part.name,
        symptoms: selectedSymptomMap[part.id] || []
      })).filter(item => item.symptoms.length > 0);
    }
  }
});