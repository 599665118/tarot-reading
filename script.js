// ===== 基础配置 =====
const basePrice = 74.25;
const checkboxes = document.querySelectorAll('input[type="checkbox"]');
const totalAmountEl = document.querySelector('.total-amount');
const selectedCountEl = document.getElementById('selectedCount');
const bookBtn = document.getElementById('bookBtn');
const stickyBookBtn = document.getElementById('stickyBookBtn');
const copyBtn = document.getElementById('copyBtn');
const newsletterForm = document.querySelector('.newsletter-form');
const stickyCta = document.getElementById('stickyCta');
const stickyAmountEl = document.querySelector('.sticky-amount');

// ===== 星空粒子背景 =====
function initStarCanvas() {
    const canvas = document.getElementById('starCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let stars = [];
    const STAR_COUNT = 120;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function createStars() {
        stars = [];
        for (let i = 0; i < STAR_COUNT; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 2 + 0.5,
                speed: Math.random() * 0.3 + 0.05,
                opacity: Math.random() * 0.8 + 0.2,
                pulse: Math.random() * Math.PI * 2,
                pulseSpeed: Math.random() * 0.02 + 0.005,
            });
        }
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 背景渐变
        const gradient = ctx.createRadialGradient(
            canvas.width / 2, canvas.height / 3, 0,
            canvas.width / 2, canvas.height / 3, canvas.width * 0.8
        );
        gradient.addColorStop(0, '#1a1035');
        gradient.addColorStop(0.5, '#0f0a1a');
        gradient.addColorStop(1, '#070510');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 绘制星星
        stars.forEach(star => {
            star.pulse += star.pulseSpeed;
            const currentOpacity = star.opacity * (0.6 + 0.4 * Math.sin(star.pulse));

            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(200, 180, 255, ${currentOpacity})`;
            ctx.fill();

            // 星芒
            if (star.size > 1.5) {
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.size * 2.5, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(168, 130, 247, ${currentOpacity * 0.15})`;
                ctx.fill();
            }

            star.y -= star.speed;
            if (star.y < -5) {
                star.y = canvas.height + 5;
                star.x = Math.random() * canvas.width;
            }
        });

        requestAnimationFrame(draw);
    }

    resize();
    createStars();
    draw();
    window.addEventListener('resize', () => { resize(); createStars(); });
}

// ===== 倒计时器 =====
function initCountdown() {
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    if (!hoursEl || !minutesEl || !secondsEl) return;

    // 设定距离现在 23h 59m 的倒计时（每次刷新重置）
    let savedEnd = sessionStorage.getItem('countdownEnd');
    let endTime;

    if (savedEnd && parseInt(savedEnd) > Date.now()) {
        endTime = parseInt(savedEnd);
    } else {
        endTime = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
        sessionStorage.setItem('countdownEnd', endTime.toString());
    }

    function update() {
        const now = Date.now();
        let diff = Math.max(0, endTime - now);

        const hours = Math.floor(diff / (1000 * 60 * 60));
        diff -= hours * 1000 * 60 * 60;
        const minutes = Math.floor(diff / (1000 * 60));
        diff -= minutes * 1000 * 60;
        const seconds = Math.floor(diff / 1000);

        hoursEl.textContent = String(hours).padStart(2, '0');
        minutesEl.textContent = String(minutes).padStart(2, '0');
        secondsEl.textContent = String(seconds).padStart(2, '0');
    }

    update();
    setInterval(update, 1000);
}

// ===== 更新总价 =====
function updateTotalPrice() {
    let additionalPrice = 0;
    let selectedItems = [];

    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            additionalPrice += parseFloat(checkbox.value);
            selectedItems.push(checkbox.getAttribute('data-name'));
        }
    });

    const totalPrice = basePrice + additionalPrice;
    const formatted = `$${totalPrice.toFixed(2)}`;

    totalAmountEl.textContent = formatted;
    if (stickyAmountEl) stickyAmountEl.textContent = formatted;

    // 更新选中项目文本
    if (selectedCountEl) {
        if (selectedItems.length === 0) {
            selectedCountEl.textContent = '基础套餐';
        } else {
            selectedCountEl.textContent = `基础 + ${selectedItems.length} 项附加服务`;
        }
    }
}

// ===== 复制优惠码 =====
if (copyBtn) {
    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText('samira25').then(() => {
            const originalHTML = copyBtn.innerHTML;
            copyBtn.innerHTML = '<span class="copy-icon">✅</span> 已复制！';
            copyBtn.style.background = '#10b981';
            copyBtn.style.color = 'white';
            copyBtn.style.borderColor = '#10b981';
            setTimeout(() => {
                copyBtn.innerHTML = originalHTML;
                copyBtn.style.background = '';
                copyBtn.style.color = '';
                copyBtn.style.borderColor = '';
            }, 2000);
        });
    });
}

// ===== 模态框 =====
const modal = document.getElementById('formModal');
const closeModalBtn = document.getElementById('closeModal');

function openModal() {
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closeModal() {
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

if (bookBtn) bookBtn.addEventListener('click', openModal);
if (stickyBookBtn) stickyBookBtn.addEventListener('click', openModal);
if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);

window.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});

// ESC 键关闭模态框
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});

// ===== 邮件订阅 =====
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = newsletterForm.querySelector('input[type="email"]');
        const email = input.value;
        const btn = newsletterForm.querySelector('button');
        const originalText = btn.textContent;

        btn.textContent = '✓ 已订阅';
        btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        input.value = '';

        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
        }, 3000);
    });
}

// ===== 服务选项监听 =====
checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
        updateTotalPrice();

        // 选中动画
        const item = checkbox.closest('.service-item');
        if (checkbox.checked) {
            item.style.borderColor = '#667eea';
            item.style.background = 'linear-gradient(135deg, rgba(102, 126, 234, 0.06), rgba(168, 85, 247, 0.06))';
        } else {
            item.style.borderColor = '';
            item.style.background = '';
        }
    });
});

// ===== 滚动入场动画 (Intersection Observer) =====
function initRevealAnimations() {
    const revealElements = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // 添加延迟形成级联效果
                setTimeout(() => {
                    entry.target.classList.add('active');
                }, index * 80);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
}

// ===== 底部固定 CTA 显示逻辑 =====
function initStickyCta() {
    if (!stickyCta || !bookBtn) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                stickyCta.classList.remove('visible');
            } else {
                // 仅在向下滚动时显示
                if (entry.boundingClientRect.top < 0) {
                    stickyCta.classList.add('visible');
                }
            }
        });
    }, { threshold: 0 });

    observer.observe(bookBtn);
}

// ===== iframe 预加载 =====
function initIframePreload() {
    const iframe = document.getElementById('formIframe');
    const loading = document.getElementById('iframeLoading');

    if (iframe && loading) {
        iframe.addEventListener('load', () => {
            loading.classList.add('hidden');
        });
    }
}

// ===== 初始化 =====
document.addEventListener('DOMContentLoaded', () => {
    initStarCanvas();
    initCountdown();
    initRevealAnimations();
    initStickyCta();
    initIframePreload();
});
