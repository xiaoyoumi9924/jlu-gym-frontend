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
  { url: `${appBase}/static/js/3.7cbab59217625ea9d04f1713170880417.js`, output: 'js/chunk-3.js' },
  { url: `${appBase}/static/js/19.42b81b0e892d54e23fa61713170880417.js`, output: 'js/chunk-19.js' },
  { url: `${appBase}/static/js/105.f22dddb68174e93be47c1713170880417.js`, output: 'js/chunk-105.js' },
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
  { url: `${appBase}/static/img/qrcodeBg.68ce7d3.png`, output: 'entry-code-ticket.png' },
]

export function extractDataUrlModule(source, moduleId) {
  const escaped = moduleId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const modulePattern = new RegExp(`(?:"${escaped}"|${escaped}):function\\([^)]*\\)\\{`)
  const match = modulePattern.exec(source)
  if (!match) throw new Error(`Missing embedded asset module ${moduleId}`)
  const tail = source.slice(match.index, match.index + 500000)
  const data = tail.match(/exports="data:image\/(png|jpeg);base64,([A-Za-z0-9+/=]+)"/)
  if (!data) throw new Error(`Invalid embedded asset module ${moduleId}`)
  return {
    extension: data[1] === 'jpeg' ? 'jpg' : data[1],
    bytes: Buffer.from(data[2], 'base64'),
  }
}

export function extractCssDataUrlRule(source, selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const rulePattern = new RegExp(`${escaped}\\{[^}]*background-image:url\\(data:image\\/(png|jpeg);base64,([A-Za-z0-9+/=]+)\\)`)
  const data = rulePattern.exec(source)
  if (!data) throw new Error(`Missing embedded CSS asset ${selector}`)
  return {
    extension: data[1] === 'jpeg' ? 'jpg' : data[1],
    bytes: Buffer.from(data[2], 'base64'),
  }
}

async function download(url, output) {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`${response.status} ${url}`)
  const bytes = Buffer.from(await response.arrayBuffer())
  if (!bytes.length) throw new Error(`Empty response ${url}`)
  await mkdir(dirname(output), { recursive: true })
  await writeFile(output, bytes)
}

export async function extractAll() {
  for (const entry of SOURCE_FILES) {
    await download(entry.url, resolve(root, 'reference-source', entry.output))
  }
  for (const entry of REMOTE_ASSETS) {
    await download(entry.url, resolve(root, 'src/assets/original', entry.output))
  }

  const app = await readFile(resolve(root, 'reference-source/js/app.js'), 'utf8')
  const css = await readFile(resolve(root, 'reference-source/css/app.css'), 'utf8')
  const profile = await readFile(resolve(root, 'reference-source/js/chunk-2.js'), 'utf8')
  const common = await readFile(resolve(root, 'reference-source/js/chunk-0.js'), 'utf8')
  for (const [source, id, name] of [
    [app, 'juWb', 'online-ticket'],
    [app, 'pAnE', 'coming-soon'],
    [app, 'i2LG', 'venue-arrangement'],
    [profile, 'KYQH', 'male'],
    [profile, 'iezu', 'my-booking'],
    [profile, 'oonp', 'my-invite'],
    [profile, '+xnW', 'ticket-record'],
    [common, 'ny6W', 'mini-entry-qr'],
  ]) {
    const asset = extractDataUrlModule(source, id)
    await writeFile(resolve(root, `src/assets/original/${name}.${asset.extension}`), asset.bytes)
  }

  for (const [selector, name] of [
    ['#footer_nav a.home div[data-v-708b3c4f]', 'nav-home-active'],
    ['#footer_nav a.order div[data-v-708b3c4f]', 'nav-reserve-active'],
    ['#footer_nav a.my div[data-v-708b3c4f]', 'nav-profile-active'],
  ]) {
    const asset = extractCssDataUrlRule(css, selector)
    await writeFile(resolve(root, `src/assets/original/${name}.${asset.extension}`), asset.bytes)
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  extractAll().catch((error) => {
    console.error(error.message)
    process.exitCode = 1
  })
}
