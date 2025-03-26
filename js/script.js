document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const daysCounter = document.getElementById('daysCounter');
    const startDateDisplay = document.getElementById('startDate');
    const boyImage = document.getElementById('boyImage');
    const girlImage = document.getElementById('girlImage');
    const boyMessage = document.getElementById('boyMessage');
    const girlMessage = document.getElementById('girlMessage');
    const boyTraits = document.getElementById('boyTraits');
    const girlTraits = document.getElementById('girlTraits');
    const boyEditButton = document.getElementById('boyEditButton');
    const girlEditButton = document.getElementById('girlEditButton');
    
    // 模态框元素
    const loginModal = document.getElementById('loginModal');
    const editModal = document.getElementById('editModal');
    const closeButtons = document.getElementsByClassName('close');
    const loginButton = document.getElementById('loginButton');
    const saveButton = document.getElementById('saveButton');
    const loginMessage = document.getElementById('loginMessage');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const messageInput = document.getElementById('messageInput');
    const traitsInput = document.getElementById('traitsInput');
    const photoInput = document.getElementById('photoInput');
    const loginTitle = document.getElementById('loginTitle');
    const editTitle = document.getElementById('editTitle');
    
    // 当前编辑的一侧（boy/girl）
    let currentEditSide = '';
    // 当前登录的用户
    let currentLoggedInUser = null;
    
    // 从本地存储中获取数据
    const storedDate = localStorage.getItem('anniversaryDate');
    const storedBoyPhoto = localStorage.getItem('boyPhoto');
    const storedGirlPhoto = localStorage.getItem('girlPhoto');
    const storedBoyMessage = localStorage.getItem('boyMessage');
    const storedGirlMessage = localStorage.getItem('girlMessage');
    const storedBoyTraits = localStorage.getItem('boyTraits');
    const storedGirlTraits = localStorage.getItem('girlTraits');
    
    // 预设的用户账号
    const users = {
        boy: { username: 'boy', password: 'boy123', side: 'boy' },
        girl: { username: 'girl', password: 'girl123', side: 'girl' }
    };
    
    // 如果有存储的日期，则进行计算和显示
    if (storedDate) {
        updateCounter(storedDate);
        startDateDisplay.textContent = formatDate(storedDate);
    }
    
    // 如果有存储的照片，则显示
    if (storedBoyPhoto) {
        boyImage.src = storedBoyPhoto;
    } else {
        // 使用 GitHub 根目录的默认头像
        boyImage.src = '/images/boy-default.jpg';
    }
    
    if (storedGirlPhoto) {
        girlImage.src = storedGirlPhoto;
    } else {
        // 使用 GitHub 根目录的默认头像
        girlImage.src = '/images/girl-default.jpg';
    }
    
    // 如果有存储的留言和特征，则显示
    if (storedBoyMessage) {
        boyMessage.textContent = storedBoyMessage;
    }
    
    if (storedGirlMessage) {
        girlMessage.textContent = storedGirlMessage;
    }
    
    if (storedBoyTraits) {
        boyTraits.textContent = storedBoyTraits;
    }
    
    if (storedGirlTraits) {
        girlTraits.textContent = storedGirlTraits;
    }
    
    // 添加编辑按钮点击事件
    boyEditButton.addEventListener('click', function() {
        currentEditSide = 'boy';
        if (currentLoggedInUser && currentLoggedInUser.side === 'boy') {
            openEditModal('boy');
        } else {
            openLoginModal('boy');
        }
    });
    
    girlEditButton.addEventListener('click', function() {
        currentEditSide = 'girl';
        if (currentLoggedInUser && currentLoggedInUser.side === 'girl') {
            openEditModal('girl');
        } else {
            openLoginModal('girl');
        }
    });
    
    // 登录按钮点击事件
    loginButton.addEventListener('click', function() {
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();
        
        // 验证用户名和密码
        if (username === users.boy.username && password === users.boy.password) {
            currentLoggedInUser = users.boy;
            loginModal.style.display = 'none';
            openEditModal('boy');
        } else if (username === users.girl.username && password === users.girl.password) {
            currentLoggedInUser = users.girl;
            loginModal.style.display = 'none';
            openEditModal('girl');
        } else {
            loginMessage.textContent = '用户名或密码错误';
        }
    });
    
    // 保存按钮点击事件
    saveButton.addEventListener('click', function() {
        if (!currentLoggedInUser) return;
        
        const message = messageInput.value.trim();
        const traits = traitsInput.value.trim();
        const photoFile = photoInput.files[0];
        
        // 保存留言和特征
        if (currentLoggedInUser.side === 'boy') {
            if (message) {
                localStorage.setItem('boyMessage', message);
                boyMessage.textContent = message;
            }
            if (traits) {
                localStorage.setItem('boyTraits', traits);
                boyTraits.textContent = traits;
            }
        } else if (currentLoggedInUser.side === 'girl') {
            if (message) {
                localStorage.setItem('girlMessage', message);
                girlMessage.textContent = message;
            }
            if (traits) {
                localStorage.setItem('girlTraits', traits);
                girlTraits.textContent = traits;
            }
        }
        
        // 处理照片上传
        if (photoFile) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const photoData = e.target.result;
                if (currentLoggedInUser.side === 'boy') {
                    localStorage.setItem('boyPhoto', photoData);
                    boyImage.src = photoData;
                } else if (currentLoggedInUser.side === 'girl') {
                    localStorage.setItem('girlPhoto', photoData);
                    girlImage.src = photoData;
                }
            };
            reader.readAsDataURL(photoFile);
        }
        
        // 关闭模态框
        editModal.style.display = 'none';
    });
    
    // 关闭模态框按钮
    for (let i = 0; i < closeButtons.length; i++) {
        closeButtons[i].addEventListener('click', function() {
            loginModal.style.display = 'none';
            editModal.style.display = 'none';
        });
    }
    
    // 点击模态框外部关闭
    window.addEventListener('click', function(event) {
        if (event.target === loginModal) {
            loginModal.style.display = 'none';
        }
        if (event.target === editModal) {
            editModal.style.display = 'none';
        }
    });
    
    // 打开登录模态框
    function openLoginModal(side) {
        loginTitle.textContent = side === 'boy' ? '男生登录' : '女生登录';
        usernameInput.value = '';
        passwordInput.value = '';
        loginMessage.textContent = '';
        loginModal.style.display = 'block';
    }
    
    // 打开编辑模态框
    function openEditModal(side) {
        editTitle.textContent = side === 'boy' ? '编辑男生信息' : '编辑女生信息';
        
        // 填充当前数据
        if (side === 'boy') {
            messageInput.value = localStorage.getItem('boyMessage') || '';
            traitsInput.value = localStorage.getItem('boyTraits') || '';
        } else {
            messageInput.value = localStorage.getItem('girlMessage') || '';
            traitsInput.value = localStorage.getItem('girlTraits') || '';
        }
        
        photoInput.value = ''; // 清空文件输入
        editModal.style.display = 'block';
    }
    
    // 计算和更新天数
    function updateCounter(dateStr) {
        const startDate = new Date(dateStr);
        const today = new Date();
        
        // 计算天数差异
        const diffTime = Math.abs(today - startDate);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        // 更新计数器显示
        daysCounter.textContent = diffDays;
        
        // 添加计数器动画
        daysCounter.classList.add('pulse');
        setTimeout(() => {
            daysCounter.classList.remove('pulse');
        }, 1000);
    }
    
    // 格式化日期为友好显示
    function formatDate(dateStr) {
        const date = new Date(dateStr);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        
        return `${year}-${month}-${day}`;
    }
    
    // 添加随机气泡动画
    function createBubbles() {
        const bubblesContainer = document.querySelector('.bubbles');
        
        for (let i = 0; i < 5; i++) {
            const bubble = document.createElement('div');
            bubble.classList.add('bubble');
            
            // 随机位置和大小
            const size = Math.random() * 30 + 10;
            const left = Math.random() * 100;
            const delay = Math.random() * 15;
            
            bubble.style.width = `${size}px`;
            bubble.style.height = `${size}px`;
            bubble.style.left = `${left}%`;
            bubble.style.animationDelay = `${delay}s`;
            
            bubblesContainer.appendChild(bubble);
        }
    }
    
    // 初始化时创建气泡
    createBubbles();
});
