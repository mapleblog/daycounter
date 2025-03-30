document.addEventListener('DOMContentLoaded', function() {
    // DOM 元素
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    const name1Display = document.getElementById('name1-display');
    const name2Display = document.getElementById('name2-display');
    const avatar1Img = document.getElementById('avatar1-img');
    const avatar2Img = document.getElementById('avatar2-img');
    
    // 初始化
    loadData();
    updateCounter();
    setInterval(updateCounter, 1000);
    initFriendshipGradients();
    
    // 事件监听器
    name1Display.addEventListener('click', openNameEditDialog);
    name2Display.addEventListener('click', openNameEditDialog);
    
    // 添加鼠标悬停效果
    addHoverEffects();
    
    // 打开姓名编辑对话框
    function openNameEditDialog() {
        // 创建对话框容器
        const dialogContainer = document.createElement('div');
        dialogContainer.className = 'dialog-container';
        dialogContainer.style.position = 'fixed';
        dialogContainer.style.top = '0';
        dialogContainer.style.left = '0';
        dialogContainer.style.width = '100%';
        dialogContainer.style.height = '100%';
        dialogContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        dialogContainer.style.display = 'flex';
        dialogContainer.style.justifyContent = 'center';
        dialogContainer.style.alignItems = 'center';
        dialogContainer.style.zIndex = '1000';
        
        // 创建对话框内容
        const dialog = document.createElement('div');
        dialog.className = 'dialog';
        dialog.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        dialog.style.padding = '20px';
        dialog.style.borderRadius = '10px';
        dialog.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.3)';
        dialog.style.width = '90%';
        dialog.style.maxWidth = '400px';
        dialog.style.border = '1px solid rgba(255, 255, 255, 0.15)';
        dialog.style.backdropFilter = 'blur(12px)';
        dialog.style.color = 'white';
        
        // 添加标题
        const title = document.createElement('h3');
        title.textContent = '编辑姓名';
        title.style.marginTop = '0';
        title.style.marginBottom = '20px';
        title.style.textAlign = 'center';
        title.style.color = 'white';
        
        // 添加输入框
        const name1Input = document.createElement('input');
        name1Input.type = 'text';
        name1Input.value = name1Display.textContent;
        name1Input.placeholder = '你的姓名';
        name1Input.style.display = 'block';
        name1Input.style.width = '100%';
        name1Input.style.padding = '10px';
        name1Input.style.marginBottom = '15px';
        name1Input.style.borderRadius = '5px';
        name1Input.style.border = '1px solid rgba(255, 255, 255, 0.2)';
        name1Input.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
        name1Input.style.color = 'white';
        
        const name2Input = document.createElement('input');
        name2Input.type = 'text';
        name2Input.value = name2Display.textContent;
        name2Input.placeholder = '你的伴侣姓名';
        name2Input.style.display = 'block';
        name2Input.style.width = '100%';
        name2Input.style.padding = '10px';
        name2Input.style.marginBottom = '20px';
        name2Input.style.borderRadius = '5px';
        name2Input.style.border = '1px solid rgba(255, 255, 255, 0.2)';
        name2Input.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
        name2Input.style.color = 'white';
        
        // 添加按钮容器
        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'space-between';
        
        // 添加取消按钮
        const cancelButton = document.createElement('button');
        cancelButton.textContent = '取消';
        cancelButton.style.padding = '10px 20px';
        cancelButton.style.border = '1px solid rgba(255, 255, 255, 0.2)';
        cancelButton.style.borderRadius = '5px';
        cancelButton.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';
        cancelButton.style.color = 'white';
        cancelButton.style.cursor = 'pointer';
        
        // 添加保存按钮
        const saveButton = document.createElement('button');
        saveButton.textContent = '保存';
        saveButton.style.padding = '10px 20px';
        saveButton.style.border = 'none';
        saveButton.style.borderRadius = '5px';
        saveButton.style.color = 'white';
        saveButton.style.cursor = 'pointer';
        
        // 添加渐变背景
        saveButton.style.backgroundImage = 'linear-gradient(to top, #fbc2eb 0%, #a6c1ee 100%)';
        saveButton.style.backgroundSize = '100% 100%';
        
        // 添加点击事件
        cancelButton.addEventListener('click', function() {
            document.body.removeChild(dialogContainer);
        });
        
        saveButton.addEventListener('click', function() {
            saveNames(name1Input.value, name2Input.value);
            document.body.removeChild(dialogContainer);
        });
        
        // 添加按钮到容器
        buttonContainer.appendChild(cancelButton);
        buttonContainer.appendChild(saveButton);
        
        // 添加内容到对话框
        dialog.appendChild(title);
        dialog.appendChild(name1Input);
        dialog.appendChild(name2Input);
        dialog.appendChild(buttonContainer);
        
        // 添加对话框到容器
        dialogContainer.appendChild(dialog);
        document.body.appendChild(dialogContainer);
        
        // 聚焦第一个输入框
        name1Input.focus();
    }
    
    // 保存姓名
    function saveNames(name1, name2) {
        localStorage.setItem('name1', name1);
        localStorage.setItem('name2', name2);
        
        // 更新显示
        name1Display.textContent = name1;
        name2Display.textContent = name2;
        
        // 显示保存消息
        showSavedMessage('姓名已保存!');
        
        // 更新友谊渐变效果
        updateFriendshipGradients();
        
        // 添加庆祝动画
        celebrateAction();
    }
    
    // 加载保存的数据
    function loadData() {
        // 加载名字
        const savedName1 = localStorage.getItem('name1');
        const savedName2 = localStorage.getItem('name2');
        if (savedName1) name1Display.textContent = savedName1;
        if (savedName2) name2Display.textContent = savedName2;
        
        // 加载头像
        const savedAvatar1 = localStorage.getItem('avatar1');
        const savedAvatar2 = localStorage.getItem('avatar2');
        if (savedAvatar1) avatar1Img.src = savedAvatar1;
        if (savedAvatar2) avatar2Img.src = savedAvatar2;
    }
    
    // 显示保存消息
    function showSavedMessage(message) {
        const saveNotification = document.createElement('div');
        saveNotification.textContent = message;
        saveNotification.style.position = 'fixed';
        saveNotification.style.top = '20px';
        saveNotification.style.left = '50%';
        saveNotification.style.transform = 'translateX(-50%)';
        saveNotification.style.padding = '10px 20px';
        saveNotification.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        saveNotification.style.color = 'white';
        saveNotification.style.borderRadius = '4px';
        saveNotification.style.zIndex = '1000';
        saveNotification.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
        saveNotification.style.animation = 'fadeInOut 2s ease-in-out';
        saveNotification.style.border = '1px solid rgba(255, 255, 255, 0.15)';
        
        // 添加渐变背景
        saveNotification.style.backgroundImage = 'linear-gradient(to top, #fbc2eb 0%, #a6c1ee 100%)';
        saveNotification.style.backgroundSize = '100% 100%';
        
        // 添加动画样式
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeInOut {
                0% { opacity: 0; transform: translate(-50%, -20px); }
                20% { opacity: 1; transform: translate(-50%, 0); }
                80% { opacity: 1; transform: translate(-50%, 0); }
                100% { opacity: 0; transform: translate(-50%, -20px); }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(saveNotification);
        
        // 2秒后移除保存消息
        setTimeout(() => {
            document.body.removeChild(saveNotification);
            document.head.removeChild(style);
        }, 2000);
    }
    
    // 更新计数器
    function updateCounter() {
        // 使用固定开始日期（2023-10-30）
        const startDate = new Date('2024-11-30');
        const currentDate = new Date();
        
        const totalSeconds = Math.floor((currentDate - startDate) / 1000);
        
        const days = Math.floor(totalSeconds / 3600 / 24);
        const hours = Math.floor(totalSeconds / 3600) % 24;
        const minutes = Math.floor(totalSeconds / 60) % 60;
        const seconds = Math.floor(totalSeconds) % 60;
        
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
        // 根据名字生成唯一的色调值
        const name1 = name1Display.textContent || '友谊';
        const name2 = name2Display.textContent || '时光';
        
        // 使用名字的字符编码来生成色调值
        let hue1 = 0;
        for (let i = 0; i < name1.length; i++) {
            hue1 += name1.charCodeAt(i);
        }
        hue1 = hue1 % 360;
        
        let hue2 = 0;
        for (let i = 0; i < name2.length; i++) {
            hue2 += name2.charCodeAt(i);
        }
        hue2 = (hue2 % 360 + 180) % 360; // 对比色
        
        const hue3 = (hue1 + 80) % 360;
        
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
        
        // 添加姓名显示悬停效果
        const nameDisplays = document.querySelectorAll('.name-display');
        nameDisplays.forEach(nameDisplay => {
            nameDisplay.addEventListener('click', openNameEditDialog);
            
            nameDisplay.addEventListener('mouseover', function() {
                this.style.cursor = 'pointer';
                this.style.transform = 'translateY(-3px)';
                this.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.25)';
            });
            
            nameDisplay.addEventListener('mouseout', function() {
                this.style.transform = '';
                this.style.boxShadow = '';
            });
        });
    }
    
    // 庆祝动画
    function celebrateAction() {
        const celebration = document.createElement('div');
        celebration.className = 'celebration';
        document.body.appendChild(celebration);
        
        // 创建彩纸
        for (let i = 0; i < 50; i++) {
            createConfetti(celebration);
        }
        
        // 5秒后移除庆祝动画
        setTimeout(() => {
            document.body.removeChild(celebration);
        }, 5000);
    }
    
    function createConfetti(parent) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        
        // 随机颜色
        const hue = Math.floor(Math.random() * 360);
        confetti.style.backgroundColor = `hsl(${hue}, 80%, 60%)`;
        
        // 随机大小
        const size = Math.random() * 10 + 5;
        confetti.style.width = `${size}px`;
        confetti.style.height = `${size}px`;
        
        // 随机形状
        const shapes = ['50%', '0%'];
        const shape = Math.random() > 0.5 ? shapes[0] : shapes[1];
        confetti.style.borderRadius = shape;
        
        // 随机位置
        confetti.style.left = `${Math.random() * 100}%`;
        
        // 随机动画时间
        const duration = Math.random() * 3 + 2;
        confetti.style.animation = `fall ${duration}s ease-in infinite`;
        
        // 随机动画延迟
        confetti.style.animationDelay = `${Math.random() * 2}s`;
        
        parent.appendChild(confetti);
    }
});
