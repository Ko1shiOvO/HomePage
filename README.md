# 🌸 东方Project风格个人主页

一个美观的个人主页，采用东方Project二次元风格设计，集成GitHub实时数据、精美动画效果和社交链接。

---

## 📑 文档导航

- [✨ 主要功能](#主要功能)
- [🚀 快速开始](#快速开始)
- [📝 配置说明](#配置说明)
- [🎨 高级功能](#高级功能)
- [🔧 常见问题](#常见问题)
- [📂 文件结构](#文件结构)
- [📚 技术栈](#技术栈)

---

## ✨ 主要功能

- 🎨 **东方Project风格设计**
  - 符卡式UI设计
  - 霓虹光效和炫彩渐变
  - 日本传统元素装饰
  - 平滑的魔法特效动画

- 📊 **GitHub集成**
  - 实时获取GitHub用户数据
  - 显示最近项目（仓库）
  - 展示最近提交活动
  - 统计总星标、粉丝、仓库数

- ✨ **丰富的视觉效果**
  - 樱花粒子飘落背景
  - 鼠标跟踪光点
  - 卡片悬停动画
  - 魔法粒子爆炸效果
  - 毛玻璃效果（Glassmorphism）
  - 自定义背景图支持

- 📱 **完全响应式**
  - 支持桌面、平板、手机
  - 适配各种屏幕尺寸

- 🔗 **社交联系方式**
  - Discord、Telegram、Steam、GitHub
  - 便捷的社交图标和链接

---

## 🚀 快速开始

### 步骤1：配置用户信息

编辑 `config.js` 文件，填入你的信息：

```javascript
const SITE_CONFIG = window.SITE_CONFIG = {
    username: 'your-github-username',      // ⭐ 必填：你的GitHub用户名
    signature: '✨ 你的个性签名 ✨',

    // 社交链接
    discord: 'https://discord.gg/your-link',
    telegram: 'https://t.me/your-username',
    steam: 'https://steamcommunity.com/profiles/your-id/',
    github: 'https://github.com/your-username',

    // 可选：自定义头像URL（不填则使用GitHub头像）
    avatarUrl: 'https://example.com/avatar.png'
};
```

### 步骤2：本地预览

选择以下任一方式：

**方式A：直接打开（最简单）**
```
右键点击 index.html → 选择 "用浏览器打开"
```

**方式B：Python HTTP服务器**
```bash
python -m http.server 8000
# 访问 http://localhost:8000
```

**方式C：Node.js**
```bash
npx http-server
# 访问显示的地址
```

### 步骤3：部署到网络

#### GitHub Pages（推荐）
1. 创建GitHub仓库名为 `username.github.io`
2. 上传项目文件
3. 访问 `https://username.github.io`

#### 其他选项
- **Netlify**: 拖拽文件夹到 https://netlify.com
- **Vercel**: 上传到GitHub，然后链接到Vercel
- **自有服务器**: 上传文件到服务器

---

## 📝 配置说明

### 必填配置

| 项目 | 说明 | 示例 |
|------|------|------|
| `username` | 你的GitHub用户名 | `'Ko1shiOvO'` |
| `signature` | 个性签名 | `'✨ 幻想乡开发者 ✨'` |

### 社交链接配置

```javascript
// Discord - 获取邀请链接
discord: 'https://discord.gg/YOUR-INVITE-CODE',

// Telegram
telegram: 'https://t.me/your_username',

// Steam - 访问Steam个人资料得到
steam: 'https://steamcommunity.com/profiles/YOUR_STEAM_ID/',

// GitHub
github: 'https://github.com/your-username'
```

**社交链接获取方法**：

- **Discord邀请链接**: 在服务器中右键 → 邀请此服务器 → 复制邀请链接
- **Telegram**: 访问 https://t.me/your_username
- **Steam**: 进入Steam → 个人资料 → 复制浏览器链接栏的URL
- **GitHub**: 访问 https://github.com/your-username

### GitHub API配置

默认使用免费的GitHub API（60请求/小时）。如需更高限制：

1. 访问 https://github.com/settings/tokens
2. 点击 "Generate new token"
3. 选择 "personal access token"
4. 勾选 `public_repo` 权限
5. 生成Token并复制
6. 在 `config.js` 中取消注释并填入：

```javascript
githubToken: 'ghp_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
```

⚠️ **重要**: 如果部署到公开仓库，千万不要提交Token！

---

## 🎨 高级功能

### 毛玻璃和背景图

#### 配置毛玻璃效果

```javascript
glassmorphism: {
    enabled: true,          // 是否启用毛玻璃效果
    blur: '5px',           // 模糊度（推荐值）
    opacity: 0.85          // 卡片透明度 (0-1)
}
```

**模糊度比较**:
- `'3px'` - 轻微毛玻璃，背景清晰可见
- `'5px'` - 中等毛玻璃（**推荐**）
- `'8px'` - 强毛玻璃，背景模糊不清
- `'10px'` - 极强毛玻璃，创意艺术效果

#### 配置背景图

```javascript
backgroundImage: {
    enabled: true,                       // 启用背景图
    url: './assets/background.jpg',     // 背景图路径
    opacity: 0.6,                       // 透明度 (0-1)
    blur: 0                             // 模糊值
}
```

#### 使用背景图步骤

1. **准备背景图**
   - 尺寸: 1920x1080 或更高
   - 格式: JPG (推荐) / PNG
   - 大小: 300KB - 1MB
   - 主题: 暗色、低对比度（保证文字清晰）

2. **创建assets文件夹并放入背景图**
   ```
   home-page/
   ├── assets/
   │   └── background.jpg
   ```

3. **配置 config.js**
   ```javascript
   backgroundImage: {
       enabled: true,
       url: './assets/background.jpg',
       opacity: 0.6
   }
   ```

4. **刷新浏览器**
   ```
   Ctrl + Shift + R 或 Cmd + Shift + R
   ```

#### 效果调优

**文字看不清？**
```javascript
glassmorphism: {
    blur: '5px',
    opacity: 0.95    // 增加不透明度
}
```

**背景图不清晰？**
```javascript
backgroundImage: {
    url: './assets/background.jpg',
    opacity: 0.4     // 降低背景图透明度
}
```

**性能卡顿？**
```javascript
// 方案1: 降低毛玻璃强度
glassmorphism: { blur: '3px' }

// 方案2: 禁用背景图
backgroundImage: { enabled: false }
```

#### 推荐背景图来源

- **Unsplash** - https://unsplash.com
- **Pixabay** - https://pixabay.com
- **Pexels** - https://pexels.com

搜索关键词: `紫色`, `日本`, `东方`, `魔法`, `樱花`

### 自定义主题颜色

编辑 `styles.css` 中的CSS变量（顶部）：

```css
:root {
    --primary-color: #FFFFFF;      /* 主题色 */
    --secondary-color: #FFFFFF;    /* 次要色 */
    --accent-color: #FFFFFF;       /* 强调色 */
    --dark-bg: #0B1110;            /* 背景色 */
    --light-glow: #FFFFFF;         /* 光效色 */
    --gold-accent: #FFFFFF;        /* 金色 */

    --card-bg: rgba(15, 15, 15, 0.3);  /* 卡片背景 */
    --card-border: #FFFFFF;
    --text-primary: #F5F5F5;
    --text-secondary: #C0C0C0;

    /* 毛玻璃效果配置 */
    --glassmorphism-blur: 8px;
    --glassmorphism-opacity: 0.7;
}
```

### 进阶使用

**强制刷新GitHub数据**：在浏览器Console中运行
```javascript
refreshData()
```

**清除缓存**：
```javascript
localStorage.removeItem('github-your-username')
```

**查看API调用状态**：打开浏览器开发者工具 → Network 标签，刷新页面

---

## 🔧 常见问题

### Q: GitHub数据不显示？
A: 检查以下几点：
1. `config.js` 中的 `username` 是否正确
2. 网络连接是否正常
3. GitHub API是否被限制（检查浏览器控制台 F12）
4. 如果限制，需要添加GitHub Token

### Q: 背景图没有显示？

**检查清单**:
- [ ] 背景图文件确实在 `assets/` 文件夹中
- [ ] 文件名完全匹配（注意大小写）
- [ ] 路径正确: `./assets/background.jpg`
- [ ] 浏览器控制台有无错误信息（F12）
- [ ] 清除浏览器缓存后刷新

### Q: 毛玻璃效果看不见？

**浏览器兼容性**:
- ✅ Chrome/Edge 76+ 原生支持
- ✅ Firefox 103+ 支持
- ✅ Safari 9+ 支持
- ❌ IE11 不支持（会显示纯色）

### Q: 如何修改样式？
A: 编辑 `styles.css` 中的CSS规则即可。主要部分：
- `.header` - 头部样式
- `.project-card` - 项目卡片
- `.stat-card` - 统计卡片
- `.contact-card` - 社交卡片

### Q: 如何添加更多社交链接？

A: 编辑 `index.html` 中的社交部分，参考现有格式：
```html
<a href="your-url" class="contact-card your-platform" title="Platform">
    <svg><!-- 你的SVG图标 --></svg>
    <span>平台名称</span>
</a>
```

### Q: 动画太多了怎么办？
A: 可以禁用CSS动画：
- 在设置中启用"减少动画"选项
- 或在 `styles.css` 中注释掉 `@keyframes` 动画定义

### Q: 是否会影响性能？
A:
- 毛玻璃使用硬件加速，影响低
- 建议背景图 <1MB
- 在现代浏览器上（Chrome, Firefox, Safari）很流畅

---

## 📂 文件结构

```
home-page/
├── index.html              # HTML结构
├── styles.css              # 主样式和布局
├── animations.css          # 特效和动画
├── script.js               # 核心逻辑和GitHub集成
├── config.js               # 配置文件（⭐ 修改这个）
├── README.md              # 项目文档
└── assets/                 # 资源文件夹
    └── background.jpg      # 背景图（可选）
```

---

## 浏览器支持

| 浏览器 | 版本 | 毛玻璃 | 背景图 | 粒子效果 |
|--------|------|--------|--------|---------|
| Chrome | 76+ | ✅ | ✅ | ✅ |
| Firefox | 103+ | ✅ | ✅ | ✅ |
| Safari | 9+ | ✅ | ✅ | ✅ |
| Edge | 79+ | ✅ | ✅ | ✅ |
| IE 11 | - | ❌ | ✅ | ✅ |

低版本浏览器会显示降级效果。

---

## 📚 技术栈

- **前端**: HTML5 + CSS3 + Vanilla JavaScript
- **API**: GitHub REST API v3
- **动画**: CSS @keyframes + Canvas
- **存储**: localStorage（数据缓存）

### 技术指标

| 指标 | 数值 |
|------|------|
| HTML 代码行数 | 150+ |
| CSS 代码行数 | 850+ |
| 动画数量 | 40+ |
| JavaScript 代码行数 | 700+ |
| 页面大小 | <200KB |
| 首屏加载时间 | <1s |
| 动画帧率 | 60 FPS |

---

## 🌟 功能演示

### 首次加载
- 页面淡入动画
- 樱花粒子开始飘落
- 鼠标光点跟踪

### 数据加载
- 显示骨架屏（加载状态）
- 从GitHub API获取数据
- 平滑渲染卡片

### 交互效果
- 卡片悬停：上升 + 光晕增强
- 点击卡片：产生魔法粒子效果
- 社交图标：旋转 + 发光

---

## 🎯 下一步改进方向

- [ ] 添加暗黑/亮色主题切换
- [ ] 支持更多社交平台
- [ ] 添加访客计数器
- [ ] 实现评论功能
- [ ] 支持自定义主题配置界面
- [ ] 添加更多粒子效果

---

## 📄 许可证

MIT License - 自由使用和修改

---

## 🙏 致谢

灵感来自：
- 东方Project（上海爱丽丝幻乐团）
- GitHub用户界面
- 现代Web设计美学

---

## 📞 支持

有问题或建议？
- 提交Issue
- 创建Pull Request
- 联系开发者

---

**✨ 祝你使用愉快！欢迎来到幻想乡！✨**

*最后更新: 2026年4月*
*技术: HTML5 + CSS3 + Vanilla JS + GitHub API*