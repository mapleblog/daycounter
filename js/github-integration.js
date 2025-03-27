/**
 * GitHub集成功能
 * 用于从GitHub仓库读取和更新情侣计数器数据
 */

document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const dataSourceInfo = document.getElementById('dataSourceInfo');
    const refreshDataButton = document.getElementById('refreshDataButton');
    const githubConfigLink = document.getElementById('githubConfigLink');
    const githubConfigModal = document.getElementById('githubConfigModal');
    const saveGithubConfigButton = document.getElementById('saveGithubConfig');
    const githubConfigMessage = document.getElementById('githubConfigMessage');
    
    // 关闭按钮
    const closeButtons = document.getElementsByClassName('close');
    for (let i = 0; i < closeButtons.length; i++) {
        closeButtons[i].addEventListener('click', function() {
            githubConfigModal.style.display = 'none';
        });
    }
    
    // 点击模态框外部关闭
    window.addEventListener('click', function(event) {
        if (event.target === githubConfigModal) {
            githubConfigModal.style.display = 'none';
        }
    });
    
    // 打开GitHub配置模态框
    githubConfigLink.addEventListener('click', function(e) {
        e.preventDefault();
        // 加载已保存的配置
        const config = getGitHubConfig();
        document.getElementById('repoOwner').value = config.owner || '';
        document.getElementById('repoName').value = config.repo || '';
        document.getElementById('dataPath').value = config.path || 'data/couple-data.json';
        document.getElementById('githubToken').value = config.token || '';
        
        githubConfigModal.style.display = 'block';
    });
    
    // 保存GitHub配置
    saveGithubConfigButton.addEventListener('click', function() {
        const owner = document.getElementById('repoOwner').value.trim();
        const repo = document.getElementById('repoName').value.trim();
        const path = document.getElementById('dataPath').value.trim();
        const token = document.getElementById('githubToken').value.trim();
        
        if (!owner || !repo || !path) {
            githubConfigMessage.textContent = '请填写所有必填字段';
            githubConfigMessage.className = 'error-message';
            return;
        }
        
        // 保存配置到localStorage
        const config = { owner, repo, path, token };
        localStorage.setItem('githubConfig', JSON.stringify(config));
        
        githubConfigMessage.textContent = '配置已保存！';
        githubConfigMessage.className = 'success-message';
        
        // 立即尝试加载数据
        loadDataFromGitHub();
        
        // 3秒后关闭模态框
        setTimeout(function() {
            githubConfigModal.style.display = 'none';
        }, 3000);
    });
    
    // 刷新数据按钮点击事件
    refreshDataButton.addEventListener('click', function() {
        loadDataFromGitHub();
    });
    
    // 初始化时加载数据
    initializeGitHubIntegration();
    
    /**
     * 初始化GitHub集成
     */
    function initializeGitHubIntegration() {
        const config = getGitHubConfig();
        if (config.owner && config.repo && config.path) {
            loadDataFromGitHub();
        } else {
            useLocalStorage();
            dataSourceInfo.textContent = '使用本地存储模式 (点击配置GitHub)';
        }
    }
    
    /**
     * 获取GitHub配置
     */
    function getGitHubConfig() {
        const configStr = localStorage.getItem('githubConfig');
        return configStr ? JSON.parse(configStr) : {};
    }
    
    /**
     * 从GitHub加载数据
     */
    function loadDataFromGitHub() {
        const config = getGitHubConfig();
        if (!config.owner || !config.repo || !config.path) {
            dataSourceInfo.textContent = '未配置GitHub (点击进行配置)';
            return;
        }
        
        dataSourceInfo.textContent = '正在从GitHub加载数据...';
        
        // 构建API URL
        const apiUrl = `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${config.path}`;
        const headers = {};
        if (config.token) {
            headers.Authorization = `token ${config.token}`;
        }
        
        // 发起请求
        axios.get(apiUrl, { headers })
            .then(response => {
                // GitHub API返回的内容是Base64编码的
                const content = atob(response.data.content);
                const data = JSON.parse(content);
                
                // 更新UI
                updateUIWithData(data);
                
                // 记录sha值用于后续更新
                localStorage.setItem('lastContentSha', response.data.sha);
                dataSourceInfo.textContent = `数据已从GitHub加载 (${new Date().toLocaleTimeString()})`;
            })
            .catch(error => {
                console.error('从GitHub加载数据失败:', error);
                dataSourceInfo.textContent = `从GitHub加载失败: ${error.message}`;
                
                // 如果加载失败，回退到本地存储
                useLocalStorage();
            });
    }
    
    /**
     * 更新数据到GitHub
     */
    function updateDataToGitHub(data) {
        const config = getGitHubConfig();
        if (!config.owner || !config.repo || !config.path || !config.token) {
            console.log('未完全配置GitHub或缺少令牌，无法更新数据');
            return Promise.reject('未完全配置GitHub或缺少令牌');
        }
        
        // 构建API URL
        const apiUrl = `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${config.path}`;
        const headers = {
            Authorization: `token ${config.token}`
        };
        
        // 获取当前文件的SHA
        const sha = localStorage.getItem('lastContentSha');
        if (!sha) {
            return Promise.reject('缺少文件SHA，无法更新');
        }
        
        // 准备更新的内容
        const content = btoa(JSON.stringify(data, null, 2)); // Base64编码
        
        // 发起更新请求
        return axios.put(apiUrl, {
            message: '更新情侣计数器数据',
            content: content,
            sha: sha
        }, { headers });
    }
    
    /**
     * 使用本地存储模式
     */
    function useLocalStorage() {
        // 从localStorage读取数据并更新UI
        const anniversaryDate = localStorage.getItem('anniversaryDate');
        const boyPhoto = localStorage.getItem('boyPhoto');
        const girlPhoto = localStorage.getItem('girlPhoto');
        const boyMessage = localStorage.getItem('boyMessage');
        const girlMessage = localStorage.getItem('girlMessage');
        const boyTraits = localStorage.getItem('boyTraits');
        const girlTraits = localStorage.getItem('girlTraits');
        
        // 构建数据对象
        const data = {
            anniversaryDate,
            profiles: {
                boy: {
                    photo: boyPhoto,
                    message: boyMessage,
                    traits: boyTraits
                },
                girl: {
                    photo: girlPhoto,
                    message: girlMessage,
                    traits: girlTraits
                }
            }
        };
        
        // 更新UI
        updateUIWithData(data);
    }
    
    /**
     * 使用数据更新UI
     */
    function updateUIWithData(data) {
        if (!data) return;
        
        // 更新纪念日和计数器
        if (data.anniversaryDate) {
            localStorage.setItem('anniversaryDate', data.anniversaryDate);
            updateCounter(data.anniversaryDate);
            document.getElementById('startDate').textContent = formatDate(data.anniversaryDate);
        }
        
        // 更新男生信息
        if (data.profiles && data.profiles.boy) {
            const boy = data.profiles.boy;
            if (boy.photo) {
                localStorage.setItem('boyPhoto', boy.photo);
                document.getElementById('boyImage').src = boy.photo;
            }
            if (boy.message) {
                localStorage.setItem('boyMessage', boy.message);
                document.getElementById('boyMessage').textContent = boy.message;
            }
            if (boy.traits) {
                localStorage.setItem('boyTraits', boy.traits);
                document.getElementById('boyTraits').textContent = boy.traits;
            }
        }
        
        // 更新女生信息
        if (data.profiles && data.profiles.girl) {
            const girl = data.profiles.girl;
            if (girl.photo) {
                localStorage.setItem('girlPhoto', girl.photo);
                document.getElementById('girlImage').src = girl.photo;
            }
            if (girl.message) {
                localStorage.setItem('girlMessage', girl.message);
                document.getElementById('girlMessage').textContent = girl.message;
            }
            if (girl.traits) {
                localStorage.setItem('girlTraits', girl.traits);
                document.getElementById('girlTraits').textContent = girl.traits;
            }
        }
    }
    
    /**
     * 计算和更新天数计数器
     */
    function updateCounter(dateStr) {
        const startDate = new Date(dateStr);
        const currentDate = new Date();
        
        // 计算天数差异
        const timeDiff = currentDate.getTime() - startDate.getTime();
        const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
        
        // 更新计数器显示
        const daysCounter = document.getElementById('daysCounter');
        if (daysCounter) {
            daysCounter.textContent = daysDiff;
        }
    }
    
    /**
     * 格式化日期为友好显示
     */
    function formatDate(dateStr) {
        const date = new Date(dateStr);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        
        return `${year}年${month}月${day}日`;
    }
    
    // 导出函数供其他脚本使用
    window.githubIntegration = {
        loadDataFromGitHub,
        updateDataToGitHub,
        getGitHubConfig
    };
});

// 修改原有的保存按钮事件，添加GitHub同步功能
document.addEventListener('DOMContentLoaded', function() {
    const originalSaveButton = document.getElementById('saveButton');
    if (originalSaveButton) {
        // 保存原始的点击事件处理程序
        const originalClickHandler = originalSaveButton.onclick;
        
        // 设置新的点击事件处理程序
        originalSaveButton.onclick = function(event) {
            // 调用原始的处理程序
            if (originalClickHandler) {
                originalClickHandler.call(this, event);
            }
            
            // 添加GitHub同步功能
            setTimeout(function() {
                const config = window.githubIntegration.getGitHubConfig();
                if (config.owner && config.repo && config.path && config.token) {
                    // 构建要同步的数据
                    const data = {
                        anniversaryDate: localStorage.getItem('anniversaryDate'),
                        profiles: {
                            boy: {
                                photo: localStorage.getItem('boyPhoto'),
                                message: localStorage.getItem('boyMessage'),
                                traits: localStorage.getItem('boyTraits')
                            },
                            girl: {
                                photo: localStorage.getItem('girlPhoto'),
                                message: localStorage.getItem('girlMessage'),
                                traits: localStorage.getItem('girlTraits')
                            }
                        }
                    };
                    
                    // 同步到GitHub
                    window.githubIntegration.updateDataToGitHub(data)
                        .then(() => {
                            console.log('数据已同步到GitHub');
                            document.getElementById('dataSourceInfo').textContent = 
                                `数据已同步到GitHub (${new Date().toLocaleTimeString()})`;
                        })
                        .catch(error => {
                            console.error('同步到GitHub失败:', error);
                            document.getElementById('dataSourceInfo').textContent = 
                                `同步到GitHub失败: ${error.message || error}`;
                        });
                }
            }, 500);
        };
    }
});
