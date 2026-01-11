# security-fix.ps1
Write-Host "=== 安全修复：移除敏感信息 ===" -ForegroundColor Red

# 1. 备份敏感文件
Write-Host "[1/5] 备份敏感文件..." -ForegroundColor Yellow
$sensitiveFiles = @(
    "project.config.json",
    "project.private.config.json",
    "cloudfunctions/*/config.json"
)

foreach ($pattern in $sensitiveFiles) {
    Get-ChildItem $pattern -ErrorAction SilentlyContinue | ForEach-Object {
        $backupName = "$($_.Name).backup-$(Get-Date -Format 'yyyyMMdd')"
        Copy-Item $_.FullName $backupName
        Write-Host "   已备份: $($_.Name) → $backupName" -ForegroundColor Gray
    }
}

# 2. 从Git中移除敏感文件
Write-Host "[2/5] 从Git中移除敏感文件..." -ForegroundColor Yellow
Get-ChildItem -Recurse -Include *config*.json, *.env, *secret*, *key* | ForEach-Object {
    git rm --cached $_.FullName 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   已移除: $($_.Name)" -ForegroundColor Green
    }
}

# 3. 更新.gitignore
Write-Host "[3/5] 更新.gitignore..." -ForegroundColor Yellow
$securityRules = @'

# ============================================
# 安全配置 - 切勿提交以下文件到GitHub！
# ============================================

# 微信小程序敏感配置
project.private.config.json
project.config.json  # 如果包含AppID，也忽略

# API密钥和凭据
*.secret.*
*.key.*
*.token.*
app-secret.json
config-secret.json

# 环境变量
*.env
.env.local
.env.*.local
.env.production
.env.development

# 云函数配置
cloudfunctions/*/config.json
cloudfunctions/*/secret.*

# 备份文件
*.backup
*.backup-*
backup/

# 个人设置
*.user.*
*.personal.*

# ============================================
'@

if (Test-Path .gitignore) {
    $current = Get-Content .gitignore -Raw
    if (-not $current.Contains("# 安全配置")) {
        $securityRules + "`n" + $current | Set-Content .gitignore -Encoding UTF8
    }
} else {
    $securityRules | Set-Content .gitignore -Encoding UTF8
}

# 4. 创建配置模板
Write-Host "[4/5] 创建安全配置模板..." -ForegroundColor Yellow
$templateContent = @'
{
  "description": "项目配置文件 - 请勿提交真实AppID到GitHub",
  "packOptions": {
    "ignore": [],
    "include": []
  },
  "setting": {
    "urlCheck": false,
    "es6": true,
    "postcss": true,
    "minified": true,
    "newFeature": true,
    "autoAudits": false,
    "coverView": true,
    "showShadowRootInWxmlPanel": true,
    "scopeDataCheck": false
  },
  "compileType": "miniprogram",
  "libVersion": "2.19.0",
  "appid": "YOUR_APP_ID_HERE",  // ⚠️ 替换为您的真实AppID
  "projectname": "晓医智能导诊",
  "condition": {}
}
'@

$templateContent | Set-Content config-template.json -Encoding UTF8
Write-Host "   已创建: config-template.json" -ForegroundColor Green

# 5. 提交并推送
Write-Host "[5/5] 提交安全修复..." -ForegroundColor Yellow
git add .
git commit -m "security: 移除敏感信息，添加安全配置模板"
git push -u origin main --force

Write-Host "`n✅ 安全修复完成！" -ForegroundColor Green
Write-Host "⚠️ 重要提醒：" -ForegroundColor Red
Write-Host "1. 在GitHub上撤销暴露的密钥" -ForegroundColor Yellow
Write-Host "2. 访问: https://github.com/zse-6/xiaoyi-hospital/settings/secrets/security" -ForegroundColor Cyan
Write-Host "3. 点击 'Revoke' 撤销已暴露的密钥" -ForegroundColor Cyan
Write-Host "4. 在微信公众平台重新生成AppSecret" -ForegroundColor Cyan