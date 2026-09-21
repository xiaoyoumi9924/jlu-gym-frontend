# 吉林大学体育馆前端页面

一个使用 Vue 3、Vue Router 和 Vite 开发的移动端体育馆页面项目，用于课程学习、前端界面练习和交互演示。

## 🌐 在线访问

[https://gym.meiyh9924.xyz/](https://gym.meiyh9924.xyz/)

项目使用 Hash 路由，建议使用手机浏览器访问，或在桌面浏览器的开发者工具中切换到移动设备尺寸查看。

## 项目功能

- 宋治平体育馆、前卫体育馆的选择与首页展示
- 场馆轮播图、地址、简介、联系电话和运动项目列表
- 预约设置表单与可关闭的“保存成功”提示
- 个人中心、“我的预约”和预约详情页面
- 与参考页面比例一致的入场码弹窗
- 使用 `localStorage` 和 `sessionStorage` 保存本地演示状态

## 页面说明

进入场馆选择页后，点击顶部 Logo 可以打开隐藏的“预约设置”入口。

<p align="center">
  <img src="docs/images/venues-logo-entry.png" width="420" alt="点击顶部 Logo 打开预约设置">
</p>

<p align="center">
  <sub>点击顶部 Logo 打开预约设置</sub>
</p>

保存预约后，可从“我的”进入“我的预约”，查看预约卡片、预约详情和入场码弹窗。

## 本地运行

```bash
git clone https://github.com/xiaoyoumi9924/jlu-gym-frontend.git
cd jlu-gym-frontend
npm install
npm run dev
```

开发服务器启动后，打开终端中显示的本地地址，通常为 `http://localhost:5173/`。

## 测试与构建

```bash
npm test
npm run build
```

- `npm test`：运行 Node 测试与 Vitest 组件测试。
- `npm run build`：生成可部署的 `dist/` 目录。

## 使用说明

本项目不连接吉林大学体育馆预约后台，不提供真实登录、支付、预约或入场能力。页面中的预约信息和二维码均为本地演示数据，仅用于课程学习与界面展示。

## 说明文档

- [页面与操作说明](docs/页面说明.md)：页面功能、可点击区域、完整演示步骤和数据重置方法。
- [技术说明](docs/技术说明.md)：技术栈、目录结构、路由、数据模型、组件和测试说明。
