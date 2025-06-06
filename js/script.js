document.addEventListener('DOMContentLoaded', function() {
    // DOM 元素
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    const avatar1Img = document.getElementById('avatar1-img');
    const avatar2Img = document.getElementById('avatar2-img');
    
    // 初始化
    updateCounter();
    setInterval(updateCounter, 1000);
    initFriendshipGradients();
    
    // 添加鼠标悬停效果
    addHoverEffects();
    
    // 加载保存的数据
    function loadData() {
        // 加载头像
        const savedAvatar1 = localStorage.getItem('avatar1');
        const savedAvatar2 = localStorage.getItem('avatar2');
        if (savedAvatar1) avatar1Img.src = savedAvatar1;
        if (savedAvatar2) avatar2Img.src = savedAvatar2;
    }
    
    // 更新计数器
    function updateCounter() {
        // 使用固定开始日期
        const startDate = new Date('2025-02-24');
        const currentDate = new Date();
        
        // 计算已经过去的总秒数
        const totalElapsedSeconds = Math.floor((currentDate - startDate) / 1000);
        
        // 计算已经过去的天数
        const days = Math.floor(totalElapsedSeconds / 3600 / 24);
        
        // 计算今天已经过去的时间（从凌晨12点开始）
        const today = new Date(currentDate);
        today.setHours(0, 0, 0, 0);
        
        const elapsedSecondsToday = Math.floor((currentDate - today) / 1000);
        
        // 计算已经过去的小时、分钟和秒数
        const hours = Math.floor(elapsedSecondsToday / 3600);
        const minutes = Math.floor((elapsedSecondsToday % 3600) / 60);
        const seconds = elapsedSecondsToday % 60;
        
        // 更新DOM
        daysEl.innerHTML = days;
        hoursEl.innerHTML = hours;
        minutesEl.innerHTML = minutes;
        secondsEl.innerHTML = seconds;
        
        // 添加数字变化动画
        animateValue(daysEl, parseInt(daysEl.textContent), days, 500);
        animateValue(hoursEl, parseInt(hoursEl.textContent), hours, 500);
        animateValue(minutesEl, parseInt(minutesEl.textContent), minutes, 500);
        animateValue(secondsEl, parseInt(secondsEl.textContent), seconds, 500);
    }
    
    // 数字动画效果
    function animateValue(element, start, end, duration) {
        // 如果数字相同，不需要动画
        if (start === end) return;
        
        // 添加动画样式
        element.classList.add('counter-update');
        setTimeout(() => {
            element.classList.remove('counter-update');
        }, 300);
        
        // 立即设置数字
        element.innerHTML = end;
    }
    
    // 初始化友谊渐变效果
    function initFriendshipGradients() {
        // 添加渐变背景样式
        const style = document.createElement('style');
        style.textContent = `
            .counter-update {
                animation: pulse 0.3s ease-in-out;
            }
            
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.2); }
                100% { transform: scale(1); }
            }
            
            .avatar-updated {
                animation: flash 1s ease;
            }
            
            @keyframes flash {
                0%, 50%, 100% { opacity: 1; }
                25%, 75% { opacity: 0.5; }
            }
            
            .celebration {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 9999;
            }
            
            .confetti {
                position: absolute;
                width: 10px;
                height: 10px;
                background-color: #f00;
                border-radius: 50%;
                animation: fall 5s ease-in infinite;
            }
            
            @keyframes fall {
                0% { transform: translateY(-100px) rotate(0deg); opacity: 1; }
                100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
        
        // 初始化友谊渐变效果
        updateFriendshipGradients();
    }
    
    // 更新友谊渐变效果
    function updateFriendshipGradients() {
        // 使用固定的色调值
        const hue1 = 330; // 粉红色
        const hue2 = 210; // 蓝色
        const hue3 = 270; // 紫色
        
        // 更新渐变背景
        document.documentElement.style.setProperty('--friendship-gradient-1', 
            `linear-gradient(135deg, hsl(${hue1}, 70%, 60%), hsl(${(hue1 + 30) % 360}, 80%, 40%))`);
        document.documentElement.style.setProperty('--friendship-gradient-2', 
            `linear-gradient(135deg, hsl(${hue2}, 80%, 65%), hsl(${(hue2 + 30) % 360}, 70%, 50%))`);
        document.documentElement.style.setProperty('--friendship-gradient-3', 
            `linear-gradient(135deg, hsl(${hue3}, 70%, 60%), hsl(${(hue3 + 40) % 360}, 80%, 65%), hsl(${(hue3 + 80) % 360}, 75%, 60%))`);
    }
    
    // 添加鼠标悬停效果
    function addHoverEffects() {
        // 添加心形图标悬停效果
        const heart = document.querySelector('.heart');
        if (heart) {
            heart.addEventListener('mouseover', function() {
                this.style.transform = 'scale(1.5)';
                this.style.transition = 'transform 0.3s ease';
            });
            
            heart.addEventListener('mouseout', function() {
                this.style.transform = 'scale(1)';
            });
        }
        
        // 添加计数器悬停效果
        const counters = document.querySelectorAll('.counter');
        counters.forEach(counter => {
            counter.addEventListener('mouseover', function() {
                this.style.transform = 'translateY(-10px)';
                this.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.25)';
                this.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
            });
            
            counter.addEventListener('mouseout', function() {
                this.style.transform = '';
                this.style.boxShadow = '';
            });
        });
    }
});
