# Couple Days Counter

## 项目介绍

这是一个简单的情侣在一起天数计数器网页应用。它可以记录和显示两个人在一起的天数，并支持自定义头像。

## 功能特点

- 显示两个人在一起的天数
- 支持自定义头像
- 响应式设计，适配不同设备
- 美观的动画效果

## 文件结构

```
/
├── index.html          # 主页面
├── admin.html          # 管理页面（如果有）
├── css/
│   └── styles.css      # 样式文件
├── js/
│   └── script.js       # JavaScript 脚本
└── images/
    ├── boy-default.jpg # 默认男生头像
    └── girl-default.jpg # 默认女生头像
```

## 使用方法

1. 直接访问 `index.html` 查看计数器
2. 点击页面右下角的设置图标进入管理页面
3. 在管理页面可以设置纪念日和上传自定义头像

## 注意事项

- 头像图片会从 GitHub 根目录的 images 文件夹读取
- 所有数据使用浏览器的 localStorage 存储，清除浏览器数据会导致数据丢失
