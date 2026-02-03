# <div align="center"><img src="build/icon.png" width="128" height="128" alt="Todio Logo"></div>

<div align="center">

# Todio

**一款轻量、顺滑的桌面待办小组件。**

[Windows 下载](https://github.com/cnn-cnn-creatoe/todio/releases/latest) ·
[Linux 下载](https://github.com/cnn-cnn-creatoe/todio/releases/latest) ·
[macOS 下载](https://github.com/cnn-cnn-creatoe/todio/releases/latest)

</div>

---

## 简介

Todio 是一款桌面待办小组件，主打玻璃拟态风格与顺滑交互动画。它常驻桌面、占用轻量，适合快速记录与管理任务。

## 功能一览

- **任务管理**：快速添加、完成、删除、重命名任务
- **截止时间与提醒**：设置到期时间，到期自动提醒
- **优先级**：低/中/高优先级标记与排序
- **日历视图**：按日期查看与管理任务
- **排序筛选**：按时间/优先级/完成状态排序
- **置顶显示**：一键置顶，随时可见
- **透明度与尺寸**：可调透明度，拖拽边缘调整大小
- **自动启动**：开机自启
- **多语言**：中英文切换
- **更新与帮助**：设置中可检查更新，帮助入口直达仓库

## 使用指南

### 添加与完成

1. 在输入框输入任务内容并确认
2. 点击任务左侧完成按钮即可完成

### 截止时间与提醒

1. 创建或编辑任务时选择日期与时间
2. 到期后会弹出提醒通知

### 优先级

1. 选择低/中/高优先级
2. 可在排序中按优先级升序/降序

### 排序与筛选

- 时间排序：按截止时间排序
- 优先级排序：按高/中/低排序
- 完成状态：只看已完成或未完成

### 日历视图

- 切换到“日历”模式，按日期查看任务
- 点击日期可快速创建任务

### 置顶显示

- 点击置顶按钮让窗口保持在最前

### 设置

- 透明度：调整窗口透明度
- 自动启动：开机自启
- 语言：中文 / English
- 检查更新：从 GitHub Releases 获取最新版本
- 帮助：直达仓库页面

## 下载与安装

所有安装包请在 [Releases](https://github.com/cnn-cnn-creatoe/todio/releases) 获取。

### Windows

- 提供 **`.exe` 安装器（Setup）**
- 文件名示例：`Todio-1.1.0-Windows.exe`

### Linux

- **`.AppImage`**（通用）
- **`.deb`**（Ubuntu/Debian）
- 文件名示例：`Todio-1.1.0-Linux.AppImage`、`Todio-1.1.0-Linux.deb`

### macOS

- **`.dmg`**
- **`.zip`**
- 文件名示例：`Todio-1.1.0-macOS.dmg`、`Todio-1.1.0-macOS.zip`

## 开发与构建

### 安装依赖

```bash
npm install
```

### 启动开发环境

```bash
npm run electron:dev
```

### 打包

```bash
npm run electron:build
```

打包产物默认输出到 `dist-electron/`。

## 目录结构

- `src/` 前端界面与逻辑
- `electron/` 主进程代码
- `public/` 静态资源
- `build/` 安装器与图标资源

## 移动端构建（Android / iOS）

本项目使用 Capacitor 打包移动端壳层，已提供一键脚本：

```bash
npm run mobile:add
npm run mobile:sync
npm run mobile:android
npm run mobile:ios
```

说明：
- Android：生成 `android/` 工程并打开 Android Studio。
- iOS：仅支持在 macOS + Xcode 环境构建，生成 `ios/` 工程并打开 Xcode。
- 首次运行会自动下载 Capacitor CLI。

## 移动端下载 / 发布策略

### Android
- 适合直接下载：在 Android Studio 中生成 **APK**（Release 签名），把 `android/app/build/outputs/apk/release/app-release.apk` 上传到 GitHub Releases。
- 适合应用商店：生成 **AAB**（Release 签名），把 `android/app/build/outputs/bundle/release/app-release.aab` 上传到 Google Play Console。

### iOS
- 标准发布：在 Xcode 中 `Product > Archive` 后通过 **TestFlight / App Store** 分发。
- 直接下载限制：iOS 不支持像 APK 那样的自由安装，除非使用 **企业签名/Ad Hoc**，否则需要通过 TestFlight 或 App Store。
