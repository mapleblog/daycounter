/**
 * 管理页面GitHub集成功能
 * 用于在管理页面上配置和管理GitHub同步
 */

document.addEventListener('DOMContentLoaded', function() {
    // 检查是否在管理页面
    const adminContainer = document.getElementById('adminContainer');
    if (!adminContainer) return;
    
    // 获取DOM元素
    const adminRepoOwner = document.getElementById('adminRepoOwner');
    const adminRepoName = document.getElementById('adminRepoName');
    const adminDataPath = document.getElementById('adminDataPath');
    const adminGithubToken = document.getElementById('adminGithubToken');
    const saveGithubSettings = document.getElementById('saveGithubSettings');
    const testGithubConnection = document.getElementById('testGithubConnection');
    const syncToGithub = document.getElementById('syncToGithub');
    const githubSuccess = document.getElementById('githubSuccess');
    const githubError = document.getElementById('githubError');
    const githubStatus = document.getElementById('githubStatus');
    const githubStatusIndicator = document.getElementById('githubStatusIndicator');
    
    // 隐藏提示信息
    githubSuccess.style.display = 'none';
    githubError.style.display = 'none';
    
    // 加载已保存的GitHub配置
    loadGithubConfig();
    
    // 保存GitHub设置
    saveGithubSettings.addEventListener('click', function() {
        saveGithubConfig();
    });
    
    // 测试GitHub连接
    testGithubConnection.addEventListener('click', function() {
        testConnection();
    });
    
    // 同步数据到GitHub
    syncToGithub.addEventListener('click', function() {
        syncData();
    });
    
    /**
     * 加载已保存的GitHub配置
     */
    function loadGithubConfig() {
        const configStr = localStorage.getItem('githubConfig');
        if (configStr) {
            try {
                const config = JSON.parse(configStr);
                adminRepoOwner.value = config.owner || '';
                adminRepoName.value = config.repo || '';
                adminDataPath.value = config.path || 'data/couple-data.json';
                adminGithubToken.value = config.token || '';
                
                // 更新连接状态
                updateConnectionStatus('waiting');
                
                // 如果有完整配置，自动测试连接
                if (config.owner && config.repo && config.path) {
                    testConnection();
                }
            } catch (e) {
                console.error('加载GitHub配置失败:', e);
            }
        } else {
            updateConnectionStatus('disconnected');
        }
    }
    
    /**
     * 保存GitHub配置
     */
    function saveGithubConfig() {
        const owner = adminRepoOwner.value.trim();
        const repo = adminRepoName.value.trim();
        const path = adminDataPath.value.trim();
        const token = adminGithubToken.value.trim();
        
        if (!owner || !repo || !path) {
            showError('请填写所有必填字段');
            return;
        }
        
        // 保存配置到localStorage
        const config = { owner, repo, path, token };
        localStorage.setItem('githubConfig', JSON.stringify(config));
        
        // 测试连接
        testConnection()
            .then(() => {
                showSuccess('GitHub配置保存成功！');
            })
            .catch(error => {
                // 即使连接测试失败，也已经保存了配置
                showSuccess('GitHub配置已保存，但连接测试失败');
            });
    }
    
    /**
     * 测试GitHub连接
     */
    function testConnection() {
        const owner = adminRepoOwner.value.trim();
        const repo = adminRepoName.value.trim();
        const path = adminDataPath.value.trim();
        const token = adminGithubToken.value.trim();
        
        if (!owner || !repo || !path) {
            updateConnectionStatus('disconnected');
            return Promise.reject('缺少必要的配置信息');
        }
        
        updateConnectionStatus('testing');
        
        // 构建API URL
        const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
        const headers = {};
        if (token) {
            headers.Authorization = `token ${token}`;
        }
        
        // 发起请求
        return axios.get(apiUrl, { headers })
            .then(response => {
                updateConnectionStatus('connected');
                return response;
            })
            .catch(error => {
                console.error('测试GitHub连接失败:', error);
                
                // 检查是否是404错误（文件不存在）
                if (error.response && error.response.status === 404) {
                    // 如果是404，可能是文件不存在，但仓库配置正确
                    updateConnectionStatus('file_not_found');
                    return Promise.resolve({ status: 'file_not_found' });
                } else {
                    updateConnectionStatus('error');
                    return Promise.reject(error);
                }
            });
    }
    
    /**
     * 同步数据到GitHub
     */
    function syncData() {
        const owner = adminRepoOwner.value.trim();
        const repo = adminRepoName.value.trim();
        const path = adminDataPath.value.trim();
        const token = adminGithubToken.value.trim();
        
        if (!owner || !repo || !path || !token) {
            showError('缺少必要的配置信息或GitHub Token');
            return;
        }
        
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
        
        // 检查文件是否存在
        const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
        const headers = {
            Authorization: `token ${token}`
        };
        
        // 显示同步中状态
        updateConnectionStatus('syncing');
        
        // 首先检查文件是否存在
        axios.get(apiUrl, { headers })
            .then(response => {
                // 文件存在，执行更新
                const sha = response.data.sha;
                updateFile(apiUrl, headers, data, sha);
            })
            .catch(error => {
                if (error.response && error.response.status === 404) {
                    // 文件不存在，创建新文件
                    createFile(apiUrl, headers, data);
                } else {
                    console.error('同步失败:', error);
                    showError(`同步失败: ${error.message || '未知错误'}`);
                    updateConnectionStatus('error');
                }
            });
    }
    
    /**
     * 更新已存在的文件
     */
    function updateFile(apiUrl, headers, data, sha) {
        // 准备更新的内容
        const content = btoa(JSON.stringify(data, null, 2)); // Base64编码
        
        // 发起更新请求
        axios.put(apiUrl, {
            message: '更新情侣计数器数据',
            content: content,
            sha: sha
        }, { headers })
        .then(() => {
            showSuccess('数据已成功同步到GitHub！');
            updateConnectionStatus('connected');
            // 更新最新的sha
            localStorage.setItem('lastContentSha', sha);
        })
        .catch(error => {
            console.error('更新文件失败:', error);
            showError(`更新文件失败: ${error.message || '未知错误'}`);
            updateConnectionStatus('error');
        });
    }
    
    /**
     * 创建新文件
     */
    function createFile(apiUrl, headers, data) {
        // 准备文件内容
        const content = btoa(JSON.stringify(data, null, 2)); // Base64编码
        
        // 发起创建请求
        axios.put(apiUrl, {
            message: '创建情侣计数器数据文件',
            content: content
        }, { headers })
        .then(response => {
            showSuccess('数据文件已成功创建并同步到GitHub！');
            updateConnectionStatus('connected');
            // 保存新文件的sha
            if (response.data && response.data.content && response.data.content.sha) {
                localStorage.setItem('lastContentSha', response.data.content.sha);
            }
        })
        .catch(error => {
            console.error('创建文件失败:', error);
            showError(`创建文件失败: ${error.message || '未知错误'}`);
            updateConnectionStatus('error');
        });
    }
    
    /**
     * 更新连接状态显示
     */
    function updateConnectionStatus(status) {
        // 移除所有状态类
        githubStatusIndicator.className = 'status-indicator';
        
        switch(status) {
            case 'disconnected':
                githubStatusIndicator.classList.add('status-disconnected');
                githubStatus.textContent = '未连接';
                break;
            case 'waiting':
                githubStatusIndicator.classList.add('status-waiting');
                githubStatus.textContent = '等待连接';
                break;
            case 'testing':
                githubStatusIndicator.classList.add('status-testing');
                githubStatus.textContent = '正在测试连接...';
                break;
            case 'connected':
                githubStatusIndicator.classList.add('status-connected');
                githubStatus.textContent = '已连接';
                break;
            case 'file_not_found':
                githubStatusIndicator.classList.add('status-warning');
                githubStatus.textContent = '仓库已连接，文件不存在';
                break;
            case 'syncing':
                githubStatusIndicator.classList.add('status-syncing');
                githubStatus.textContent = '正在同步数据...';
                break;
            case 'error':
                githubStatusIndicator.classList.add('status-error');
                githubStatus.textContent = '连接错误';
                break;
            default:
                githubStatusIndicator.classList.add('status-disconnected');
                githubStatus.textContent = '未知状态';
        }
    }
    
    /**
     * 显示成功消息
     */
    function showSuccess(message) {
        githubSuccess.textContent = message;
        githubSuccess.style.display = 'block';
        githubError.style.display = 'none';
        
        // 3秒后隐藏
        setTimeout(function() {
            githubSuccess.style.display = 'none';
        }, 3000);
    }
    
    /**
     * 显示错误消息
     */
    function showError(message) {
        githubError.textContent = message;
        githubError.style.display = 'block';
        githubSuccess.style.display = 'none';
        
        // 5秒后隐藏
        setTimeout(function() {
            githubError.style.display = 'none';
        }, 5000);
    }
    
    // 修改原有的保存日期按钮事件
    const saveDateButton = document.getElementById('saveDate');
    if (saveDateButton) {
        // 保存原始的点击事件处理程序
        const originalClickHandler = saveDateButton.onclick;
        
        // 设置新的点击事件处理程序
        saveDateButton.onclick = function(event) {
            // 调用原始的处理程序
            if (originalClickHandler) {
                originalClickHandler.call(this, event);
            } else {
                // 如果没有原始处理程序，则执行默认操作
                const dateInput = document.getElementById('anniversaryDate');
                if (dateInput && dateInput.value) {
                    localStorage.setItem('anniversaryDate', dateInput.value);
                    document.getElementById('dateSuccess').style.display = 'block';
                    setTimeout(function() {
                        document.getElementById('dateSuccess').style.display = 'none';
                    }, 3000);
                }
            }
            
            // 添加GitHub同步功能
            setTimeout(function() {
                // 检查是否已配置GitHub
                const config = getGitHubConfig();
                if (config.owner && config.repo && config.path && config.token) {
                    // 自动同步到GitHub
                    syncData();
                }
            }, 500);
        };
    }
    
    /**
     * 获取GitHub配置
     */
    function getGitHubConfig() {
        const configStr = localStorage.getItem('githubConfig');
        return configStr ? JSON.parse(configStr) : {};
    }
});

// 修改admin.js中的其他保存按钮，添加GitHub同步功能
document.addEventListener('DOMContentLoaded', function() {
    // 等待DOM加载完成后再执行
    setTimeout(function() {
        // 需要添加GitHub同步功能的按钮列表
        const syncButtons = [
            'saveBoyInfo',
            'saveGirlInfo',
            'saveBoyPhoto',
            'saveGirlPhoto',
            'resetData'
        ];
        
        // 为每个按钮添加GitHub同步功能
        syncButtons.forEach(function(buttonId) {
            const button = document.getElementById(buttonId);
            if (button) {
                // 保存原始的点击事件处理程序
                const originalClickHandler = button.onclick;
                
                // 设置新的点击事件处理程序
                button.onclick = function(event) {
                    // 调用原始的处理程序
                    if (originalClickHandler) {
                        originalClickHandler.call(this, event);
                    }
                    
                    // 添加GitHub同步功能
                    setTimeout(function() {
                        // 检查是否已配置GitHub
                        const configStr = localStorage.getItem('githubConfig');
                        if (configStr) {
                            const config = JSON.parse(configStr);
                            if (config.owner && config.repo && config.path && config.token) {
                                // 如果存在syncData函数，则调用它
                                if (typeof window.syncData === 'function') {
                                    window.syncData();
                                } else {
                                    // 尝试触发同步按钮的点击事件
                                    const syncButton = document.getElementById('syncToGithub');
                                    if (syncButton) {
                                        syncButton.click();
                                    }
                                }
                            }
                        }
                    }, 500);
                };
            }
        });
    }, 1000); // 等待1秒确保所有元素已加载
});

// 将syncData函数暴露给全局使用
window.syncData = function() {
    // 触发同步按钮的点击事件
    const syncButton = document.getElementById('syncToGithub');
    if (syncButton) {
        syncButton.click();
    }
};
