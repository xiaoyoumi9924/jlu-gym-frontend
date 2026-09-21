# 吉林大学体育馆前端仿制 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建一个从原站开发者工具源码和图片资源提取而来的 Vue 3 移动端仿制页面，覆盖场馆选择、两个场馆首页、两个预约项目列表和个人中心。

**Architecture:** 使用 Vue 3、Vue Router 和 Vite 构建纯前端单页应用。原站源码与资源由可重复执行的 Node 脚本保存到本地，应用只读取 `src/assets/original/` 和 `src/data/venues.js`，不访问原站 API。

**Tech Stack:** Vue 3.5、Vue Router 4、Vite 7、Vitest 3、Vue Test Utils 2、原生 CSS

**Spec:** `docs/superpowers/specs/2026-09-20-jlu-gym-frontend-design.md`

## Global Constraints

- 页面只实现前端展示和页面级导航，不连接原站后端。
- 个人中心固定显示姓名“李子涵”、学号“87240433”。
- 设计基准宽度为 390px，桌面端最大宽度为 430px。
- 主色使用原站浅蓝色 `#7ecef4`，个人中心顶部使用蓝绿渐变。
- 原站 HTML、CSS 和相关页面脚本保存到 `reference-source/`，运行时不加载这些文件。
- 所有运行时图片保存到 `src/assets/original/`，页面运行过程中不得请求 `ss.jlu.edu.cn`。
- 不实现登录、实名认证、支付、购票、真实预约或预约时间段选择。

## Review Focus

- 未知 `venueId` 必须安全回退到宋治平体育馆，并保持页面可用；Task 2 的数据测试覆盖。
- 从“我的”返回首页或预约页时必须保留最近选择的场馆；Task 3 的路由状态测试覆盖。
- 原站资源提取不完整时脚本必须以非零状态结束并指出缺失文件；Task 1 的提取测试覆盖。
- 390px 视口中卡片、预约按钮和底部导航不得横向溢出；Task 7 的浏览器尺寸检查覆盖。
- 生产构建不得包含原站 API 根地址或用户令牌；Task 7 的构建产物扫描覆盖。

---

## File Structure

```text
.
├── index.html                         # Vite 入口
├── package.json                       # 依赖与脚本
├── vite.config.js                     # Vite 与 Vitest 配置
├── scripts/
│   └── extract-original-assets.mjs    # 下载原站源码和图片、提取内嵌图标
├── reference-source/
│   ├── README.md                      # 提取来源说明
│   ├── SOURCE_MAP.md                  # 原路由到重写组件的映射
│   ├── index.html
│   ├── css/app.css
│   └── js/*.js                        # 相关原始 Webpack 包
├── src/
│   ├── main.js                        # 创建 Vue 应用
│   ├── App.vue                        # 根组件与提示层
│   ├── router/index.js                # 路由与场馆状态
│   ├── data/venues.js                 # 静态场馆与个人资料数据
│   ├── styles/tokens.css              # 色彩、尺寸和间距变量
│   ├── styles/base.css                # 全局重置与移动端画布
│   ├── assets/original/*              # 从原站提取的本地素材
│   ├── components/MobileShell.vue
│   ├── components/BottomNav.vue
│   ├── components/VenueCard.vue
│   ├── components/SportCard.vue
│   └── views/
│       ├── VenuePickerView.vue
│       ├── VenueHomeView.vue
│       ├── ReservationView.vue
│       └── ProfileView.vue
├── tests/
│   ├── extraction.test.mjs
│   ├── venues.test.js
│   ├── router.test.js
│   ├── home.test.js
│   ├── reservation.test.js
│   └── profile.test.js
└── README.md                           # 启动、构建和页面说明
```

### Task 1: 提取并保存原站源码与视觉资源

**Files:**
- Create: `scripts/extract-original-assets.mjs`
- Create: `tests/extraction.test.mjs`
- Create: `reference-source/README.md`
- Create: `reference-source/SOURCE_MAP.md`
- Create through script: `reference-source/index.html`
- Create through script: `reference-source/css/app.css`
- Create through script: `reference-source/js/app.js`
- Create through script: `reference-source/js/chunk-{0,1,2,19,106,132}.js`
- Create through script: `src/assets/original/*`

**Interfaces:**
- Consumes: Public source and image URLs observed in Chrome DevTools.
- Produces: `SOURCE_FILES`, `REMOTE_ASSETS`, `extractDataUrlModule(source, moduleId)` and a complete local asset directory used by later tasks.

- [ ] **Step 1: Write the failing extraction-manifest test**

```js
// tests/extraction.test.mjs
import test from 'node:test'
import assert from 'node:assert/strict'
import {
  SOURCE_FILES,
  REMOTE_ASSETS,
  extractDataUrlModule,
} from '../scripts/extract-original-assets.mjs'

test('source manifest contains every inspected page bundle', () => {
  assert.deepEqual(
    SOURCE_FILES.map((entry) => entry.output),
    [
      'index.html',
      'css/app.css',
      'js/app.js',
      'js/chunk-0.js',
      'js/chunk-1.js',
      'js/chunk-2.js',
      'js/chunk-19.js',
      'js/chunk-106.js',
      'js/chunk-132.js',
    ],
  )
})

test('runtime asset manifest contains both venues, original navigation, and all six source sport images', () => {
  const names = new Set(REMOTE_ASSETS.map((entry) => entry.output))
  for (const expected of [
    'logo.png',
    'venue-song.png',
    'venue-qianwei.jpg',
    'nav-home.png',
    'nav-reserve.png',
    'nav-profile.png',
    'sport-badminton.png',
    'sport-song-table-tennis.jpg',
    'sport-qianwei-table-tennis.png',
    'sport-pickleball.png',
    'sport-tennis.jpg',
    'sport-volleyball.jpg',
  ]) assert.equal(names.has(expected), true, expected)
})

test('embedded module extraction rejects a missing module', () => {
  assert.throws(
    () => extractDataUrlModule('webpackJsonp([])', 'ZR4u'),
    /Missing embedded asset module ZR4u/,
  )
})
```

- [ ] **Step 2: Run the test and verify it fails**

Run: `node --test tests/extraction.test.mjs`

Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `scripts/extract-original-assets.mjs`.

- [ ] **Step 3: Implement the extraction script with exact DevTools URLs**

```js
// scripts/extract-original-assets.mjs
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const appBase = 'https://ss.jlu.edu.cn/easyserpApp'
const imageBase = 'https://ss.jlu.edu.cn/images'

export const SOURCE_FILES = [
  { url: `${appBase}/index.html`, output: 'index.html' },
  { url: `${appBase}/static/css/app.4deb94ec288561ccf7075eee576c81b5.css?05be9cdb03f595a60977`, output: 'css/app.css' },
  { url: `${appBase}/static/js/app.b4a437e95b454a3996d31713170880417.js?05be9cdb03f595a60977`, output: 'js/app.js' },
  { url: `${appBase}/static/js/0.be4407ff7223c03576db1713170880417.js`, output: 'js/chunk-0.js' },
  { url: `${appBase}/static/js/1.5e5a3dea6c35bad216d81713170880417.js`, output: 'js/chunk-1.js' },
  { url: `${appBase}/static/js/2.506ec28bf7f665e601f31713170880417.js`, output: 'js/chunk-2.js' },
  { url: `${appBase}/static/js/19.42b81b0e892d54e23fa61713170880417.js`, output: 'js/chunk-19.js' },
  { url: `${appBase}/static/js/106.07b9606bd65cfee20a9c1713170880417.js`, output: 'js/chunk-106.js' },
  { url: `${appBase}/static/js/132.c20f0240b3924ad303cc1713170880417.js`, output: 'js/chunk-132.js' },
]

export const REMOTE_ASSETS = [
  { url: `${imageBase}/yspcs0/nevue/20201126135626.png`, output: 'logo.png' },
  { url: `${imageBase}/yspcs0/shops/aaaaaa.png`, output: 'venue-song.png' },
  { url: `${imageBase}/yspcs0/shops/973b6c55773d6b92b04f2abeb38cefe.jpg`, output: 'venue-qianwei.jpg' },
  { url: `${imageBase}/yspcs0/banner/tj3.JPG`, output: 'song-banner-1.jpg' },
  { url: `${imageBase}/yspcs0/banner/bsg2.JPG`, output: 'song-banner-2.jpg' },
  { url: `${imageBase}/yspcs0/banner/wg2.JPG`, output: 'song-banner-3.jpg' },
  { url: `${imageBase}/yspcs0/banner/xlg4.JPG`, output: 'song-banner-4.jpg' },
  { url: `${imageBase}/yspcs0/banner/jsg5.JPG`, output: 'song-banner-5.jpg' },
  { url: `${imageBase}/yspcs0/banner/973b6c55773d6b92b04f2abeb38cefe.jpg`, output: 'qianwei-banner-1.jpg' },
  { url: `${imageBase}/yspcs0/banner/1712804775324.png`, output: 'qianwei-banner-2.png' },
  { url: `${imageBase}/yspcs0/place/1703811883142.png`, output: 'sport-badminton.png' },
  { url: `${imageBase}/yspcs0/place/ppqcdeee.jpg`, output: 'sport-song-table-tennis.jpg' },
  { url: `${imageBase}/yspcs0/place/aac961cb24c2983e210dead4471ae82.png`, output: 'sport-qianwei-table-tennis.png' },
  { url: `${imageBase}/yspcs0/place/pkq.png`, output: 'sport-pickleball.png' },
  { url: `${imageBase}/yspcs0/place/tinnes.jpg`, output: 'sport-tennis.jpg' },
  { url: `${imageBase}/yspcs0/place/00.jpg`, output: 'sport-volleyball.jpg' },
  { url: `${appBase}/static/images/icon/home.png`, output: 'nav-home.png' },
  { url: `${appBase}/static/images/icon/Order.png`, output: 'nav-reserve.png' },
  { url: `${appBase}/static/images/icon/my.png`, output: 'nav-profile.png' },
  { url: `${appBase}/static/img/icon.eb73550.png`, output: 'venue-booking.png' },
  { url: `${appBase}/static/img/header.689e6a1.png`, output: 'profile-avatar.png' },
]

export function extractDataUrlModule(source, moduleId) {
  const escaped = moduleId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const modulePattern = new RegExp(`(?:"${escaped}"|${escaped}):function\\([^)]*\\)\\{`)
  const match = modulePattern.exec(source)
  if (!match) throw new Error(`Missing embedded asset module ${moduleId}`)
  const tail = source.slice(match.index, match.index + 500000)
  const data = tail.match(/exports="data:image\/(png|jpeg);base64,([A-Za-z0-9+/=]+)"/)
  if (!data) throw new Error(`Invalid embedded asset module ${moduleId}`)
  return { extension: data[1] === 'jpeg' ? 'jpg' : data[1], bytes: Buffer.from(data[2], 'base64') }
}

async function download(url, output) {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`${response.status} ${url}`)
  await mkdir(dirname(output), { recursive: true })
  await writeFile(output, Buffer.from(await response.arrayBuffer()))
}

export async function extractAll() {
  for (const entry of SOURCE_FILES) {
    await download(entry.url, resolve(root, 'reference-source', entry.output))
  }
  for (const entry of REMOTE_ASSETS) {
    await download(entry.url, resolve(root, 'src/assets/original', entry.output))
  }
  const app = await readFile(resolve(root, 'reference-source/js/app.js'), 'utf8')
  const profile = await readFile(resolve(root, 'reference-source/js/chunk-2.js'), 'utf8')
  for (const [source, id, name] of [
    [app, 'juWb', 'online-ticket'],
    [app, 'pAnE', 'coming-soon'],
    [app, 'i2LG', 'venue-arrangement'],
    [profile, 'KYQH', 'male'],
    [profile, 'iezu', 'my-booking'],
    [profile, 'oonp', 'my-invite'],
    [profile, '+xnW', 'ticket-record'],
  ]) {
    const asset = extractDataUrlModule(source, id)
    await writeFile(resolve(root, `src/assets/original/${name}.${asset.extension}`), asset.bytes)
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  extractAll().catch((error) => {
    console.error(error.message)
    process.exitCode = 1
  })
}
```

- [ ] **Step 4: Run the extraction tests and script**

Run: `node --test tests/extraction.test.mjs && node scripts/extract-original-assets.mjs`

Expected: three tests PASS; all listed downloads complete; any missing file produces a non-zero exit.

- [ ] **Step 5: Document route/source mapping**

```markdown
<!-- reference-source/SOURCE_MAP.md -->
# Original source mapping

| Original route | Original bundle | Rewritten view |
| --- | --- | --- |
| `/branch` | `js/chunk-1.js` | `src/views/VenuePickerView.vue` |
| `/index` | `js/app.js`, `js/chunk-106.js` | `src/views/VenueHomeView.vue` |
| `/orders/orderSite` | `js/chunk-19.js`, `js/chunk-132.js` | `src/views/ReservationView.vue` |
| `/myCentre` | `js/chunk-0.js`, `js/chunk-2.js` | `src/views/ProfileView.vue` |

The files in this directory were downloaded from the public page through
URLs shown by Chrome DevTools. They are retained for coursework comparison;
the Vite application does not execute them.
```

- [ ] **Step 6: Commit the extracted reference**

```bash
git add scripts tests/extraction.test.mjs reference-source src/assets/original
git commit -m "chore: preserve original JLU frontend references"
```

### Task 2: Scaffold Vue and define the static venue model

**Files:**
- Create: `package.json`
- Create: `index.html`
- Create: `vite.config.js`
- Create: `src/main.js`
- Create: `src/App.vue`
- Create: `src/data/venues.js`
- Create: `src/styles/tokens.css`
- Create: `src/styles/base.css`
- Create: `tests/venues.test.js`

**Interfaces:**
- Consumes: Image filenames produced by Task 1.
- Produces: `venues`, `profile`, `getVenue(venueId)` and the Vue application entry used by all later tasks.

- [ ] **Step 1: Write failing venue-model tests**

```js
// tests/venues.test.js
import { describe, expect, it } from 'vitest'
import { getVenue, profile, venues } from '../src/data/venues'

describe('venue data', () => {
  it('maps each venue to the screenshot sports', () => {
    expect(venues.song.sports.map((sport) => sport.name)).toEqual(['乒乓球', '网球', '排球'])
    expect(venues.qianwei.sports.map((sport) => sport.name)).toEqual(['羽毛球', '乒乓球', '匹克球'])
  })

  it('falls back for an unknown venue id', () => {
    expect(getVenue('missing')).toBe(venues.song)
  })

  it('uses the requested coursework identity', () => {
    expect(profile).toMatchObject({ name: '李子涵', studentId: '87240433', sex: '男' })
  })
})
```

- [ ] **Step 2: Create the Vue package and run the test to verify failure**

```json
{
  "name": "jlu-gym-frontend",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "test": "vitest run"
  },
  "dependencies": {
    "vue": "latest",
    "vue-router": "latest"
  },
  "devDependencies": {
    "@vue/test-utils": "latest",
    "@vitejs/plugin-vue": "latest",
    "jsdom": "latest",
    "vite": "latest",
    "vitest": "latest"
  }
}
```

Run: `npm install && npm test -- tests/venues.test.js`

Expected: FAIL because `src/data/venues.js` does not exist.

- [ ] **Step 3: Implement the static data model**

```js
// src/data/venues.js
const asset = (name) => new URL(`../assets/original/${name}`, import.meta.url).href

export const venues = {
  song: {
    id: 'song',
    name: '宋治平体育馆',
    address: '吉林省长春市吉林大学',
    phone: '0431-85167701',
    thumb: asset('venue-song.png'),
    banners: [
      asset('song-banner-1.jpg'),
      asset('song-banner-2.jpg'),
      asset('song-banner-3.jpg'),
      asset('song-banner-4.jpg'),
      asset('song-banner-5.jpg'),
    ],
    description: '吉林大学宋治平体育馆项目由中国工程院院士何镜堂教授主持设计。',
    sports: [
      { name: '乒乓球', time: '06:00', image: asset('sport-song-table-tennis.jpg') },
      { name: '网球', time: '06:00', image: asset('sport-tennis.jpg') },
      { name: '排球', time: '06:00', image: asset('sport-volleyball.jpg') },
    ],
  },
  qianwei: {
    id: 'qianwei',
    name: '前卫体育馆',
    address: '吉林省长春市吉林大学',
    phone: '0431-85167701',
    thumb: asset('venue-qianwei.jpg'),
    banners: [asset('qianwei-banner-1.jpg'), asset('qianwei-banner-2.png')],
    description: '吉林大学前卫南校区前卫体育馆位于前进大街2699号。',
    sports: [
      { name: '羽毛球', time: '06:00', image: asset('sport-badminton.png') },
      { name: '乒乓球', time: '06:00', image: asset('sport-qianwei-table-tennis.png') },
      { name: '匹克球', time: '06:00', image: asset('sport-pickleball.png') },
    ],
  },
}

export const profile = { name: '李子涵', studentId: '87240433', sex: '男' }
export const getVenue = (venueId) => venues[venueId] ?? venues.song
```

- [ ] **Step 4: Add the minimal Vue entry and Vitest configuration**

```js
// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: { environment: 'jsdom' },
})
```

```js
// src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import './styles/tokens.css'
import './styles/base.css'

createApp(App).mount('#app')
```

```vue
<!-- src/App.vue -->
<template><RouterView /></template>
```

Create `tokens.css` and `base.css` here with the base rules shown in Task 3, so this scaffold builds cleanly before routing is added.

- [ ] **Step 5: Run the data tests**

Run: `npm test -- tests/venues.test.js`

Expected: three tests PASS.

- [ ] **Step 6: Commit the scaffold and model**

```bash
git add package.json package-lock.json index.html vite.config.js src tests/venues.test.js
git commit -m "feat: scaffold Vue app and venue data"
```

### Task 3: Add router, mobile shell, bottom navigation, and persistent venue state

**Files:**
- Create: `src/router/index.js`
- Create: `src/components/MobileShell.vue`
- Create: `src/components/BottomNav.vue`
- Modify: `src/styles/tokens.css`
- Modify: `src/styles/base.css`
- Modify: `src/main.js`
- Modify: `src/App.vue`
- Test: `tests/router.test.js`

**Interfaces:**
- Consumes: `getVenue(venueId)` from Task 2.
- Produces: `router`, `setActiveVenue(id)`, `getActiveVenueId()` and `<BottomNav :venue-id active>`.

- [ ] **Step 1: Write failing router and navigation tests**

```js
// tests/router.test.js
import { beforeEach, describe, expect, it } from 'vitest'
import { getActiveVenueId, setActiveVenue } from '../src/router'

describe('active venue state', () => {
  beforeEach(() => localStorage.clear())

  it('defaults to song', () => expect(getActiveVenueId()).toBe('song'))

  it('persists the selected venue while visiting profile', () => {
    setActiveVenue('qianwei')
    expect(getActiveVenueId()).toBe('qianwei')
  })

  it('rejects an unknown venue', () => {
    setActiveVenue('missing')
    expect(getActiveVenueId()).toBe('song')
  })
})
```

- [ ] **Step 2: Run the router test and verify failure**

Run: `npm test -- tests/router.test.js`

Expected: FAIL because `src/router/index.js` does not exist.

- [ ] **Step 3: Implement routes and persistent venue state**

```js
// src/router/index.js
import { createRouter, createWebHashHistory } from 'vue-router'
import { venues } from '../data/venues'

const VenuePickerView = () => import('../views/VenuePickerView.vue')
const VenueHomeView = () => import('../views/VenueHomeView.vue')
const ReservationView = () => import('../views/ReservationView.vue')
const ProfileView = () => import('../views/ProfileView.vue')

const key = 'jlu-gym-active-venue'
export const getActiveVenueId = () => venues[localStorage.getItem(key)] ? localStorage.getItem(key) : 'song'
export const setActiveVenue = (id) => localStorage.setItem(key, venues[id] ? id : 'song')

export const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', redirect: '/venues' },
    { path: '/venues', component: VenuePickerView },
    { path: '/home/:venueId', component: VenueHomeView, props: true },
    { path: '/reserve/:venueId', component: ReservationView, props: true },
    { path: '/profile', component: ProfileView },
    { path: '/:pathMatch(.*)*', redirect: '/venues' },
  ],
})
```

- [ ] **Step 4: Implement shared layout and fixed navigation**

```vue
<!-- src/components/BottomNav.vue -->
<script setup>
import { computed } from 'vue'
import { getActiveVenueId } from '../router'
import homeIcon from '../assets/original/nav-home.png'
import reserveIcon from '../assets/original/nav-reserve.png'
import profileIcon from '../assets/original/nav-profile.png'

const props = defineProps({ active: String, venueId: String })
const current = computed(() => props.venueId || getActiveVenueId())
const items = computed(() => [
  { id: 'home', label: '首页', to: `/home/${current.value}`, icon: homeIcon },
  { id: 'reserve', label: '预约', to: `/reserve/${current.value}`, icon: reserveIcon },
  { id: 'profile', label: '我的', to: '/profile', icon: profileIcon },
])
</script>

<template>
  <nav class="bottom-nav">
    <RouterLink v-for="item in items" :key="item.id" :to="item.to" :class="{ active: active === item.id }">
      <span class="nav-icon" :style="{ backgroundImage: `url(${item.icon})` }" aria-hidden="true"></span>
      <span>{{ item.label }}</span>
    </RouterLink>
  </nav>
</template>
```

```css
/* src/styles/tokens.css */
:root {
  --brand: #7ecef4;
  --brand-deep: #69baff;
  --lime: #a7e64a;
  --page: #f6f6f6;
  --card: #fff;
  --text: #333;
  --muted: #999;
  --radius: 10px;
  --nav-height: 72px;
}
```

```css
/* src/styles/base.css */
* { box-sizing: border-box; }
html, body, #app { min-height: 100%; margin: 0; }
body { background: #eaf3fb; color: var(--text); font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif; }
button, a { font: inherit; }
a { color: inherit; text-decoration: none; }
.mobile-shell { width: min(100%, 430px); min-height: 100vh; margin: 0 auto; background: var(--page); position: relative; padding-bottom: var(--nav-height); overflow-x: hidden; }
.bottom-nav { position: fixed; left: 50%; bottom: 0; transform: translateX(-50%); width: min(100%, 430px); height: var(--nav-height); display: grid; grid-template-columns: repeat(3, 1fr); background: #fff; border-top: 1px solid #efefef; z-index: 20; }
.bottom-nav a { display: grid; justify-items: center; align-content: center; gap: 4px; color: #999; }
.bottom-nav a.active { color: #7ec1fc; }
.nav-icon { width: 28px; height: 28px; background: no-repeat center/contain; }
.bottom-nav a.active .nav-icon { filter: invert(66%) sepia(42%) saturate(1013%) hue-rotate(178deg) brightness(104%); }
```

- [ ] **Step 5: Implement the mobile shell, wire the router into the app, and run tests**

```vue
<!-- src/components/MobileShell.vue -->
<template><div class="mobile-shell"><slot /></div></template>
```

```vue
<!-- src/App.vue -->
<script setup>import MobileShell from './components/MobileShell.vue'</script>
<template><MobileShell><RouterView /></MobileShell></template>
```

```js
// src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'
import './styles/tokens.css'
import './styles/base.css'

createApp(App).use(router).mount('#app')
```

Run: `npm test -- tests/router.test.js`

Expected: three tests PASS.

- [ ] **Step 6: Commit the app shell**

```bash
git add src tests/router.test.js
git commit -m "feat: add mobile shell and navigation"
```

### Task 4: Implement venue selection and venue home pages

**Files:**
- Create: `src/components/VenueCard.vue`
- Create: `src/views/VenuePickerView.vue`
- Create: `src/views/VenueHomeView.vue`
- Test: `tests/home.test.js`

**Interfaces:**
- Consumes: `venues`, `getVenue`, `setActiveVenue`, `MobileShell`, `BottomNav` and local images.
- Produces: `/venues` and `/home/:venueId` views; selecting a card persists venue and navigates to its home.

- [ ] **Step 1: Write failing home view tests**

```js
// tests/home.test.js
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import VenueHomeView from '../src/views/VenueHomeView.vue'

describe('VenueHomeView', () => {
  it('renders the requested venue hierarchy', () => {
    const wrapper = mount(VenueHomeView, {
      props: { venueId: 'qianwei' },
      global: { stubs: ['RouterLink', 'BottomNav'] },
    })
    expect(wrapper.get('h1').text()).toBe('前卫体育馆')
    expect(wrapper.text()).toContain('查看其他校区')
    expect(wrapper.text()).toContain('场馆安排')
    expect(wrapper.text()).toContain('在线功能')
  })

  it('shows locally bundled images', () => {
    const wrapper = mount(VenueHomeView, {
      props: { venueId: 'song' },
      global: { stubs: ['RouterLink', 'BottomNav'] },
    })
    for (const image of wrapper.findAll('img')) expect(image.attributes('src')).not.toContain('ss.jlu.edu.cn')
  })
})
```

- [ ] **Step 2: Run the tests and verify failure**

Run: `npm test -- tests/home.test.js`

Expected: FAIL because `VenueHomeView.vue` does not exist.

- [ ] **Step 3: Implement selection cards and routing**

```vue
<!-- src/components/VenueCard.vue -->
<script setup>
defineProps({ venue: { type: Object, required: true } })
defineEmits(['select'])
</script>

<template>
  <button class="venue-card" type="button" @click="$emit('select', venue)">
    <img :src="venue.thumb" :alt="venue.name">
    <strong>{{ venue.name }}</strong>
    <span aria-hidden="true">≫</span>
  </button>
</template>
```

```vue
<!-- src/views/VenuePickerView.vue -->
<script setup>
import { useRouter } from 'vue-router'
import { venues } from '../data/venues'
import { setActiveVenue } from '../router'
import VenueCard from '../components/VenueCard.vue'
import logo from '../assets/original/logo.png'

const router = useRouter()
function selectVenue(venue) {
  setActiveVenue(venue.id)
  router.push(`/home/${venue.id}`)
}
</script>

<template>
  <main class="venue-picker">
    <img class="platform-logo" :src="logo" alt="宋治平体育馆预约系统标志">
    <h1>宋治平体育馆预约系统</h1>
    <p>宋治平体育馆</p>
    <section class="venue-list">
      <VenueCard v-for="venue in venues" :key="venue.id" :venue="venue" @select="selectVenue" />
    </section>
  </main>
</template>
```

- [ ] **Step 4: Implement the screenshot-matched venue home**

```vue
<!-- src/views/VenueHomeView.vue -->
<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { getVenue } from '../data/venues'
import { setActiveVenue } from '../router'
import BottomNav from '../components/BottomNav.vue'
import arrangementIcon from '../assets/original/venue-arrangement.png'
import ticketIcon from '../assets/original/online-ticket.png'
import bookingIcon from '../assets/original/venue-booking.png'
import comingSoonIcon from '../assets/original/coming-soon.png'

const props = defineProps({ venueId: String })
const venue = computed(() => getVenue(props.venueId))
const slide = ref(0)
let timer
onMounted(() => {
  setActiveVenue(venue.value.id)
  timer = window.setInterval(() => slide.value = (slide.value + 1) % venue.value.banners.length, 4500)
})
onBeforeUnmount(() => window.clearInterval(timer))
</script>

<template>
  <main class="home-page">
    <section class="venue-panel">
      <header><h1>{{ venue.name }}</h1><RouterLink to="/venues">查看其他校区 ›</RouterLink></header>
      <img class="hero" :src="venue.banners[slide]" :alt="`${venue.name}场馆`">
      <p class="address">⌖ {{ venue.address }}</p>
      <div class="description"><span>▱ {{ venue.description }}</span><button>更多</button><a :href="`tel:${venue.phone}`">♧<small>联系电话</small></a></div>
    </section>
    <section class="schedule"><img :src="arrangementIcon" alt=""><strong>场馆安排</strong><span>查看</span></section>
    <section class="online"><h2>在线功能</h2><div class="feature-grid"><button><img :src="ticketIcon" alt=""><span>在线购票</span></button><RouterLink :to="`/reserve/${venue.id}`"><img :src="bookingIcon" alt=""><span>场地预约</span></RouterLink><button><img :src="comingSoonIcon" alt=""><span>敬请期待...</span></button></div></section>
    <BottomNav active="home" :venue-id="venue.id" />
  </main>
</template>
```

- [ ] **Step 5: Apply extracted spacing, radii, colors, and image cropping**

```css
.venue-picker { min-height: 100vh; padding: 92px 30px 30px; text-align: center; background: #f7f7f7; }
.platform-logo { width: 112px; height: 112px; object-fit: contain; }
.venue-picker h1 { margin: 36px 0 46px; font-size: 30px; font-weight: 400; }
.venue-picker > p { color: #aaa; font-size: 19px; }
.venue-list { display: grid; gap: 8px; margin-top: 36px; }
.venue-card { min-height: 112px; border: 0; border-radius: 8px; background: #fff; display: grid; grid-template-columns: 82px 1fr auto; align-items: center; gap: 18px; padding: 16px 18px; text-align: left; color: #333; box-shadow: 0 1px 0 #ccc; }
.venue-card img { width: 82px; height: 82px; border-radius: 50%; object-fit: cover; }
.venue-card strong { font-size: 25px; font-weight: 400; }
.venue-card span { color: #ddd; font-size: 48px; font-weight: 200; }
.home-page { padding: 10px 10px 92px; }
.venue-panel, .online { background: #fff; border-radius: 9px; padding: 14px 12px; }
.venue-panel header { display: flex; align-items: center; justify-content: space-between; }
.venue-panel h1 { font-size: 21px; margin: 0 0 16px; }
.venue-panel header a { color: #666; font-size: 16px; }
.hero { width: 100%; height: 184px; border-radius: 7px; object-fit: cover; }
.address { color: #666; font-size: 16px; margin: 18px 0 12px; }
.schedule { margin: 10px 0; min-height: 72px; background: #fff; display: flex; align-items: center; gap: 24px; padding: 0 24px; }
.schedule span { color: var(--lime); }
.feature-grid { display: grid; grid-template-columns: repeat(3, 1fr); text-align: center; }
```

- [ ] **Step 6: Run home tests and commit**

Run: `npm test -- tests/home.test.js`

Expected: two tests PASS.

```bash
git add src/components src/views tests/home.test.js
git commit -m "feat: recreate venue selection and home screens"
```

### Task 5: Implement both reservation project lists

**Files:**
- Create: `src/components/SportCard.vue`
- Create: `src/views/ReservationView.vue`
- Test: `tests/reservation.test.js`

**Interfaces:**
- Consumes: `getVenue()` and `BottomNav`.
- Produces: `/reserve/song` and `/reserve/qianwei` views and emits a local `reserve-click` event without network activity.

- [ ] **Step 1: Write failing reservation tests**

```js
// tests/reservation.test.js
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import ReservationView from '../src/views/ReservationView.vue'

describe('ReservationView', () => {
  it('renders the Song sports in source order', () => {
    const wrapper = mount(ReservationView, {
      props: { venueId: 'song' },
      global: { stubs: ['RouterLink', 'BottomNav'] },
    })
    expect(wrapper.findAll('[data-sport]').map((card) => card.attributes('data-sport'))).toEqual(['乒乓球', '网球', '排球'])
  })

  it('renders the Qianwei sports in source order', () => {
    const wrapper = mount(ReservationView, {
      props: { venueId: 'qianwei' },
      global: { stubs: ['RouterLink', 'BottomNav'] },
    })
    expect(wrapper.findAll('[data-sport]').map((card) => card.attributes('data-sport'))).toEqual(['羽毛球', '乒乓球', '匹克球'])
  })

  it('keeps reservation local', async () => {
    const wrapper = mount(ReservationView, {
      props: { venueId: 'song' },
      global: { stubs: ['RouterLink', 'BottomNav'] },
    })
    await wrapper.get('button').trigger('click')
    expect(wrapper.text()).toContain('演示页面不连接预约后台')
  })
})
```

- [ ] **Step 2: Run the tests and verify failure**

Run: `npm test -- tests/reservation.test.js`

Expected: FAIL because reservation components do not exist.

- [ ] **Step 3: Implement the reusable sport card**

```vue
<!-- src/components/SportCard.vue -->
<script setup>
defineProps({ sport: { type: Object, required: true } })
defineEmits(['reserve'])
</script>

<template>
  <article class="sport-card" :data-sport="sport.name">
    <img :src="sport.image" :alt="sport.name">
    <div class="sport-copy"><p>项目：{{ sport.name }}</p><p>开始营业时间：<em>{{ sport.time }}</em></p></div>
    <button type="button" @click="$emit('reserve', sport)">预约场地</button>
  </article>
</template>
```

- [ ] **Step 4: Implement reservation view and local toast**

```vue
<!-- src/views/ReservationView.vue -->
<script setup>
import { computed, ref } from 'vue'
import { getVenue } from '../data/venues'
import SportCard from '../components/SportCard.vue'
import BottomNav from '../components/BottomNav.vue'

const props = defineProps({ venueId: { type: String, default: 'song' } })
const venue = computed(() => getVenue(props.venueId))
const message = ref('')
const reserve = () => {
  message.value = '演示页面不连接预约后台'
  window.setTimeout(() => message.value = '', 1800)
}
</script>

<template>
  <main class="reservation-page">
    <header class="reservation-tab">场地</header>
    <section class="sport-list"><SportCard v-for="sport in venue.sports" :key="sport.name" :sport="sport" @reserve="reserve" /></section>
    <p v-if="message" role="status" class="toast">{{ message }}</p>
    <BottomNav active="reserve" :venue-id="venue.id" />
  </main>
</template>
```

- [ ] **Step 5: Match card measurements from the extracted CSS**

```css
.reservation-page { padding: 0 6px 92px; }
.reservation-tab { height: 70px; display: grid; place-items: center; background: #fff; color: #69baff; font-size: 22px; border-bottom: 2px solid #69baff; }
.sport-list { display: grid; gap: 8px; margin-top: 7px; }
.sport-card { min-height: 110px; padding: 11px; background: #fff; border-radius: 8px; display: grid; grid-template-columns: 88px 1fr auto; align-items: center; gap: 11px; }
.sport-card img { width: 88px; height: 88px; border-radius: 6px; object-fit: cover; }
.sport-copy p { color: #888; margin: 8px 0; font-size: 15px; }
.sport-copy em { color: #69c9f4; font-style: normal; }
.sport-card button { border: 0; border-radius: 7px; background: #72c8ee; color: #fff; padding: 12px 10px; white-space: nowrap; }
```

- [ ] **Step 6: Run reservation tests and commit**

Run: `npm test -- tests/reservation.test.js`

Expected: three tests PASS.

```bash
git add src/components/SportCard.vue src/views/ReservationView.vue tests/reservation.test.js
git commit -m "feat: recreate reservation project lists"
```

### Task 6: Implement the personal center with changed identity

**Files:**
- Create: `src/views/ProfileView.vue`
- Test: `tests/profile.test.js`

**Interfaces:**
- Consumes: `profile`, extracted avatar/icons, `getActiveVenueId()` and `BottomNav`.
- Produces: `/profile` view with fixed coursework identity and the four assistant items.

- [ ] **Step 1: Write the failing profile test**

```js
// tests/profile.test.js
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import ProfileView from '../src/views/ProfileView.vue'

describe('ProfileView', () => {
  it('shows the requested name and student number', () => {
    const wrapper = mount(ProfileView, { global: { stubs: ['RouterLink', 'BottomNav'] } })
    expect(wrapper.get('[data-profile-name]').text()).toBe('李子涵')
    expect(wrapper.get('[data-student-id]').text()).toContain('87240433')
    expect(wrapper.text()).not.toContain('王科技')
    expect(wrapper.text()).not.toContain('87240227')
  })

  it('shows the four screenshot assistant entries', () => {
    const wrapper = mount(ProfileView, { global: { stubs: ['RouterLink', 'BottomNav'] } })
    for (const label of ['我的预约', '我的邀请', '购票记录', '敬请期待...']) expect(wrapper.text()).toContain(label)
  })
})
```

- [ ] **Step 2: Run the test and verify failure**

Run: `npm test -- tests/profile.test.js`

Expected: FAIL because `ProfileView.vue` does not exist.

- [ ] **Step 3: Implement the personal center layout**

```vue
<!-- src/views/ProfileView.vue -->
<script setup>
import { getActiveVenueId } from '../router'
import { profile } from '../data/venues'
import BottomNav from '../components/BottomNav.vue'
import avatar from '../assets/original/profile-avatar.png'
import male from '../assets/original/male.png'
import booking from '../assets/original/my-booking.png'
import invite from '../assets/original/my-invite.png'
import tickets from '../assets/original/ticket-record.png'
import comingSoon from '../assets/original/coming-soon.png'

const actions = [
  { label: '我的预约', icon: booking },
  { label: '我的邀请', icon: invite },
  { label: '购票记录', icon: tickets },
  { label: '敬请期待...', icon: comingSoon },
]
</script>

<template>
  <main class="profile-page">
    <section class="profile-hero">
      <img class="avatar" :src="avatar" alt="李子涵头像">
      <div><h1><span data-profile-name>{{ profile.name }}</span><img :src="male" alt="男"></h1><p data-student-id>学号：{{ profile.studentId }}</p></div>
    </section>
    <section class="assistant-card">
      <h2>我的助手</h2>
      <div class="divider"></div>
      <div class="assistant-grid"><button v-for="action in actions" :key="action.label"><img :src="action.icon" alt=""><span>{{ action.label }}</span></button></div>
    </section>
    <BottomNav active="profile" :venue-id="getActiveVenueId()" />
  </main>
</template>
```

- [ ] **Step 4: Apply profile visual styling**

```css
.profile-page { padding: 6px 8px 92px; min-height: 100vh; }
.profile-hero { min-height: 136px; padding: 16px; display: flex; gap: 18px; background: linear-gradient(115deg, #83b9f6, #7be9b0); color: #fff; }
.avatar { width: 88px; height: 88px; border-radius: 50%; border: 4px solid rgba(255,255,255,.6); object-fit: cover; }
.profile-hero h1 { margin: 4px 0 14px; font-size: 25px; display: flex; align-items: center; gap: 9px; }
.profile-hero h1 img { width: 23px; height: 23px; }
.profile-hero p { margin: 0; font-weight: 600; }
.assistant-card { margin: 16px 6px; padding: 20px 12px 28px; background: #fff; border-radius: 8px; }
.assistant-card h2 { margin: 0 0 20px; font-size: 21px; }
.divider { height: 1px; background: #ddd; }
.assistant-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-top: 23px; }
.assistant-grid button { border: 0; background: transparent; color: #999; padding: 0; }
.assistant-grid img { width: 48px; height: 48px; object-fit: contain; display: block; margin: 0 auto 8px; }
```

- [ ] **Step 5: Run profile tests and commit**

Run: `npm test -- tests/profile.test.js`

Expected: two tests PASS.

```bash
git add src/views/ProfileView.vue tests/profile.test.js
git commit -m "feat: recreate personal center with coursework identity"
```

### Task 7: Complete visual verification, production checks, and handoff docs

**Files:**
- Modify: component and view styles found during visual comparison
- Create: `README.md`
- Create: `artifacts/screenshots/*.png`

**Interfaces:**
- Consumes: Complete application from Tasks 1–6 and the seven user screenshots.
- Produces: Passing tests, production build, verified mobile screenshots, and usage documentation.

- [ ] **Step 1: Run the complete automated test suite**

Run: `npm test`

Expected: all extraction, venue, router, home, reservation, and profile tests PASS.

- [ ] **Step 2: Build the application and scan for forbidden runtime dependencies**

Run: `npm run build && ! rg -n 'easyserpClient|C3614FCB79DD6553EC1E8B5976DC5C44|王科技|87240227' dist src`

Expected: Vite build succeeds and `rg` finds no forbidden runtime API root or original user data.

- [ ] **Step 3: Start a local preview and capture the six distinct states**

Run: `npm run dev -- --host 127.0.0.1`

Open a 390×844 browser viewport and capture:

```text
artifacts/screenshots/venues.png
artifacts/screenshots/song-home.png
artifacts/screenshots/qianwei-home.png
artifacts/screenshots/song-reserve.png
artifacts/screenshots/qianwei-reserve.png
artifacts/screenshots/profile.png
```

Expected: each route loads without console errors; the document width is exactly the viewport width and `document.documentElement.scrollWidth === 390`.

- [ ] **Step 4: Compare screenshots against the supplied references and repair material differences**

Use the following acceptance checks for every state:

```text
- heading order and card hierarchy match the reference
- card left/right padding differs by no more than 4px at 390px width
- hero and sport images use the same crop direction as the reference
- selected navigation color is #69baff to #7ecef4
- bottom navigation remains fixed while content scrolls
- profile displays 李子涵 and 87240433
```

After each CSS repair, rerun: `npm test && npm run build`.

- [ ] **Step 5: Write the handoff README**

````markdown
# 吉林大学体育馆前端仿制

本项目是课程学习用途的纯前端页面，使用 Vue 3 + Vite 实现。

## 运行

```bash
npm install
npm run dev
```

## 验证

```bash
npm test
npm run build
```

## 页面

- `#/venues`：场馆选择
- `#/home/song`、`#/home/qianwei`：场馆首页
- `#/reserve/song`、`#/reserve/qianwei`：场地预约项目
- `#/profile`：个人中心

`reference-source/` 保存开发者工具中定位的原始页面代码，仅用于对照；运行时不执行这些文件，也不调用原站后端。
````

- [ ] **Step 6: Commit final verification artifacts**

```bash
git add README.md src artifacts/screenshots
git commit -m "docs: add verified frontend handoff"
```

- [ ] **Step 7: Verify the final working tree and history**

Run: `git status --short && git log --oneline -8`

Expected: working tree is clean and history contains the design, source extraction, scaffold, navigation, page implementations, and verification commits.
