# <div align="center"><img src="build/icon.png" width="128" height="128" alt="Todio Logo"></div>

<div align="center">

# Todio

**一款轻量、顺滑的桌面待办小组件。**

[Windows 下载](https://github.com/cnn-cnn-creatoe/todio/releases/latest) · [Linux 下载](https://github.com/cnn-cnn-creatoe/todio/releases/latest) · [macOS 下载](https://github.com/cnn-cnn-creatoe/todio/releases/latest)

</div>

---

## 简介

Todio 是一款桌面待办小组件，主打玻璃拟态风格与顺滑交互动画。它常驻桌面、占用轻量，适合快速记录与管理任务。

## 功能

- 玻璃拟态 UI，视觉轻盈
- 顺滑动画与自适应高度
- 拖拽排序
- 轻量常驻，不打扰
- 支持 Windows / Linux / macOS 桌面端

## 安装与使用

前往 [Releases](https://github.com/cnn-cnn-creatoe/todio/releases) 下载对应平台安装包：

- Windows：`.exe`（NSIS 安装器）
- Linux：`.AppImage` 或 `.deb`
- macOS：`.dmg` 或 `.zip`

## 开发

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
