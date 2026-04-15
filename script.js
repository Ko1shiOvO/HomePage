/* ============================================
   涓滄柟涓汉涓婚〉 - 涓昏浜や簰鑴氭湰
   ============================================ */

// 閰嶇疆瀵硅薄
const CONFIG = window.SITE_CONFIG || {
    username: 'torvalds',
    signature: '✨ 欢迎来到幻想乡 ✨',
    discord: 'https://discord.gg/example',
    telegram: 'https://t.me/example',
    steam: 'https://steamcommunity.com/profiles/example',
    github: 'https://github.com/example',
    avatarUrl: null // 濡傛灉涓簄ull锛屼娇鐢℅itHub澶村儚
};

// 状态数据
let appState = {
    user: null,
    repos: [],
    commits: [],
    loading: true,
    error: null,
    lastFetch: null
};

const GITHUB_CACHE_DURATION_MS = 60 * 60 * 1000;
let stickyObserver = null;
let stickyEvalRafPending = false;
let stickyCardStates = [];
let stickyLayoutItems = [];
let cardsHidden = false;
const CPU_CORES = navigator.hardwareConcurrency || 4;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function createInitialState() {
    return {
        user: null,
        repos: [],
        commits: [],
        loading: true,
        error: null,
        lastFetch: null
    };
}

// ============================================
// 鍒濆鍖?// ============================================

document.addEventListener('DOMContentLoaded', async () => {
    console.log('馃尭 涓滄柟涓汉涓婚〉姝ｅ湪鍔犺浇...');

    // 初始化特效
    initParticles();
    initCursorGlow();
    initBackground();

    // 鏇存柊閰嶇疆淇℃伅
    updateUserInfo();

    // 鏇存柊绀句氦閾炬帴
    updateSocialLinks();

    // 关闭卡片滑动联动，保留静态布局
    initWallpaperToggle();

    // 鑾峰彇骞舵樉绀篏itHub鏁版嵁
    await fetchGitHubData();

    // 浜嬩欢鐩戝惉
    setupEventListeners();
});

// ============================================
// 1. 绮掑瓙绯荤粺 - 妯辫姳椋樿惤
// ============================================

function initParticles() {
    if (prefersReducedMotion) return;

    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    // 璁剧疆canvas澶у皬
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // 粒子类
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height - canvas.height;
            this.size = Math.random() * 3 + 5;
            this.speedX = Math.random() * 1 - 0.5;
            this.speedY = Math.random() * 0.5 + 0.3;
            this.opacity = Math.random() * 0.35 + 0.55;
            this.rotation = Math.random() * Math.PI * 2;
            this.rotationSpeed = Math.random() * 0.02 - 0.01;
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = this.opacity;
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            drawKoishiEye(ctx, 0, 0, this.size);

            ctx.restore();
        }

        update(windEffect) {
            this.y += this.speedY;
            this.x += this.speedX;
            this.rotation += this.rotationSpeed;

            // 椋庣殑褰卞搷
            this.speedX += windEffect;

            // 閲嶇疆绮掑瓙浣嶇疆
            if (this.y > canvas.height) {
                this.y = -10;
                this.x = Math.random() * canvas.width;
            }
        }
    }

    // 绘制 Koishi 觉之瞳（按提供图标风格）
    function drawKoishiEye(ctx, x, y, size) {
        const radius = size * 1.4;

        // 紫色主体圆
        ctx.fillStyle = 'rgba(95, 76, 176, 0.9)';
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();

        // 外圈细弧
        ctx.strokeStyle = 'rgba(64, 44, 188, 0.78)';
        ctx.lineWidth = Math.max(1, size * 0.12);
        ctx.beginPath();
        ctx.arc(x, y, radius * 1.18, Math.PI * 0.18, Math.PI * 0.9);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(x, y, radius * 1.18, Math.PI * 1.08, Math.PI * 1.86);
        ctx.stroke();

        // 白色弯月睫线
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.96)';
        ctx.lineCap = 'round';
        ctx.lineWidth = Math.max(2, size * 0.3);
        ctx.beginPath();
        ctx.arc(x - radius * 0.08, y - radius * 0.04, radius * 0.78, Math.PI * 0.08, Math.PI * 0.55);
        ctx.stroke();

        // 睫毛尖刺
        ctx.lineWidth = Math.max(1, size * 0.16);
        const lashes = [
            [0.12, -0.6, 0.08, -0.9],
            [0.34, -0.44, 0.44, -0.7],
            [0.56, -0.21, 0.72, -0.36],
            [-0.08, 0.58, -0.14, 0.84],
            [-0.32, 0.64, -0.46, 0.86]
        ];
        lashes.forEach(([sx, sy, ex, ey]) => {
            ctx.beginPath();
            ctx.moveTo(x + radius * sx, y + radius * sy);
            ctx.lineTo(x + radius * ex, y + radius * ey);
            ctx.stroke();
        });
    }

    // 鍒涘缓绮掑瓙鏁扮粍
    const particles = [];
    const cpuCores = navigator.hardwareConcurrency || 4;
    const particleCountBase = Math.floor(window.innerWidth / 90);
    const particleCount = cpuCores <= 4
        ? Math.min(18, Math.max(8, particleCountBase))
        : Math.min(28, Math.max(12, particleCountBase));

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    // 鍔ㄧ敾寰幆
    let lastFrameTime = 0;
    const minFrameTime = 1000 / 30;

    function animate(timestamp) {
        if (timestamp - lastFrameTime < minFrameTime) {
            requestAnimationFrame(animate);
            return;
        }
        lastFrameTime = timestamp;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const windEffect = Math.sin(performance.now() / 100) * 0.001;

        for (let particle of particles) {
            particle.update(windEffect);
            particle.draw();
        }

        requestAnimationFrame(animate);
    }

    animate(0);
}

// ============================================
// 2. 榧犳爣璺熻釜鍏夌偣
// ============================================

function initCursorGlow() {
    if (prefersReducedMotion) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (CPU_CORES <= 4) return;

    const glow = document.createElement('div');
    glow.className = 'cursor-glow';
    document.body.appendChild(glow);

    const glowHalfSize = 15;
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let glowX = mouseX;
    let glowY = mouseY;
    let hasMouseMoved = false;
    let pointerSpeed = 0;
    let lastPointerX = mouseX;
    let lastPointerY = mouseY;
    let lastPointerTime = performance.now();

    glow.style.transform = `translate3d(${glowX - glowHalfSize}px, ${glowY - glowHalfSize}px, 0)`;

    document.addEventListener('pointermove', (e) => {
        const now = performance.now();
        const moveDt = Math.max(8, now - lastPointerTime);
        const moveDist = Math.hypot(e.clientX - lastPointerX, e.clientY - lastPointerY);
        const currentSpeed = moveDist / moveDt;
        pointerSpeed = pointerSpeed * 0.55 + currentSpeed * 0.45;

        mouseX = e.clientX;
        mouseY = e.clientY;
        lastPointerX = e.clientX;
        lastPointerY = e.clientY;
        lastPointerTime = now;
        if (!hasMouseMoved) {
            hasMouseMoved = true;
            glowX = mouseX;
            glowY = mouseY;
        }
    }, { passive: true });

    let lastTimestamp = performance.now();
    function animateCursor(timestamp) {
        const dt = Math.min(40, Math.max(8, timestamp - lastTimestamp));
        lastTimestamp = timestamp;
        const speedFactor = Math.min(pointerSpeed / 1.6, 1);
        const distance = Math.hypot(mouseX - glowX, mouseY - glowY);
        const distanceBoost = Math.min(distance / 160, 1) * 0.18;
        const followSpeed = hasMouseMoved
            ? (0.012 + speedFactor * 0.022 + distanceBoost)
            : 0.01;
        const damping = 1 - Math.exp(-followSpeed * dt);

        glowX += (mouseX - glowX) * damping;
        glowY += (mouseY - glowY) * damping;
        glow.style.transform = `translate3d(${glowX - glowHalfSize}px, ${glowY - glowHalfSize}px, 0)`;

        requestAnimationFrame(animateCursor);
    }

    requestAnimationFrame(animateCursor);

    // 点击时产生魔法粒子效果
    document.addEventListener('click', (e) => {
        createMagicEffect(e.clientX, e.clientY);
    });
}

// 鍒涘缓榄旀硶鐗规晥
function createMagicEffect(x, y) {
    for (let i = 0; i < 6; i++) {
        const angle = (Math.PI * 2 * i) / 6;
        const vx = Math.cos(angle) * 5;
        const vy = Math.sin(angle) * 5;

        const particle = document.createElement('div');
        particle.className = 'light-burst';
        particle.style.setProperty('--tx', vx * 50 + 'px');
        particle.style.setProperty('--ty', vy * 50 + 'px');
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';

        document.body.appendChild(particle);

        setTimeout(() => particle.remove(), 800);
    }
}

// ============================================
// 3. 鐢ㄦ埛淇℃伅鏇存柊
// ============================================

function updateUserInfo() {
    const usernameDisplay = document.getElementById('username-display');
    const signatureDisplay = document.getElementById('signature-display');
    const avatar = document.getElementById('avatar');

    if (usernameDisplay) usernameDisplay.textContent = CONFIG.username;
    if (signatureDisplay) signatureDisplay.textContent = CONFIG.signature;

    // 璁剧疆澶村儚URL
    if (avatar) {
        if (CONFIG.avatarUrl) {
            avatar.src = CONFIG.avatarUrl;
        } else {
            // 浣跨敤GitHub澶村儚
            avatar.src = `https://github.com/${CONFIG.username}.png`;
        }
    }
}

// ============================================
// 4. 绀句氦閾炬帴鏇存柊
// ============================================

function updateSocialLinks() {
    const socialLinks = {
        discord: { elem: document.querySelector('.contact-card.discord'), url: CONFIG.discord },
        telegram: { elem: document.querySelector('.contact-card.telegram'), url: CONFIG.telegram },
        steam: { elem: document.querySelector('.contact-card.steam'), url: CONFIG.steam },
        github: { elem: document.querySelector('.contact-card.github'), url: CONFIG.github }
    };

    for (let platform in socialLinks) {
        if (socialLinks[platform].elem && socialLinks[platform].url) {
            socialLinks[platform].elem.href = socialLinks[platform].url;
            socialLinks[platform].elem.target = '_blank';
            socialLinks[platform].elem.rel = 'noopener noreferrer';
        }
    }
}

// ============================================
// 3.5 鑳屾櫙鍥惧垵濮嬪寲
// ============================================

function initBackground() {
    const config = CONFIG.backgroundImage;
    if (!config || !config.enabled) return;

    const bgImage = document.querySelector('.bg-image');
    if (!bgImage) return;

    const bgUrl = config.url;
    bgImage.style.backgroundImage = `url('${bgUrl}')`;
    bgImage.style.opacity = config.opacity || 0.6;

    if (config.blur > 0) {
        bgImage.style.filter = `blur(${config.blur}px)`;
    }

    const testImage = new Image();
    testImage.onerror = () => {
        console.warn(`背景图加载失败: ${bgUrl}`);
        console.warn('请确认文件路径正确，或在 assets 目录中放置背景图');
        bgImage.style.backgroundColor = 'rgba(26, 0, 51, 0.5)';
    };
    testImage.onload = () => {
        console.log('背景图加载成功');
    };
    testImage.src = bgUrl;

    if (CONFIG.glassmorphism?.enabled) {
        document.documentElement.style.setProperty('--glassmorphism-blur', CONFIG.glassmorphism.blur);
        document.documentElement.style.setProperty('--glassmorphism-opacity', CONFIG.glassmorphism.opacity);
    }
}
async function fetchGitHubData() {
    try {
        appState.loading = true;
        console.log(`正在获取 ${CONFIG.username} 的 GitHub 数据...`);

        const cached = localStorage.getItem(`github-${CONFIG.username}`);
        if (cached) {
            const cacheData = JSON.parse(cached);
            const now = Date.now();
            if (now - cacheData.timestamp < GITHUB_CACHE_DURATION_MS) {
                appState = { ...appState, ...cacheData.data };
                renderGitHubData();
                return;
            }
        }

        const [userResponse, reposResponse, eventsResponse] = await Promise.all([
            fetch(`https://api.github.com/users/${CONFIG.username}`),
            fetch(`https://api.github.com/users/${CONFIG.username}/repos?sort=updated&per_page=5`),
            fetch(`https://api.github.com/users/${CONFIG.username}/events/public?per_page=100`)
        ]);

        if (!userResponse.ok) throw new Error('GitHub 用户不存在');
        if (!reposResponse.ok) throw new Error('无法获取仓库信息');
        if (!eventsResponse.ok) throw new Error('无法获取活动信息');

        appState.user = await userResponse.json();
        appState.repos = await reposResponse.json();
        const events = await eventsResponse.json();
        appState.commits = events.filter((e) => e.type === 'PushEvent');

        localStorage.setItem(`github-${CONFIG.username}`, JSON.stringify({
            data: { user: appState.user, repos: appState.repos, commits: appState.commits },
            timestamp: Date.now()
        }));

        appState.error = null;
        appState.loading = false;
        appState.lastFetch = new Date();

        renderGitHubData();
    } catch (error) {
        if (error instanceof SyntaxError) {
            localStorage.removeItem(`github-${CONFIG.username}`);
        }
        appState.error = error.message;
        appState.loading = false;
        showErrorMessage(error.message);
    }
}
function renderGitHubData() {
    renderStats();
    renderProjects();
    renderActivity();
}

function renderStats() {
    if (!appState.user) return;

    const stats = [
        { elem: document.getElementById('repos-count'), value: appState.user.public_repos },
        { elem: document.getElementById('followers-count'), value: appState.user.followers }
    ];

    // 璁＄畻鎬绘槦鏍囨暟
    const totalStars = appState.repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
    const starsElem = document.getElementById('stars-count');
    if (starsElem) starsElem.textContent = totalStars;

    stats.forEach(stat => {
        if (stat.elem) {
            animateNumber(stat.elem, stat.value);
        }
    });
}

function renderProjects() {
    const container = document.getElementById('projects-container');
    if (!container) return;
    container.innerHTML = '';

    if (appState.repos.length === 0) {
        container.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: #B8B8B8;">未找到项目数据</div>';
        return;
    }

    const fragment = document.createDocumentFragment();
    appState.repos.forEach((repo, index) => {
        const card = createProjectCard(repo);
        fragment.appendChild(card);

        // 娣诲姞鍔ㄧ敾寤惰繜
        card.style.animation = `fade-in 0.6s ease-out ${index * 0.1}s both`;
    });
    container.appendChild(fragment);
}

function createProjectCard(repo) {
    const card = document.createElement('div');
    card.className = 'project-card';

    const updated = new Date(repo.updated_at);
    const daysAgo = Math.floor((Date.now() - updated) / (1000 * 60 * 60 * 24));
    const timeStr = daysAgo < 1 ? '今天' : `${daysAgo}天前`;

    card.innerHTML = `
        <div class="project-name">${escapeHTML(repo.name)}</div>
        <div class="project-desc">${escapeHTML(repo.description || '暂无描述')}</div>
        <div class="project-meta">
            <div class="project-stars">⭐${repo.stargazers_count}</div>
            <a href="${repo.html_url}" class="project-link" target="_blank" rel="noopener noreferrer">
                访问 →            </a>
            <span class="project-time">${timeStr}</span>
        </div>
    `;

    return card;
}

function renderActivity() {
    const container = document.getElementById('activity-container');
    if (!container) return;
    container.innerHTML = '';

    if (appState.commits.length === 0) {
        container.innerHTML = '<div class="contrib-empty">暂无最近活动数据</div>';
        return;
    }

    const totalDays = 84;
    const dayCountMap = new Map();
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - (totalDays - 1));

    appState.commits.forEach((event) => {
        const eventDate = new Date(event.created_at);
        const key = eventDate.toISOString().slice(0, 10);
        const commits = (event.payload && Array.isArray(event.payload.commits)) ? event.payload.commits.length : 1;
        dayCountMap.set(key, (dayCountMap.get(key) || 0) + Math.max(1, commits));
    });

    const dailyValues = [];
    for (let i = 0; i < totalDays; i += 1) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        const key = date.toISOString().slice(0, 10);
        dailyValues.push({
            date,
            count: dayCountMap.get(key) || 0
        });
    }

    const maxCount = dailyValues.reduce((max, item) => Math.max(max, item.count), 0);
    const totalContributions = dailyValues.reduce((sum, item) => sum + item.count, 0);
    const weeks = Math.ceil(totalDays / 7);
    const cells = new Array(weeks * 7).fill(null).map(() => ({ count: 0, date: null }));

    dailyValues.forEach((item, index) => {
        const weekIndex = Math.floor(index / 7);
        const dayIndex = item.date.getDay();
        const cellIndex = weekIndex * 7 + dayIndex;
        cells[cellIndex] = item;
    });

    const heatmap = document.createElement('div');
    heatmap.className = 'activity-heatmap';

    const summary = document.createElement('div');
    summary.className = 'activity-summary';
    summary.textContent = `最近 ${totalDays} 天共 ${totalContributions} 次活动`;
    heatmap.appendChild(summary);

    const gridWrap = document.createElement('div');
    gridWrap.className = 'activity-grid-wrap';

    const weekdays = document.createElement('div');
    weekdays.className = 'contrib-weekdays';
    weekdays.innerHTML = '<span>周日</span><span></span><span>周二</span><span></span><span>周四</span><span></span><span>周六</span>';
    gridWrap.appendChild(weekdays);

    const grid = document.createElement('div');
    grid.className = 'contrib-grid';

    cells.forEach((item) => {
        const cell = document.createElement('div');
        const level = getContributionLevel(item.count, maxCount);
        cell.className = `contrib-cell contrib-level-${level}`;
        if (item.date) {
            cell.title = `${item.date.toLocaleDateString('zh-CN')}: ${item.count} 次活动`;
        } else {
            cell.title = '无数据';
        }
        grid.appendChild(cell);
    });

    gridWrap.appendChild(grid);
    heatmap.appendChild(gridWrap);

    const legend = document.createElement('div');
    legend.className = 'contrib-legend';
    legend.innerHTML = `
        <span>少</span>
        <div class="contrib-legend-scale">
            <span class="contrib-cell contrib-level-0"></span>
            <span class="contrib-cell contrib-level-1"></span>
            <span class="contrib-cell contrib-level-2"></span>
            <span class="contrib-cell contrib-level-3"></span>
            <span class="contrib-cell contrib-level-4"></span>
        </div>
        <span>多</span>
    `;
    heatmap.appendChild(legend);

    container.appendChild(heatmap);
}

function getContributionLevel(count, maxCount) {
    if (count <= 0) return 0;
    if (maxCount <= 1) return 4;
    const ratio = count / maxCount;
    if (ratio < 0.25) return 1;
    if (ratio < 0.5) return 2;
    if (ratio < 0.75) return 3;
    return 4;
}

function setupStatsStickyStop() {
    const stickyCards = Array.from(document.querySelectorAll('.main-grid .left-column > section, .main-grid .right-column > section'));
    if (!stickyCards.length) return;
    stickyCards.forEach((card) => card.classList.add('is-sticky'));

    const contactSection = document.querySelector('.contact-section');
    stickyLayoutItems = stickyCards.map((card) => {
        const parent = card.parentElement;
        const siblings = Array.from(parent.children).filter((el) => el.tagName === 'SECTION');
        const currentIndex = siblings.indexOf(card);
        return {
            card,
            stopTarget: currentIndex >= 0 ? (siblings[currentIndex + 1] || contactSection) : contactSection
        };
    });

    if (stickyObserver) {
        stickyObserver.disconnect();
    }

    stickyObserver = new IntersectionObserver(() => {
        recalculateStickyCards();
        applyStickyCardsTranslate();
    }, { threshold: [0, 1] });
    const activitySection = document.querySelector('.activity-section');
    if (activitySection) stickyObserver.observe(activitySection);
    if (contactSection) stickyObserver.observe(contactSection);

    window.addEventListener('scroll', scheduleStickyEvaluate, { passive: true });
    window.addEventListener('resize', () => {
        recalculateStickyCards();
        applyStickyCardsTranslate();
    });
    recalculateStickyCards();
    applyStickyCardsTranslate();
}

function recalculateStickyCards() {
    if (!stickyLayoutItems.length) {
        stickyCardStates = [];
        return;
    }

    const topOffset = 18;
    const stopGap = 16;

    stickyCardStates = stickyLayoutItems.map(({ card, stopTarget }) => {
        let stopY = Number.POSITIVE_INFINITY;
        if (stopTarget) {
            const stopTargetDocTop = getElementDocumentTop(stopTarget);
            stopY = stopTargetDocTop - (topOffset + card.offsetHeight + stopGap);
        }

        return {
            card,
            stopY,
            lastTranslateY: null
        };
    });
}

function applyStickyCardsTranslate() {
    if (!stickyCardStates.length) return;

    stickyCardStates.forEach((state) => {
        if (!Number.isFinite(state.stopY)) return;
        const delta = window.scrollY - state.stopY;
        const translateY = delta > 0 ? -delta : 0;
        if (state.lastTranslateY !== null && Math.abs(state.lastTranslateY - translateY) < 0.08) return;
        state.card.style.transform = `translateY(${translateY}px)`;
        state.lastTranslateY = translateY;
    });
}

function getElementDocumentTop(element) {
    let top = 0;
    let current = element;
    while (current) {
        top += current.offsetTop || 0;
        current = current.offsetParent;
    }
    return top;
}

function scheduleStickyEvaluate() {
    if (stickyEvalRafPending) return;
    stickyEvalRafPending = true;
    requestAnimationFrame(() => {
        stickyEvalRafPending = false;
        applyStickyCardsTranslate();
    });
}

function animateNumber(elem, target) {
    if (!elem) return;

    const start = 0;
    const duration = 1000;
    const startTime = Date.now();

    function update() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const current = Math.floor(start + (target - start) * easeOutQuad(progress));

        elem.textContent = current;

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    update();
}

function easeOutQuad(t) {
    return t * (2 - t);
}

function escapeHTML(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function formatTime(date) {
    const now = new Date();
    const diff = now - date;

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days < 7) return `${days}天前`;

    return date.toLocaleDateString('zh-CN');
}

function showErrorMessage(message) {
    const container = document.getElementById('projects-container');
    if (container) {
        container.innerHTML = `<div style="grid-column: 1/-1; color: #9FE870; padding: 20px; text-align: center;">
            ⚠️ 无法加载数据: ${message}<br>
            <small style="font-size: 0.9rem; color: #B8B8B8;">GitHub API 可能触发限流，请稍后重试或在 config.js 中配置 token</small>
        </div>`;
    }
}

// ============================================
// 8. 浜嬩欢鐩戝惉
// ============================================

function setupEventListeners() {
    // 链接涟漪 + 壁纸模式按钮
    document.addEventListener('click', (e) => {
        const toggleButton = e.target.closest('#wallpaper-toggle');
        if (toggleButton) {
            e.preventDefault();
            setCardsHidden(!cardsHidden);
            return;
        }

        const link = e.target.closest('a');
        if (link && !cardsHidden) {
            createRipple(link, e);
        }
    });

    // 鍒锋柊鎸夐挳锛堝彲閫夛級
    window.refreshData = async () => {
        localStorage.removeItem(`github-${CONFIG.username}`);
        appState = createInitialState();
        await fetchGitHubData();
    };
}

function initWallpaperToggle() {
    let toggle = document.getElementById('wallpaper-toggle');
    if (!toggle) {
        const footer = document.querySelector('.footer');
        if (!footer) return;
        toggle = document.createElement('button');
        toggle.id = 'wallpaper-toggle';
        toggle.className = 'wallpaper-toggle';
        toggle.type = 'button';
        footer.appendChild(toggle);
    }
    toggle.textContent = '壁纸模式';
    toggle.setAttribute('aria-pressed', 'false');
}

function setCardsHidden(hidden) {
    cardsHidden = hidden;
    document.body.classList.toggle('wallpaper-only', hidden);
    const toggle = document.getElementById('wallpaper-toggle');
    if (toggle) {
        toggle.textContent = hidden ? '退出壁纸模式' : '壁纸模式';
        toggle.setAttribute('aria-pressed', hidden ? 'true' : 'false');
    }
}

function createRipple(element, event) {
    const ripple = document.createElement('div');
    ripple.className = 'ripple';

    const rect = element.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';

    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
}

// ============================================
// 9. 鍝嶅簲寮忓鐞?// ============================================

window.addEventListener('resize', () => {
    // 鍝嶅簲寮忓竷灞€浼氶€氳繃CSS濯掍綋鏌ヨ澶勭悊
});

// ============================================
// 10. 鎬ц兘浼樺寲
// ============================================

// 浣跨敤Request Animation Frame杩涜浼樺寲
if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
        // 棰勫姞杞戒紭鍖?        console.log('馃尭 椤甸潰宸插畬鍏ㄥ姞杞藉苟浼樺寲');
    });
}

console.log('%c✨ 个人主页已启动 ✨', 'color: #9FE870; font-size: 14px; font-weight: bold;');








