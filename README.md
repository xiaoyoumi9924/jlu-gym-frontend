# 吉林大学体育馆前端页面

**当你去体育馆发现没有空余的场地，而这个时候你也没有提前预约，此时不要沮丧，其实大多数同学也没有预约就来打球了，这个时候你可以来使用一个假的预约信息来骗一下同学，就跟他们说这个场地是你预约的，其实很多时间都能成功，但是也要注意他的风险，而这个项目就为你提供了一个假的页面，如果感觉有用的话就点一个✨🌟吧**


## 🌐 在线访问

[https://gym.meiyh9924.xyz/](https://gym.meiyh9924.xyz/)


## 页面说明

进入场馆选择页后，点击顶部 Logo 可以打开隐藏的“预约设置”入口。设置完成之后就能进入页面查看预约的结果了。

<p align="center">
  <img src="docs/images/venues-logo-entry.png" width="420" alt="点击顶部 Logo 打开预约设置">
</p>

<p align="center">
  <sub>点击顶部 Logo 打开预约设置</sub>
</p>

保存预约后，可从“我的”进入“我的预约”，查看所有预约卡片。预约信息存储在本地浏览器中不会消失。

## 一条命令运行

打开终端，复制下面这一条命令回车即可。脚本会自动检查环境、下载项目、安装依赖、启动开发服务器并打开浏览器：

**macOS / Linux**

```bash
curl -fsSL https://raw.githubusercontent.com/xiaoyoumi9924/jlu-gym-frontend/main/scripts/quick-start.sh | bash
```

**Windows（PowerShell）**

```powershell
irm https://raw.githubusercontent.com/xiaoyoumi9924/jlu-gym-frontend/main/scripts/quick-start.ps1 | iex
```

脚本只在第一次运行时下载项目到当前目录下的 `jlu-gym-frontend/` 并安装依赖（约 1–3 分钟）。以后再次运行会跳过这些步骤，几秒内打开页面。默认地址是 `http://localhost:5173/`，按 `Ctrl+C` 停止。

> 如果 `raw.githubusercontent.com` 访问不了，可以把地址换成 jsDelivr 镜像：
> `https://cdn.jsdelivr.net/gh/xiaoyoumi9924/jlu-gym-frontend@main/scripts/quick-start.sh`

### 不想用脚本？

```bash
git clone --depth 1 https://github.com/xiaoyoumi9924/jlu-gym-frontend.git && cd jlu-gym-frontend && npm install && npm start
```

运行环境要求：Node.js 20.19+（或 22.12+）、Git。只想看效果的话，可以直接访问已部署的 [gym.meiyh9924.xyz](https://gym.meiyh9924.xyz/)。

## 说明文档

- [页面与操作说明](docs/页面说明.md)：页面功能、可点击区域、完整演示步骤和数据重置方法。
- [技术说明](docs/技术说明.md)：技术栈、目录结构、路由、数据模型、组件和测试说明。
