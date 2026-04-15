/* ============================================
   东方个人主页 - 配置文件
   ============================================

   修改这个文件来自定义你的个人主页
   所有配置都在 SITE_CONFIG 对象中

   ============================================ */

const SITE_CONFIG = window.SITE_CONFIG = {
    // 基础信息
    username: 'Ko1shiOvO',                    // GitHub用户名（必填）
    signature: '✨ 漂浮于幻想乡的开发者 ✨',   // 个性签名

    // 头像配置
    avatarUrl: null,  // 自定义头像URL，留null使用GitHub头像
    // 示例: avatarUrl: 'https://example.com/avatar.png',

    // 社交链接（根据需要修改）
    discord: 'https://discord.com/users/1487853243722895494',           // Discord邀请链接
    telegram: 'https://t.me/Turaki404',                // Telegram链接或用户名
    steam: 'https://steamcommunity.com/id/Ko1shiOvO/',  // Steam个人资料
    github: 'https://github.com/Ko1shiOvO',            // GitHub个人资料

    // GitHub API配置（可选）
    // githubToken: null,  // 如果有Token可以提高API限制（60 req/hr -> 6000 req/hr）
    // 注意：不要将Token提交到公共仓库！

    // 显示设置
    maxProjects: 5,      // 显示的最近项目数
    maxCommits: 10,      // 显示的最近提交数

    // 背景图配置
    backgroundImage: {
        enabled: true,
        url: './assets/background.jpg',  // 本地文件路径（推荐放在 assets/ 文件夹中）
        opacity: 0.6,                    // 背景图透明度（0-1）
        blur: 0                          // 背景图模糊值（不推荐设置）
    },

    // 毛玻璃配置
    glassmorphism: {
        enabled: true,
        blur: '5px',                     // 模糊度（3px为轻微，5px为中等，10px为强烈）
        opacity: 0.85                    // 卡片背景透明度（0.5-1之间）
    }
};

// ============================================
// 使用说明
// ============================================

/*
1. GitHub用户名必须填写
   - 将 'torvalds' 改为你的GitHub用户名
   - 例如: username: 'daisyzhou'

2. 社交链接配置
   - Discord: 前往 https://discord.gg/ 生成邀请链接
   - Telegram: 填写 https://t.me/yourusername
   - Steam: 访问Steam个人资料获取链接
   - GitHub: 填写你的GitHub个人资料URL

3. 自定义头像
   - avatarUrl 默认为 null，使用GitHub头像
   - 可以填写任何图片URL

4. API Token（可选但推荐）
   - 如果你想刷新更频繁，可在 GitHub -> Settings -> Developer settings 创建Token
   - 为了安全性，暂时先不填Token，部署到服务器后再考虑

5. 页面缓存
   - 数据会被缓存1小时（localStorage）
   - 在浏览器控制台运行 refreshData() 强制刷新

6. 修改配置后
   - 刷新浏览器即可看到更改
   - 清除浏览器缓存如果数据没有更新
*/

// ============================================
// 示例配置
// ============================================

/*
const SITE_CONFIG = {
    username: 'octocat',
    signature: '🌸 Hello GitHub 🌸',

    discord: 'https://discord.gg/example123',
    telegram: 'https://t.me/octocat',
    steam: 'https://steamcommunity.com/profiles/76561198000000000/',
    github: 'https://github.com/octocat',

    avatarUrl: 'https://avatars.githubusercontent.com/u/1?v=4',

    maxProjects: 5,
    maxCommits: 10
};
*/
