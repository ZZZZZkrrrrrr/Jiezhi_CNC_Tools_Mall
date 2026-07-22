# Codex 数控精密刀具商城网页端一比一复刻执行文档

**参考项目：** `https://modao.cc/ai/share/project/6a5ee1fe75d0275ef6b40be0`  
**目标形态：** 将小程序完整迁移为可运行的桌面网页端  
**适用执行器：** Codex CLI、Codex IDE 或 Codex App  
**文档版本：** V1.0  
**日期：** 2026-07-21

---

## 1. 文档目的

本文件不是普通的产品需求说明，也不是让 Codex 根据“数控刀具商城”这一主题自行发挥。它是一份可以直接交给 Codex 执行的复刻施工规范，用于强制 Codex 完成以下闭环：

1. 自主访问并遍历墨刀参考项目；
2. 抓取全部页面、弹窗、状态、文案、图片和交互路径；
3. 从参考项目中提取视觉规范和原始素材；
4. 对缺失素材自主联网检索、下载、本地化并登记来源；
5. 先在小程序原始宽度下完成像素级还原；
6. 再将同一套内容和交互迁移成真正的桌面网页布局；
7. 建立自动化功能测试、视觉回归测试和最终验收报告；
8. 输出完整可运行源码，而不是静态效果图或概念方案。

这份文档的核心原则只有一句：

> **参考项目有什么，网页端就必须有什么；只改变桌面适配所必需的布局形式，不改变项目本身。**

---

## 2. 对“一比一复刻”的精确定义

小程序和桌面网页使用不同视口，不能简单用“坐标完全相同”来定义一比一。因此，本项目采用双重验收。

### 2.1 参考校验模式

在参考项目原始小程序宽度附近运行网页。Codex应优先从墨刀页面元数据、画板尺寸或截图比例中自动识别参考视口；无法识别时使用 `390×844`。

该模式必须做到：

- 页面数量一致；
- 模块顺序一致；
- 文案一致；
- 图片和图标一致或有明确来源替代；
- 字体层级、颜色、间距、圆角、阴影和边框高度接近；
- 每个按钮、卡片、Tab、弹窗和跳转均可操作；
- 参考项目出现的加载、空数据、错误、登录和成功状态均被实现。

这个模式的作用是证明 Codex 没有漏页面、漏素材、漏交互。

### 2.2 桌面网页模式

在 `1440×900` 和 `1920×1080` 下进行桌面化迁移。

该模式必须做到：

- 不出现手机外框；
- 不把 390px 页面直接放大；
- 不把手机窄列居中后留出大片空白；
- 保持原导航名称、顺序和目标页面；
- 保持原模块顺序、字段和业务逻辑；
- 将 TabBar、底部弹层、单列列表等转换为符合桌面习惯的导航、筛选栏、表格、Dialog、Drawer 或多列布局；
- 保持同一套品牌色、图片语言、字体层级和组件形态，让用户明确看出这是同一个项目的网页端。

### 2.3 禁止的伪复刻方式

以下方式不得接受：

- 用 iframe 直接嵌入墨刀分享链接；
- 用整页截图作为网页背景；
- 将所有页面画在 Canvas 中；
- 用大面积绝对定位堆出静态画面；
- 只完成首页和几个主要页面；
- 用通用商城模板替代参考项目；
- 用随机刀具图片填充所有商品；
- 点击按钮没有任何状态变化；
- 以“后续可完善”为理由跳过页面、弹窗或异常状态。

---

## 3. Codex 执行环境

### 3.1 推荐启动方式

在一个新建且已经 `git init` 的目录中运行 Codex。建议使用工作区写入、按需审批和实时搜索。

```bash
codex --search --sandbox workspace-write --ask-for-approval on-request
```

建议在 Codex 配置中启用：

```toml
web_search = "live"
approval_policy = "on-request"
sandbox_mode = "workspace-write"

[sandbox_workspace_write]
network_access = true
```

其中，Codex 的网页搜索与命令行进程网络访问是两件事。仅开启网页搜索并不能保证 Playwright 或下载脚本可以访问外网，因此必须同时允许工作区命令的网络访问。

### 3.2 推荐前端技术

- React
- TypeScript
- Vite
- React Router
- SCSS Modules
- CSS Variables
- React Hook Form
- Zod
- i18next
- Zustand，仅在跨页面状态确有必要时使用
- Playwright
- Vitest
- Sharp
- ESLint
- Prettier

不建议使用 Ant Design、Element Plus 等带有强烈默认视觉语言的大型 UI 库。它们会提高开发速度，但容易破坏像素还原。通用按钮、输入框、卡片、Dialog、Drawer、Tabs、Pagination 和 Toast 应按参考项目自行实现。

### 3.3 初始化命令

```bash
npm create vite@latest . -- --template react-ts
npm install react-router-dom zustand zod react-hook-form @hookform/resolvers i18next react-i18next clsx
npm install -D sass @playwright/test playwright vitest jsdom sharp pixelmatch pngjs eslint prettier axe-core @axe-core/playwright
npx playwright install chromium
```

---

## 4. 仓库结构

Codex必须建立清晰的参考区、实现区、测试区和文档区。

```text
project-root/
├─ AGENTS.md
├─ README.md
├─ reference/
│  ├─ screenshots/
│  ├─ flows/
│  ├─ network/
│  ├─ assets/
│  ├─ manifests/
│  └─ diffs/
├─ src/
│  ├─ app/
│  ├─ pages/
│  ├─ components/
│  ├─ features/
│  ├─ services/
│  ├─ data/
│  ├─ assets/
│  ├─ styles/
│  ├─ i18n/
│  └─ types/
├─ scripts/
├─ tests/
│  └─ e2e/
└─ docs/
   ├─ page-matrix.csv
   ├─ interaction-matrix.csv
   ├─ asset-manifest.csv
   ├─ source-manifest.md
   ├─ reference-audit.md
   ├─ design-system.md
   ├─ assumptions.md
   ├─ progress.md
   ├─ test-report.md
   └─ acceptance-report.md
```

### 4.1 关键文件职责

`AGENTS.md`：持续约束 Codex，不允许它在长任务中逐渐偏离要求。  
`reference/`：保存参考项目证据，不能把参考截图混入正式页面资源。  
`page-matrix.csv`：页面是否完整的唯一核对表。  
`interaction-matrix.csv`：按钮和跳转是否完整的唯一核对表。  
`asset-manifest.csv`：所有图片和图标来源的唯一核对表。  
`assumptions.md`：记录无法确认但必须继续执行的判断。  
`acceptance-report.md`：Codex最终是否真正完成任务的验收凭据。

---

## 5. 阶段一：参考项目访问与采集

### 5.1 普通抓取失败时的处理

墨刀分享项目属于动态应用。只读取初始 HTML 可能得到空页面或少量容器节点。Codex不得因此直接开始“凭经验设计”。应按以下顺序处理：

1. 使用 Playwright 打开参考链接；
2. 等待 DOMContentLoaded 后继续等待动态资源；
3. 分别使用移动端和桌面端 User-Agent；
4. 保存控制台错误和网络响应；
5. 检查 iframe、Canvas、Shadow DOM；
6. 检查页面内嵌 JSON；
7. 检查 localStorage、sessionStorage、IndexedDB；
8. 保存 fetch、XHR 和 WebSocket 信息；
9. 保存首屏、整页和每次操作后的截图；
10. 对加载失败资源单独重试。

只有出现下列情况才允许中止自动采集：

- 链接失效；
- 页面要求访问密码；
- 页面要求登录且没有公开访问入口；
- 出现无法绕开的验证码或人机验证；
- 墨刀服务端明确拒绝访问。

即使出现硬阻塞，Codex也必须生成 `docs/access-blocker.md`，写清已经尝试的方式、错误截图、网络状态和下一步需要的最小输入，而不是只说“无法访问”。

### 5.2 采集内容

每个页面或状态至少保存：

- 页面名称；
- 原型状态 ID；
- 入口位置；
- 来源页面；
- 目标页面；
- 视口尺寸；
- 截图；
- 可见文本；
- DOM 快照；
- 可访问性树；
- 可点击元素；
- 输入框和默认值；
- 弹窗、抽屉、Toast 和选择器；
- 图片和图标地址；
- 网络资源；
- 前置登录状态；
- 返回路径。

### 5.3 页面遍历方法

优先使用广度优先遍历：

1. 将初始页面加入队列；
2. 提取当前状态所有可点击元素；
3. 对每个元素在干净上下文中重新加载来源状态；
4. 执行点击、输入、切换或滑动；
5. 对比 URL、标题、可见文本、DOM 指纹和截图哈希；
6. 发现新状态即保存并加入队列；
7. 记录来源状态、操作和目标状态；
8. 当所有已发现状态的可交互元素均被处理后结束。

### 5.4 Canvas 或坐标热区原型

部分原型没有普通按钮 DOM，所有页面显示在 Canvas 或图片上。此时 Codex应：

- 检测 Canvas 和大尺寸图片元素；
- 按视觉区域划分候选点击区；
- 优先测试底部导航、顶部返回、卡片、主要按钮和图标；
- 每次点击后计算截图差异；
- 保存坐标、点击前后截图和目标状态；
- 建立坐标热区表；
- 使用图像理解判断按钮语义；
- 对同一状态避免重复点击。

不得因为没有 DOM 就跳过交互采集。

### 5.5 页面矩阵模板

`docs/page-matrix.csv` 至少包含：

```text
page_id
prototype_state_id
page_name
entry_point
page_type
main_modules
interactive_elements
target_states
requires_login
screenshot_path
web_route
implementation_status
notes
```

页面矩阵中的 `implementation_status` 只能使用：

- pending
- in_progress
- blocked
- done

最终交付时不得存在 pending 或 in_progress。

### 5.6 交互矩阵模板

```text
interaction_id
source_page
control
trigger
precondition
target_page_or_state
animation
error_state
test_case
test_status
notes
```

`test_status` 最终只能是 passed 或明确记录的 blocked。不能留空。

---

## 6. 阶段二：视觉规范提取

Codex必须先从参考项目中提取 Design Token，再开发页面。不得在写页面时随意选色。

### 6.1 必须提取的 Token

颜色：

- 品牌主色；
- 品牌深色和浅色；
- 页面背景；
- 卡片背景；
- 一级、二级、辅助文本；
- 边框；
- 分割线；
- 成功、警告、错误和信息色；
- 链接和选中态；
- 遮罩层。

排版：

- 中文字体；
- 英文和数字字体；
- H1、H2、H3、正文、辅助文字、标签、按钮字号；
- 字重；
- 行高；
- 字距；
- 型号和单位的不换行规则。

形态：

- 按钮高度；
- 输入框高度；
- 卡片圆角；
- 弹窗圆角；
- 标签圆角；
- 边框宽度；
- 阴影层级；
- 页面间距；
- 栅格间隙；
- 图片比例。

### 6.2 Token 文件示例

```css
:root {
  --color-brand-500: #000000;
  --color-brand-600: #000000;
  --color-bg-page: #ffffff;
  --color-bg-card: #ffffff;
  --color-text-primary: #1f2329;
  --color-text-secondary: #646a73;
  --color-border: #e5e6eb;

  --font-sans-cn: "PingFang SC", "Microsoft YaHei", "Noto Sans SC", sans-serif;
  --font-sans-latin: Inter, Arial, sans-serif;

  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;

  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
}
```

示例值只能作为结构参考，实际数值必须由参考项目提取。

---

## 7. 阶段三：图片和素材自主联网补齐

用户要求图片由执行代理自行查找，因此图片工作不能只写成“请用户补图”。Codex必须完成检索、选择、下载、处理和登记。

### 7.1 素材优先级

第一优先：参考项目原图。  
第二优先：参考项目 CSS、网络请求、SVG、iconfont 和背景图。  
第三优先：官方刀具制造商页面和官方产品目录。  
第四优先：经授权的经销商或行业产品数据库。  
第五优先：明确允许商用的图库。  
第六优先：自制中性演示图。

参考截图中裁切的产品图只能用作短期占位或视觉对齐，不能替代高质量原图。

### 7.2 优先检索的官方来源

国内：

- 株洲钻石 ZCC.CT；
- 厦门金鹭 GESAC；
- 华锐精密；
- 参考项目中实际出现的其他品牌官网。

国际：

- Sandvik Coromant；
- Kennametal；
- Mitsubishi Materials；
- Seco Tools；
- 参考项目中实际出现的其他品牌官网。

### 7.3 搜索词规范

商品图应同时用中文和英文检索，并优先带上“官网、产品图、白底、catalog、official”。

```text
数控车削刀片 白底 官方
硬质合金四刃立铣刀 产品图 官网
可转位面铣刀盘 白底 官方
内冷硬质合金钻头 产品图
ER32 高精度筒夹 白底
HSK63A 液压刀柄 产品图
CNC turning insert official product image
solid carbide four flute end mill official image
indexable face mill official product image
solid carbide coolant drill official image
ER collet official product image
HSK hydraulic chuck official image
```

### 7.4 图片选择规则

- 图片必须和产品类别一致；
- 优先使用白底或透明背景；
- 主体完整，不被裁断；
- 不带大面积水印；
- 分辨率足够；
- 同一页面的图片视角、背景和光线尽量统一；
- 不得混用消费级电钻钻头、木工刀具或非数控加工刀具；
- 不得擅自把第三方品牌 Logo 作为项目 Logo；
- 如果参考项目是自有品牌，第三方产品图应去除不必要的品牌视觉或改用中性素材；
- 无法确认发布授权的图片必须标记为“上线前替换”。

### 7.5 图片尺寸建议

实际比例仍以参考项目为准。

| 用途 | 建议母图 | 页面输出 |
|---|---:|---:|
| 商品卡片 | 1200×1200 | 320、640、1200 WebP |
| 商品详情 | 1800×1800 | 640、1200、1800 WebP/AVIF |
| 分类入口 | 800×800 | 320、640 WebP |
| 首页 Banner | 2560×960 或参考比例 | 1280、1920、2560 WebP |
| 品牌/服务图 | 1600px 长边 | 640、1200、1600 WebP |

### 7.6 素材清单

每个素材必须登记：

```text
asset_id
local_path
purpose
category
source_url
source_domain
source_title
original_filename
downloaded_at
copyright_status
replacement_required
notes
```

不得长期热链。所有页面使用本地路径。

### 7.7 图片处理

使用 Sharp：

- 自动旋转；
- 保持比例；
- 生成多尺寸；
- 输出 WebP 和必要的 AVIF；
- 保留透明背景；
- 不放大低分辨率图片；
- 避免过度锐化；
- 生成统一命名。

命名示例：

```text
turning-insert-cnmg120408-main-1200.webp
solid-endmill-4f-d10-main-1200.webp
hsk63a-hydraulic-chuck-main-1200.webp
```

---

## 8. 阶段四：小程序到桌面网页的转换规则

### 8.1 导航

小程序底部 TabBar 转换为桌面顶部导航或左侧导航。

必须保持：

- 原名称；
- 原顺序；
- 原图标语义；
- 原目标页面；
- 原选中状态；
- 原权限要求。

不能因为桌面空间大就擅自增加大量菜单。

### 8.2 首页

小程序中纵向排列的模块，可在桌面转为：

- 横向 Banner；
- 多列快捷入口；
- 多列分类卡片；
- 推荐商品网格；
- 服务说明区；
- 页脚辅助导航。

模块顺序不得改变。不能把原首页改造成另一种营销首页。

### 8.3 分类和列表页

桌面建议结构：

```text
面包屑 / 页面标题
结果数量 + 排序 + 视图切换
左侧筛选栏 | 右侧商品结果
分页
```

参考项目有的筛选字段必须全部保留。可出现的工业字段包括：

- 商品分类；
- 加工方式；
- 被加工材料；
- 刀具材料；
- 涂层；
- 直径；
- 刃数；
- 柄径；
- 刃长；
- 总长；
- 刀片形状；
- 适用机床；
- 库存；
- 品牌；
- 价格或询价方式。

具体字段以参考项目为准，不得把候选字段强行全部加入。

### 8.4 商品详情

桌面首屏建议：

```text
左侧：主图、缩略图、放大查看
右侧：名称、型号、状态、核心参数、规格、数量、收藏、购买/询价操作
```

下方按照参考项目内容显示：

- 产品详情；
- 规格参数；
- 适用材料；
- 加工建议；
- 包装；
- 下载资料；
- 售后；
- 推荐商品。

不存在的信息不得伪造为真实厂家参数。

### 8.5 购物车或询价单

桌面采用表格或宽卡片。至少保持参考项目中已有的：

- 选择框；
- 商品图片；
- 名称；
- 型号；
- 规格；
- 数量；
- 单价或询价标识；
- 小计；
- 收藏；
- 删除；
- 汇总；
- 结算或提交询价。

### 8.6 个人中心

小程序单列菜单转为左侧菜单、右侧内容。每个菜单仍需独立路由或可恢复的子状态。

### 8.7 弹层

- 小程序底部选择器 → 桌面 Popover 或 Dialog；
- 大表单底部弹层 → 右侧 Drawer 或大 Dialog；
- Toast → 右上或参考项目对应位置；
- 操作确认 → 居中 Confirm Dialog。

选项、文案和结果不能改变。

### 8.8 响应式断点

- `≥1440px`：完整桌面；
- `1200–1439px`：标准桌面；
- `1024–1199px`：紧凑桌面；
- `768–1023px`：平板；
- `<768px`：移动网页和参考校验模式。

在 1024px 以上不得把内容限制在手机宽度。

---

## 9. 阶段五：页面和路由

真正页面清单必须由参考采集生成。下列仅是数控刀具商城常见候选项，用于检查采集是否存在明显遗漏，不能替代实际页面矩阵。

| 候选页面 | 推荐路由 | 说明 |
|---|---|---|
| 首页 | `/` | 参考项目首页完整迁移 |
| 分类 | `/categories` | 一级、二级或三级分类 |
| 商品列表 | `/products` | 支持筛选、排序、分页 |
| 搜索 | `/search` | 建议、历史、结果、无结果 |
| 商品详情 | `/products/:id` | 图片、规格、参数、操作 |
| 收藏 | `/favorites` | 登录态或本地演示态 |
| 购物车 | `/cart` | 若原项目为购物逻辑 |
| 询价单 | `/quote-cart` | 若原项目为 B2B 询价逻辑 |
| 提交询价 | `/quote/submit` | 联系人和企业信息 |
| 登录 | `/login` | 或 Dialog |
| 个人中心 | `/account` | 概览 |
| 订单 | `/account/orders` | 仅在参考项目存在时 |
| 地址 | `/account/addresses` | 国内地址结构 |
| 浏览记录 | `/account/history` | 仅在参考项目存在时 |
| 客服 | `/support` | 联系方式和常见问题 |
| 企业介绍 | `/about` | 仅在参考项目存在时 |

Codex必须用实际采集结果增删和重命名路由。

---

## 10. 阶段六：数控精密刀具商品体系

如果参考项目已有完整分类和商品数据，应原样使用。只有在参考内容为占位或明显不完整时，才使用以下结构补齐演示数据。

### 10.1 一级分类

1. 车削刀具；
2. 铣削刀具；
3. 孔加工刀具；
4. 螺纹加工刀具；
5. 刀柄和工具系统；
6. 数控刀片；
7. 夹具和附件；
8. 测量与维护。

### 10.2 二级分类

车削：外圆、内孔、切断、切槽、螺纹、仿形、车削刀片。  
铣削：立铣、面铣、球头、圆鼻、T型槽、燕尾槽、可转位铣削、铣削刀片。  
孔加工：麻花钻、中心钻、阶梯钻、深孔钻、可转位钻、铰刀、镗刀、沉头刀。  
螺纹：丝锥、挤压丝锥、螺纹铣刀、板牙、螺纹刀片。  
刀柄：ER、液压、热缩、强力、侧固、面铣刀柄、镗刀系统、延长杆、转接套。  
刀片：车削、铣削、切槽、螺纹、钻削、CBN、PCD、陶瓷。  
附件：筒夹、拉钉、刀杆、压板、螺钉、扳手、冷却附件。  
测量：对刀仪、预调仪、检测设备、量具、维护用品。

### 10.3 商品命名

应符合工业采购语义，例如：

- 硬质合金四刃平底立铣刀；
- 不锈钢专用涂层圆鼻铣刀；
- 可转位面铣刀盘；
- 内冷硬质合金麻花钻；
- 精加工数控车削刀片；
- ER32 高精度弹簧筒夹；
- HSK63A 液压刀柄。

禁止使用“商品一”“爆款神器”“精选好物”等消费电商文案。

### 10.4 商品数据模型

```ts
export interface Product {
  id: string;
  slug: string;
  nameZh: string;
  nameEn?: string;
  model: string;
  categoryId: string;
  brand?: string;
  images: ProductImage[];
  summary: string;
  workpieceMaterials: string[];
  toolMaterial?: string;
  coating?: string;
  diameterMm?: number;
  fluteCount?: number;
  shankDiameterMm?: number;
  fluteLengthMm?: number;
  overallLengthMm?: number;
  tolerance?: string;
  stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock' | 'inquiry_only';
  stockQuantity?: number;
  priceDisplay: 'fixed' | 'range' | 'login_required' | 'inquiry';
  priceCny?: number;
  minimumOrderQuantity?: number;
  unit: string;
  leadTime?: string;
  canPurchase: boolean;
  canQuote: boolean;
  status: 'active' | 'new' | 'discontinued';
}
```

演示参数必须在数据文件或文档中注明为 Mock，不得伪装成真实厂商承诺。

---

## 11. 阶段七：交互与状态

Codex应以交互矩阵为准，至少核对以下项目。

### 11.1 导航和浏览

- 主导航切换；
- 返回；
- 面包屑；
- Tab；
- 轮播；
- 分类展开；
- 商品卡片跳转；
- 页脚链接。

### 11.2 搜索和筛选

- 输入关键词；
- 搜索建议；
- 历史记录；
- 清空历史；
- 热门词；
- 多条件筛选；
- 已选条件标签；
- 单个删除；
- 重置；
- 排序；
- 分页；
- 无结果。

### 11.3 商品和采购

- 图库缩略图切换；
- 图片放大；
- 规格选择；
- 数量增减；
- 数量边界；
- 收藏和取消；
- 加入购物车；
- 加入询价单；
- 全选；
- 删除；
- 汇总变化；
- 提交询价。

### 11.4 账户和表单

- 未登录；
- 演示登录；
- 退出；
- 手机号格式；
- 企业名称；
- 联系人；
- 地址；
- 邮箱；
- 必填提示；
- 提交中；
- 成功；
- 失败。

### 11.5 通用状态

- 默认；
- Hover；
- Focus；
- Active；
- Disabled；
- Loading；
- Empty；
- Error；
- Success；
- 库存充足；
- 低库存；
- 无货；
- 仅询价。

### 11.6 可访问性

- 键盘 Tab 可达；
- 焦点可见；
- Esc 关闭弹窗；
- Dialog 有标题和描述；
- 图片有替代文本；
- 输入框有 Label；
- 表格表头语义正确；
- 颜色对比不过低；
- 不只依赖颜色传达状态。

---

## 12. 阶段八：国内客户与外贸扩展

### 12.1 当前默认

- 简体中文；
- CNY；
- 中国大陆；
- 手机号；
- 省、市、区、详细地址；
- 国内采购或企业询价；
- `YYYY-MM-DD`。

### 12.2 预留能力

- `en-US`；
- USD；
- 国家/地区；
- 国际电话号码；
- 邮箱；
- 国际地址；
- 英文商品名称和参数；
- 国际物流；
- Incoterms 等贸易条款字段；
- 地区库存和价格；
- 海外询价联系人。

### 12.3 实现规则

- 所有用户可见文案进入 i18n 文件；
- 组件不直接写死中文；
- 金额格式由区域设置处理；
- 地址模型支持国内和国际两种结构；
- 当前界面默认不突出外贸入口，避免干扰国内采购用户；
- 顶部或页脚可预留语言入口，是否显示以参考项目视觉为准。

---

## 13. 阶段九：测试体系

### 13.1 单元测试

使用 Vitest 覆盖：

- 商品过滤；
- 排序；
- 价格显示；
- 库存状态；
- 数量边界；
- 购物车汇总；
- LocalStorage 持久化；
- i18n 格式；
- 表单校验；
- 数据映射。

### 13.2 E2E 测试

使用 Playwright 覆盖：

1. 首页进入分类；
2. 分类筛选商品；
3. 搜索并进入详情；
4. 切换详情图片和规格；
5. 收藏商品；
6. 加入购物车或询价单；
7. 修改数量和删除；
8. 提交询价表单；
9. 登录和退出；
10. 个人中心菜单；
11. 空数据和错误状态；
12. 移动、平板和桌面视口。

所有关键元素添加稳定的 `data-testid`。

### 13.3 视觉回归

截图视口：

- 参考视口，优先自动识别，否则 390×844；
- 1024×768；
- 1440×900；
- 1920×1080。

关键页面至少包括：

- 首页；
- 分类；
- 商品列表；
- 商品详情；
- 购物车或询价单；
- 登录；
- 个人中心；
- 参考项目中特有的关键页面。

自动差异图仅用于定位问题。最终必须人工查看截图，避免出现算法通过但图片拉伸、文字截断或风格错误。

### 13.4 运行命令

```bash
npm run lint
npm run test
npm run test:e2e
npm run build
```

最终四项必须全部通过。

---

## 14. 阶段十：验收标准

### 14.1 完整性

- 参考页面总数等于实现页面总数；
- 参考交互均有对应实现；
- 所有弹窗和状态被覆盖；
- 页面矩阵无 pending；
- 交互矩阵无空白；
- 没有点击无反应；
- 没有用截图代替页面；
- 没有未登记来源的素材。

### 14.2 视觉

- 参考宽度下页面高度接近；
- 模块顺序一致；
- 文案层级一致；
- 图片比例一致；
- 颜色、圆角、阴影和间距没有明显漂移；
- 桌面端仍保持同一品牌身份；
- 1440px 不呈现手机窄列；
- 无异常横向滚动；
- 无文字遮挡；
- 无图片变形。

### 14.3 工程

- TypeScript 无阻断错误；
- 构建通过；
- 核心流程测试通过；
- 路由可刷新直达；
- 数据、组件和样式结构清晰；
- 素材已本地化；
- README 可以让新环境直接启动；
- 不依赖墨刀链接才能运行。

### 14.4 最终报告指标

`docs/acceptance-report.md` 必须列出：

- 参考页面总数；
- 实现页面总数；
- 参考状态总数；
- 实现状态总数；
- 参考交互总数；
- 测试通过交互数；
- 素材总数；
- 直接提取素材数；
- 联网补充素材数；
- 需要生产替换的素材数；
- E2E 测试结果；
- 视觉回归结果；
- 已知差异；
- 剩余风险。

---

## 15. Codex 分工建议

如果 Codex 支持子代理，可按以下角色并行。

### 15.1 Reference Auditor

只负责墨刀访问、页面遍历、截图、网络资源和矩阵。不得写正式页面。

### 15.2 Asset Researcher

只负责从参考项目提取素材、联网检索、下载、处理和素材清单。

### 15.3 Frontend Builder

只根据页面矩阵、设计规范和素材清单实现页面和交互。

### 15.4 Visual QA

只负责 Playwright、截图差异、响应式、无障碍和验收报告。

主代理负责整合。Reference Auditor 和 Visual QA 不应由同一个上下文承担全部工作，以减少“自己写、自己放宽验收”的风险。

---

## 16. Codex 每阶段输出物

| 阶段 | 必须输出 |
|---|---|
| 前置检查 | `preflight-report.md`、首屏截图、错误日志 |
| 参考采集 | 页面矩阵、交互矩阵、参考截图、流程记录 |
| 设计提取 | Design Token、设计规范、组件清单 |
| 素材 | 本地素材、素材清单、来源清单 |
| 工程骨架 | 路由、布局、i18n、Mock service、测试框架 |
| 移动还原 | 全部参考宽度页面、基线截图 |
| 桌面迁移 | 1440 和 1920 页面截图 |
| 交互 | 完整状态和 E2E 测试 |
| QA | 测试报告、差异图、无障碍报告 |
| 交付 | README、完整源码、验收报告 |

---

## 17. Codex 不得询问用户的事项

下列问题应由 Codex通过参考项目、行业资料和保守判断自行解决：

- 商品图去哪找；
- 页面如何从手机改为桌面；
- 使用什么前端框架；
- 采用何种响应式断点；
- 缺失的普通图标如何替换；
- Mock 数据如何组织；
- 测试如何编写；
- 文件如何命名；
- 参考项目中可见的页面或文案是什么。

只有访问密码、验证码、私有权限和明确法律授权问题属于需要用户补充的硬阻塞。

---

## 18. 可直接粘贴给 Codex 的启动提示词

```text
阅读仓库根目录 AGENTS.md 和 MASTER_PROMPT.md，然后完整执行数控精密刀具商城小程序到桌面网页端的一比一复刻。

参考链接：
https://modao.cc/ai/share/project/6a5ee1fe75d0275ef6b40be0

先使用 Playwright 完成参考项目采集，生成页面矩阵、交互矩阵、设计规范和素材清单。不要先写首页。参考项目中的图片优先直接提取；缺失图片由你使用实时网页搜索和浏览器自行检索官方刀具制造商网站、下载、本地化、处理，并记录来源和授权状态。

先在参考小程序宽度下逐页还原并完成视觉对照，再将同一内容迁移为 1440px 和 1920px 的真正桌面网页布局。不得使用 iframe、整页截图、Canvas 整站、通用商城模板或手机窄列。不得只完成首页。不得中途要求用户逐页确认。

持续执行直到页面矩阵无 pending、交互矩阵全部通过、所有图片有本地文件和来源记录，并且 lint、Vitest、Playwright E2E、build 全部通过。最后输出完整源码、README、关键截图和 acceptance-report.md。
```

---

## 19. 建议的首轮 Codex 命令

```bash
./bootstrap.sh
codex --search --sandbox workspace-write --ask-for-approval on-request
```

进入 Codex 后粘贴第 18 节启动提示词。

Codex第一轮正确行为应是：

1. 阅读 AGENTS.md；
2. 检查环境；
3. 安装 Playwright；
4. 打开墨刀链接；
5. 保存参考证据；
6. 建立页面矩阵；
7. 而不是立即生成一个首页。

---

## 20. 常见失败与修复

### 20.1 Codex直接做了一个类似商城

原因：没有阶段门禁。  
处理：删除未基于页面矩阵的页面，重新从参考采集开始。

### 20.2 墨刀页面打开为空白

原因：动态资源、User-Agent、Canvas、iframe、网络权限或等待不足。  
处理：执行第 5 节完整排查，并检查命令网络访问，而不是只检查 Codex 网页搜索。

### 20.3 图片全部是随机网络图

原因：没有素材优先级和来源清单。  
处理：优先提取参考素材，按类别重新检索，建立 asset-manifest，删除类别不匹配图片。

### 20.4 桌面端像手机页面

原因：把响应式理解成简单缩放。  
处理：按照第 8 节将导航、列表、详情、个人中心和弹层分别迁移。

### 20.5 页面看起来接近但按钮不工作

原因：只做视觉，没有交互矩阵。  
处理：将每个控件映射到测试用例，要求 `test_status=passed`。

### 20.6 视觉测试通过但肉眼不正确

原因：截图阈值不能理解语义。  
处理：自动差异后必须人工查看每个关键页面截图。

### 20.7 使用官方图片存在授权疑问

处理：原型阶段可以保留来源记录；生产发布前替换为企业自有、授权或明确可商用素材。`replacement_required=true` 的素材不得被当作正式上线资产。

---

## 21. 最终交付清单

- [ ] 完整 React + TypeScript 源码；
- [ ] 可运行和可构建；
- [ ] 页面矩阵全部完成；
- [ ] 交互矩阵全部通过；
- [ ] 参考截图完整；
- [ ] 桌面截图完整；
- [ ] 图片全部本地化；
- [ ] 素材来源清单完整；
- [ ] 中文语言文件；
- [ ] 英文扩展结构；
- [ ] Mock 数据；
- [ ] LocalStorage 状态；
- [ ] E2E 测试；
- [ ] 单元测试；
- [ ] 无障碍检查；
- [ ] README；
- [ ] 假设与差异说明；
- [ ] 最终验收报告；
- [ ] 无 iframe；
- [ ] 无整页截图冒充页面；
- [ ] 无点击无反应；
- [ ] 1440px 不是手机窄列。

---

## 22. 参考资料与检索入口

Codex自身配置和执行方式应以 OpenAI 官方 Codex 文档为准。刀具分类和图片检索优先使用刀具制造商官网及官方目录。

```text
https://developers.openai.com/codex/cli
https://developers.openai.com/codex/agent-configuration/agents-md
https://developers.openai.com/codex/agent-approvals-security
https://developers.openai.com/codex/config-reference
https://developers.openai.com/codex/subagents

https://www.zccct.com/
https://www.gesac.com.cn/
https://www.huareal.com.cn/
https://www.sandvik.coromant.com/
https://www.kennametal.com/
https://www.mitsubishicarbide.com/
https://www.secotools.com/
```

