const basePrice = 74.25;
const checkboxes = document.querySelectorAll('input[type="checkbox"]');
const totalAmountEl = document.querySelector('.total-amount');
const bookBtn = document.getElementById('bookBtn');
const copyBtn = document.getElementById('copyBtn');
const newsletterForm = document.querySelector('.newsletter-form');

// 更新总价
function updateTotalPrice() {
    let additionalPrice = 0;
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            additionalPrice += parseFloat(checkbox.value);
        }
    });
    const totalPrice = basePrice + additionalPrice;
    totalAmountEl.textContent = `$${totalPrice.toFixed(2)}`;
}

// 复制优惠码
copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText('samira25').then(() => {
        const originalText = copyBtn.textContent;
        copyBtn.textContent = '已复制！';
        setTimeout(() => {
            copyBtn.textContent = originalText;
        }, 2000);
    });
});

// 获取模态框元素
const modal = document.getElementById('formModal');
const closeModalBtn = document.getElementById('closeModal');

// 预约按钮点击 - 打开模态框
bookBtn.addEventListener('click', () => {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // 防止背景滚动
});

// 关闭按钮
closeModalBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
});

// 点击模态框外部关闭
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// 表单提交
newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = newsletterForm.querySelector('input[type="email"]').value;
    alert(`感谢订阅！已发送确认邮件至：${email}`);
    newsletterForm.reset();
});

// 价格变化监听
checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', updateTotalPrice);
});

// 页面加载动画
window.addEventListener('load', () => {
    document.body.style.animation = 'none';
});
