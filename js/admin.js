document.addEventListener('DOMContentLoaded', function() {
    // 常量定义
    const BOY_USERNAME_KEY = "boyUsername";
    const BOY_PASSWORD_KEY = "boyPassword";
    const GIRL_USERNAME_KEY = "girlUsername";
    const GIRL_PASSWORD_KEY = "girlPassword";
    const ADMIN_PASSWORD_KEY = "adminPassword";
    const BOY_MESSAGE_KEY = "boyMessage";
    const BOY_TRAITS_KEY = "boyTraits";
    const GIRL_MESSAGE_KEY = "girlMessage";
    const GIRL_TRAITS_KEY = "girlTraits";
    
    // 默认值设置
    const DEFAULT_BOY_USERNAME = "boy";
    const DEFAULT_BOY_PASSWORD = "boy123";
    const DEFAULT_GIRL_USERNAME = "girl";
    const DEFAULT_GIRL_PASSWORD = "girl123";
    const DEFAULT_ADMIN_PASSWORD = "loveyou";
    
    // 初始化本地存储中的账户信息（如果不存在）
    if (!localStorage.getItem(BOY_USERNAME_KEY)) {
        localStorage.setItem(BOY_USERNAME_KEY, DEFAULT_BOY_USERNAME);
    }
    if (!localStorage.getItem(BOY_PASSWORD_KEY)) {
        localStorage.setItem(BOY_PASSWORD_KEY, DEFAULT_BOY_PASSWORD);
    }
    if (!localStorage.getItem(GIRL_USERNAME_KEY)) {
        localStorage.setItem(GIRL_USERNAME_KEY, DEFAULT_GIRL_USERNAME);
    }
    if (!localStorage.getItem(GIRL_PASSWORD_KEY)) {
        localStorage.setItem(GIRL_PASSWORD_KEY, DEFAULT_GIRL_PASSWORD);
    }
    if (!localStorage.getItem(ADMIN_PASSWORD_KEY)) {
        localStorage.setItem(ADMIN_PASSWORD_KEY, DEFAULT_ADMIN_PASSWORD);
    }
    
    // 获取DOM元素 - 登录选择相关
    const loginSelectScreen = document.getElementById('loginSelectScreen');
    const boyLoginOption = document.getElementById('boyLoginOption');
    const girlLoginOption = document.getElementById('girlLoginOption');
    const adminLoginOption = document.getElementById('adminLoginOption');
    
    // 获取DOM元素 - 男生登录相关
    const boyLoginScreen = document.getElementById('boyLoginScreen');
    const boyUsernameInput = document.getElementById('boyUsername');
    const boyPasswordInput = document.getElementById('boyPassword');
    const boyLoginBtn = document.getElementById('boyLoginBtn');
    const backFromBoyLogin = document.getElementById('backFromBoyLogin');
    const boyLoginError = document.getElementById('boyLoginError');
    
    // 获取DOM元素 - 女生登录相关
    const girlLoginScreen = document.getElementById('girlLoginScreen');
    const girlUsernameInput = document.getElementById('girlUsername');
    const girlPasswordInput = document.getElementById('girlPassword');
    const girlLoginBtn = document.getElementById('girlLoginBtn');
    const backFromGirlLogin = document.getElementById('backFromGirlLogin');
    const girlLoginError = document.getElementById('girlLoginError');
    
    // 获取DOM元素 - 管理员登录相关
    const adminLoginScreen = document.getElementById('adminLoginScreen');
    const adminPasswordInput = document.getElementById('adminPassword');
    const adminLoginBtn = document.getElementById('adminLoginBtn');
    const backFromAdminLogin = document.getElementById('backFromAdminLogin');
    const adminLoginError = document.getElementById('adminLoginError');
    
    // 获取DOM元素 - 容器相关
    const boyContainer = document.getElementById('boyContainer');
    const girlContainer = document.getElementById('girlContainer');
    const adminContainer = document.getElementById('adminContainer');
    
    // 获取DOM元素 - 男生信息相关
    const boyMessageInput = document.getElementById('boyMessageInput');
    const boyTraitsInput = document.getElementById('boyTraitsInput');
    const saveBoyInfo = document.getElementById('saveBoyInfo');
    const boyInfoSuccess = document.getElementById('boyInfoSuccess');
    const boyPhotoPreview = document.getElementById('boyPhotoPreview');
    const boyPhotoUpload = document.getElementById('boyPhotoUpload');
    const saveBoyPhoto = document.getElementById('saveBoyPhoto');
    const boyPhotoSuccess = document.getElementById('boyPhotoSuccess');
    const boyCurrentPassword = document.getElementById('boyCurrentPassword');
    const boyNewPassword = document.getElementById('boyNewPassword');
    const boyConfirmPassword = document.getElementById('boyConfirmPassword');
    const changeBoyPassword = document.getElementById('changeBoyPassword');
    const boyPasswordSuccess = document.getElementById('boyPasswordSuccess');
    const boyPasswordError = document.getElementById('boyPasswordError');
    const boyLogout = document.getElementById('boyLogout');
    
    // 获取DOM元素 - 女生信息相关
    const girlMessageInput = document.getElementById('girlMessageInput');
    const girlTraitsInput = document.getElementById('girlTraitsInput');
    const saveGirlInfo = document.getElementById('saveGirlInfo');
    const girlInfoSuccess = document.getElementById('girlInfoSuccess');
    const girlPhotoPreview = document.getElementById('girlPhotoPreview');
    const girlPhotoUpload = document.getElementById('girlPhotoUpload');
    const saveGirlPhoto = document.getElementById('saveGirlPhoto');
    const girlPhotoSuccess = document.getElementById('girlPhotoSuccess');
    const girlCurrentPassword = document.getElementById('girlCurrentPassword');
    const girlNewPassword = document.getElementById('girlNewPassword');
    const girlConfirmPassword = document.getElementById('girlConfirmPassword');
    const changeGirlPassword = document.getElementById('changeGirlPassword');
    const girlPasswordSuccess = document.getElementById('girlPasswordSuccess');
    const girlPasswordError = document.getElementById('girlPasswordError');
    const girlLogout = document.getElementById('girlLogout');
    
    // 获取DOM元素 - 管理员相关
    const anniversaryDate = document.getElementById('anniversaryDate');
    const saveDate = document.getElementById('saveDate');
    const dateSuccess = document.getElementById('dateSuccess');
    const resetBoyUsername = document.getElementById('resetBoyUsername');
    const resetBoyPassword = document.getElementById('resetBoyPassword');
    const resetBoyAccount = document.getElementById('resetBoyAccount');
    const boyResetSuccess = document.getElementById('boyResetSuccess');
    const resetGirlUsername = document.getElementById('resetGirlUsername');
    const resetGirlPassword = document.getElementById('resetGirlPassword');
    const resetGirlAccount = document.getElementById('resetGirlAccount');
    const girlResetSuccess = document.getElementById('girlResetSuccess');
    const resetAll = document.getElementById('resetAll');
    const resetSuccess = document.getElementById('resetSuccess');
    const currentAdminPassword = document.getElementById('currentAdminPassword');
    const newAdminPassword = document.getElementById('newAdminPassword');
    const confirmAdminPassword = document.getElementById('confirmAdminPassword');
    const changeAdminPassword = document.getElementById('changeAdminPassword');
    const adminPasswordSuccess = document.getElementById('adminPasswordSuccess');
    const adminPasswordError = document.getElementById('adminPasswordError');
    const adminLogout = document.getElementById('adminLogout');
    
    // 加载已保存的数据
    loadSavedData();
    
    // 登录选择事件处理
    boyLoginOption.addEventListener('click', function() {
        loginSelectScreen.style.display = 'none';
        boyLoginScreen.style.display = 'flex';
    });
    
    girlLoginOption.addEventListener('click', function() {
        loginSelectScreen.style.display = 'none';
        girlLoginScreen.style.display = 'flex';
    });
    
    adminLoginOption.addEventListener('click', function() {
        loginSelectScreen.style.display = 'none';
        adminLoginScreen.style.display = 'flex';
    });
    
    // 返回按钮事件处理
    backFromBoyLogin.addEventListener('click', function() {
        boyLoginScreen.style.display = 'none';
        loginSelectScreen.style.display = 'flex';
        boyLoginError.style.display = 'none';
        boyUsernameInput.value = '';
        boyPasswordInput.value = '';
    });
    
    backFromGirlLogin.addEventListener('click', function() {
        girlLoginScreen.style.display = 'none';
        loginSelectScreen.style.display = 'flex';
        girlLoginError.style.display = 'none';
        girlUsernameInput.value = '';
        girlPasswordInput.value = '';
    });
    
    backFromAdminLogin.addEventListener('click', function() {
        adminLoginScreen.style.display = 'none';
        loginSelectScreen.style.display = 'flex';
        adminLoginError.style.display = 'none';
        adminPasswordInput.value = '';
    });
    
    // 登录按钮事件处理
    boyLoginBtn.addEventListener('click', function() {
        const username = boyUsernameInput.value;
        const password = boyPasswordInput.value;
        const storedUsername = localStorage.getItem(BOY_USERNAME_KEY);
        const storedPassword = localStorage.getItem(BOY_PASSWORD_KEY);
        
        if (username === storedUsername && password === storedPassword) {
            boyLoginScreen.style.display = 'none';
            boyContainer.style.display = 'block';
            boyLoginError.style.display = 'none';
            boyUsernameInput.value = '';
            boyPasswordInput.value = '';
        } else {
            boyLoginError.style.display = 'block';
        }
    });
    
    girlLoginBtn.addEventListener('click', function() {
        const username = girlUsernameInput.value;
        const password = girlPasswordInput.value;
        const storedUsername = localStorage.getItem(GIRL_USERNAME_KEY);
        const storedPassword = localStorage.getItem(GIRL_PASSWORD_KEY);
        
        if (username === storedUsername && password === storedPassword) {
            girlLoginScreen.style.display = 'none';
            girlContainer.style.display = 'block';
            girlLoginError.style.display = 'none';
            girlUsernameInput.value = '';
            girlPasswordInput.value = '';
        } else {
            girlLoginError.style.display = 'block';
        }
    });
    
    adminLoginBtn.addEventListener('click', function() {
        const password = adminPasswordInput.value;
        const storedPassword = localStorage.getItem(ADMIN_PASSWORD_KEY);
        
        if (password === storedPassword) {
            adminLoginScreen.style.display = 'none';
            adminContainer.style.display = 'block';
            adminLoginError.style.display = 'none';
            adminPasswordInput.value = '';
        } else {
            adminLoginError.style.display = 'block';
        }
    });
    
    // 回车键登录
    boyPasswordInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            boyLoginBtn.click();
        }
    });
    
    girlPasswordInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            girlLoginBtn.click();
        }
    });
    
    adminPasswordInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            adminLoginBtn.click();
        }
    });
    
    // 退出登录按钮事件处理
    boyLogout.addEventListener('click', function() {
        boyContainer.style.display = 'none';
        loginSelectScreen.style.display = 'flex';
    });
    
    girlLogout.addEventListener('click', function() {
        girlContainer.style.display = 'none';
        loginSelectScreen.style.display = 'flex';
    });
    
    adminLogout.addEventListener('click', function() {
        adminContainer.style.display = 'none';
        loginSelectScreen.style.display = 'flex';
    });
    
    // 男生信息保存事件处理
    saveBoyInfo.addEventListener('click', function() {
        const message = boyMessageInput.value;
        const traits = boyTraitsInput.value;
        
        localStorage.setItem(BOY_MESSAGE_KEY, message);
        localStorage.setItem(BOY_TRAITS_KEY, traits);
        
        boyInfoSuccess.style.display = 'block';
        
        setTimeout(() => {
            boyInfoSuccess.style.display = 'none';
        }, 3000);
    });
    
    // 女生信息保存事件处理
    saveGirlInfo.addEventListener('click', function() {
        const message = girlMessageInput.value;
        const traits = girlTraitsInput.value;
        
        localStorage.setItem(GIRL_MESSAGE_KEY, message);
        localStorage.setItem(GIRL_TRAITS_KEY, traits);
        
        girlInfoSuccess.style.display = 'block';
        
        setTimeout(() => {
            girlInfoSuccess.style.display = 'none';
        }, 3000);
    });
    
    // 处理照片上传
    function handleImageUpload(input, imageElement) {
        if (input.files && input.files[0]) {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                imageElement.src = e.target.result;
            };
            
            reader.readAsDataURL(input.files[0]);
        }
    }
    
    boyPhotoUpload.addEventListener('change', function() {
        handleImageUpload(this, boyPhotoPreview);
    });
    
    girlPhotoUpload.addEventListener('change', function() {
        handleImageUpload(this, girlPhotoPreview);
    });
    
    // 保存照片事件处理
    saveBoyPhoto.addEventListener('click', function() {
        if (boyPhotoPreview.src) {
            localStorage.setItem('boyPhoto', boyPhotoPreview.src);
            
            boyPhotoSuccess.style.display = 'block';
            
            setTimeout(() => {
                boyPhotoSuccess.style.display = 'none';
            }, 3000);
        }
    });
    
    saveGirlPhoto.addEventListener('click', function() {
        if (girlPhotoPreview.src) {
            localStorage.setItem('girlPhoto', girlPhotoPreview.src);
            
            girlPhotoSuccess.style.display = 'block';
            
            setTimeout(() => {
                girlPhotoSuccess.style.display = 'none';
            }, 3000);
        }
    });
    
    // 修改密码事件处理
    changeBoyPassword.addEventListener('click', function() {
        const currentPassword = boyCurrentPassword.value;
        const newPassword = boyNewPassword.value;
        const confirmPassword = boyConfirmPassword.value;
        const storedPassword = localStorage.getItem(BOY_PASSWORD_KEY);
        
        if (currentPassword === storedPassword && newPassword === confirmPassword && newPassword !== '') {
            localStorage.setItem(BOY_PASSWORD_KEY, newPassword);
            
            boyPasswordSuccess.style.display = 'block';
            boyPasswordError.style.display = 'none';
            
            boyCurrentPassword.value = '';
            boyNewPassword.value = '';
            boyConfirmPassword.value = '';
            
            setTimeout(() => {
                boyPasswordSuccess.style.display = 'none';
            }, 3000);
        } else {
            boyPasswordError.style.display = 'block';
            boyPasswordSuccess.style.display = 'none';
            
            setTimeout(() => {
                boyPasswordError.style.display = 'none';
            }, 3000);
        }
    });
    
    changeGirlPassword.addEventListener('click', function() {
        const currentPassword = girlCurrentPassword.value;
        const newPassword = girlNewPassword.value;
        const confirmPassword = girlConfirmPassword.value;
        const storedPassword = localStorage.getItem(GIRL_PASSWORD_KEY);
        
        if (currentPassword === storedPassword && newPassword === confirmPassword && newPassword !== '') {
            localStorage.setItem(GIRL_PASSWORD_KEY, newPassword);
            
            girlPasswordSuccess.style.display = 'block';
            girlPasswordError.style.display = 'none';
            
            girlCurrentPassword.value = '';
            girlNewPassword.value = '';
            girlConfirmPassword.value = '';
            
            setTimeout(() => {
                girlPasswordSuccess.style.display = 'none';
            }, 3000);
        } else {
            girlPasswordError.style.display = 'block';
            girlPasswordSuccess.style.display = 'none';
            
            setTimeout(() => {
                girlPasswordError.style.display = 'none';
            }, 3000);
        }
    });
    
    // 保存日期事件处理
    saveDate.addEventListener('click', function() {
        const dateValue = anniversaryDate.value;
        
        if (dateValue) {
            localStorage.setItem('anniversaryDate', dateValue);
            dateSuccess.style.display = 'block';
            
            setTimeout(() => {
                dateSuccess.style.display = 'none';
            }, 3000);
        } else {
            alert('请选择有效的日期！');
        }
    });
    
    // 重置账户事件处理
    resetBoyAccount.addEventListener('click', function() {
        const username = resetBoyUsername.value;
        const password = resetBoyPassword.value;
        
        if (username && password) {
            localStorage.setItem(BOY_USERNAME_KEY, username);
            localStorage.setItem(BOY_PASSWORD_KEY, password);
            
            boyResetSuccess.style.display = 'block';
            
            setTimeout(() => {
                boyResetSuccess.style.display = 'none';
            }, 3000);
        } else {
            alert('请输入有效的用户名和密码！');
        }
    });
    
    resetGirlAccount.addEventListener('click', function() {
        const username = resetGirlUsername.value;
        const password = resetGirlPassword.value;
        
        if (username && password) {
            localStorage.setItem(GIRL_USERNAME_KEY, username);
            localStorage.setItem(GIRL_PASSWORD_KEY, password);
            
            girlResetSuccess.style.display = 'block';
            
            setTimeout(() => {
                girlResetSuccess.style.display = 'none';
            }, 3000);
        } else {
            alert('请输入有效的用户名和密码！');
        }
    });
    
    // 修改管理员密码事件处理
    changeAdminPassword.addEventListener('click', function() {
        const currentPassword = currentAdminPassword.value;
        const newPassword = newAdminPassword.value;
        const confirmPassword = confirmAdminPassword.value;
        const storedPassword = localStorage.getItem(ADMIN_PASSWORD_KEY);
        
        if (currentPassword === storedPassword && newPassword === confirmPassword && newPassword !== '') {
            localStorage.setItem(ADMIN_PASSWORD_KEY, newPassword);
            
            adminPasswordSuccess.style.display = 'block';
            adminPasswordError.style.display = 'none';
            
            currentAdminPassword.value = '';
            newAdminPassword.value = '';
            confirmAdminPassword.value = '';
            
            setTimeout(() => {
                adminPasswordSuccess.style.display = 'none';
            }, 3000);
        } else {
            adminPasswordError.style.display = 'block';
            adminPasswordSuccess.style.display = 'none';
            
            setTimeout(() => {
                adminPasswordError.style.display = 'none';
            }, 3000);
        }
    });
    
    // 重置所有设置事件处理
    resetAll.addEventListener('click', function() {
        if (confirm('确定要重置所有设置吗？这将清除日期、照片和个人信息。')) {
            // 保留账户信息，但重置其他所有数据
            localStorage.removeItem('anniversaryDate');
            localStorage.removeItem('boyPhoto');
            localStorage.removeItem('girlPhoto');
            localStorage.removeItem(BOY_MESSAGE_KEY);
            localStorage.removeItem(BOY_TRAITS_KEY);
            localStorage.removeItem(GIRL_MESSAGE_KEY);
            localStorage.removeItem(GIRL_TRAITS_KEY);
            
            // 重置显示
            anniversaryDate.value = '';
            boyMessageInput.value = '';
            boyTraitsInput.value = '';
            girlMessageInput.value = '';
            girlTraitsInput.value = '';
            boyPhotoPreview.src = 'images/boy-default.jpg';
            girlPhotoPreview.src = 'images/girl-default.jpg';
            
            resetSuccess.style.display = 'block';
            
            setTimeout(() => {
                resetSuccess.style.display = 'none';
            }, 3000);
        }
    });
    
    // 加载已保存的数据
    function loadSavedData() {
        // 加载日期
        const storedDate = localStorage.getItem('anniversaryDate');
        if (storedDate) {
            anniversaryDate.value = storedDate;
        }
        
        // 加载照片
        const storedBoyPhoto = localStorage.getItem('boyPhoto');
        if (storedBoyPhoto) {
            boyPhotoPreview.src = storedBoyPhoto;
        }
        
        const storedGirlPhoto = localStorage.getItem('girlPhoto');
        if (storedGirlPhoto) {
            girlPhotoPreview.src = storedGirlPhoto;
        }
        
        // 加载个人信息
        const storedBoyMessage = localStorage.getItem(BOY_MESSAGE_KEY);
        if (storedBoyMessage) {
            boyMessageInput.value = storedBoyMessage;
        }
        
        const storedBoyTraits = localStorage.getItem(BOY_TRAITS_KEY);
        if (storedBoyTraits) {
            boyTraitsInput.value = storedBoyTraits;
        }
        
        const storedGirlMessage = localStorage.getItem(GIRL_MESSAGE_KEY);
        if (storedGirlMessage) {
            girlMessageInput.value = storedGirlMessage;
        }
        
        const storedGirlTraits = localStorage.getItem(GIRL_TRAITS_KEY);
        if (storedGirlTraits) {
            girlTraitsInput.value = storedGirlTraits;
        }
    }
});
