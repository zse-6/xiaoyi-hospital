# 症状数据清洗脚本 
import pandas as pd 
import json 
 
def clean_symptom_data(input_file, output_file): 
    # 读取数据 
    df = pd.read_csv(input_file, encoding='utf-8') 
    print(f"原始数据: {len(df)} 条") 
 
    # 症状标准化（示例） 
    symptom_mapping = { 
        '头疼': '头痛', 
        '发烧': '发热', 
        '拉肚子': '腹泻' 
    } 
 
    df['symptom_clean'] = df['symptom'].replace(symptom_mapping) 
 
    # 保存清洗后的数据 
    df.to_csv(output_file, index=False, encoding='utf-8') 
    print(f"清洗后数据: {len(df)} 条") 
    print(f"已保存到: {output_file}") 
