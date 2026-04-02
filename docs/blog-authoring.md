# Blog 文档编写与发布规范（中英双语）

本规范适用于本仓库基于 **Astro Content Collections** 的 Blog（静态生成 + GitHub Pages 自动部署）。

目标：

- 让文档 **可被构建系统稳定收录**（schema 校验通过）
- 让 URL（slug）**长期稳定**（避免 404）
- 让中英文内容 **可对齐、可互链、可维护**

---

## 目录与路由（强约定）

### 文档源文件目录

- **中文**：`src/content/blog/cn/`
- **英文**：`src/content/blog/en/`

支持子目录（例如 `src/content/blog/cn/guides/xxx.md`），但会影响 URL（见下文“slug”）。

### 生成的页面路由（由现有代码固定）

- **英文列表页**：`/blog/`（筛选 `en/`）
- **中文列表页**：`/blog/cn/`（筛选 `cn/`）
- **英文详情页**：`/blog/en/<slug>/`
- **中文详情页**：`/blog/cn/<slug>/`

其中 `<slug>` 来自集合条目的 `id` 去掉语言前缀后的部分：

- `src/content/blog/cn/getting-started.md` → `id = cn/getting-started` → `/blog/cn/getting-started/`
- `src/content/blog/en/getting-started.md` → `id = en/getting-started` → `/blog/en/getting-started/`

---

## 文档格式（Frontmatter：强校验）

本仓库在 `src/content.config.ts` 中对 `blog` 集合做了 schema 校验。每篇文章必须是 `.md` 或 `.mdx`，并包含以下 frontmatter 字段：

### 必填字段

- **`title`**：字符串
- **`description`**：字符串
- **`pubDate`**：日期（字符串可被解析为 Date 即可）

### 可选字段

- **`updatedDate`**：日期（用于“最后更新于/Last updated on”）
- **`heroImage`**：图片资源（Astro `image()` 类型，路径需可被 Astro 正确解析）

### 标准模板（建议直接复制）

> 时间格式统一规则见下一节；这里示例用与当前仓库一致的英文月份写法。

```md
---
title: '这里是文章标题'
description: '这里是一句话摘要（用于列表页和 SEO）'
pubDate: 'Apr 02 2026'
# updatedDate: 'Apr 05 2026'
# heroImage: '../../../assets/blog-placeholder-about.jpg'
---

# 这里是文章标题

正文...
```

---

## 时间格式统一规则（pubDate/updatedDate）

### 统一约定（推荐）

- **写法**：`MMM DD YYYY`（英文月份缩写 + 两位日 + 四位年）
  - 示例：`Apr 02 2026`、`Jul 15 2026`
- **原因**：当前示例已使用此格式，且能被构建时 `z.coerce.date()` 稳定解析。

### 允许但不推荐

- ISO：`2026-04-02`（多数环境可解析，但不同运行时/时区差异更容易埋雷）

### 禁止

- 含歧义的数字日期：`04/02/2026`（不同地区可能被解释为 4 月 2 日或 2 月 4 日）

---

## slug（URL）策略：不可变原则（强约定）

### slug 是什么

slug 由“文章在集合里的相对路径（不含扩展名）”决定，且会直接映射到 URL。

例如：

- `src/content/blog/cn/mcp-server.md` → `/blog/cn/mcp-server/`
- `src/content/blog/cn/guides/mcp-server.md` → `/blog/cn/guides/mcp-server/`

### 不可变原则（必须遵守）

一旦文章发布（已经合入 `main` 并部署上线），以下操作都视为 **破坏性变更**：

- 重命名文件（改变文件名）
- 移动文件（改变目录层级）
- 把文章从 `cn/` 移到 `en/`（或反之）

因为这些会导致旧 URL 变成 404。

### 如果必须改 slug（应急流程）

当前仓库 **没有实现重定向**（redirect）机制。若确实要改 slug，建议同时做至少一项补救：

- 在旧链接处保留一篇“占位跳转/提示”文章（同 slug 的旧文件保留），明确提示新地址
- 或在站点层面引入重定向方案（需要改动 Astro 路由/部署策略）

在没有重定向前，尽量避免改 slug。

---

## 中英文对齐与互链规范（强约定）

### 文章对齐（推荐强约定）

同一主题的中英文文章应满足：

- **相同文件名（slug 对齐）**
  - `src/content/blog/cn/<same-slug>.md`
  - `src/content/blog/en/<same-slug>.md`
- `title/description` 语言各自本地化即可

好处：读者和维护者都能“用同一个 slug 找到另一语言版本”。

### 互链写法（推荐）

为了避免相对路径在不同目录层级下出错，跨语言链接建议用 **站点绝对路径**：

- 中文文章指向英文：`/blog/en/<slug>/`
- 英文文章指向中文：`/blog/cn/<slug>/`

示例：

```md
[English version](/blog/en/getting-started/)
```

```md
[中文版本](/blog/cn/getting-started/)
```

### 文内同目录链接（允许）

同一语言、同一目录下互链，可用相对链接（你当前文档已在用）：

```md
见 [MCP 服务器文档](mcp-server.md)
```

但当你引入子目录时（如 `guides/`），相对路径更容易踩坑；跨目录优先用绝对路径。

---

## 图片与附件规范

### heroImage（封面图）放置规范（与当前实现一致）

- **推荐目录**：`src/assets/`
- **frontmatter 引用**：使用相对路径（从当前 `.md` 文件位置出发）

示例（文章在 `src/content/blog/cn/`）：

```md
heroImage: '../../../assets/blog-placeholder-about.jpg'
```

要求：

- 文件必须存在
- 路径必须正确（否则 `pnpm build` 会失败）

### 正文插图与附件

两种方式二选一（按需求选择）：

- **原样静态文件**（最省心）：放 `public/`，用绝对路径引用
  - 例：`public/images/foo.png` → `![alt](/images/foo.png)`
- **走 Astro 资产处理**：放 `src/assets/`（更适合需要处理/优化的图片）

统一建议：

- 图片文件名使用 `kebab-case`
- 避免中文/空格/特殊字符（Windows 与 CI 环境更稳）

---

## 文件命名与内容风格（建议）

- **文件名**：`kebab-case`，例如 `rest-api.md`、`ide-cli-setup.md`
- **标题**：`#` 级标题只出现一次；后续从 `##` 开始
- **代码块**：标注语言（```bash / ```json / ```typescript 等）
- **外链**：优先使用 https；避免裸域名

---

## 发布前自检清单（合入 main 前必须过一遍）

- **位置**：文件在 `src/content/blog/cn/` 或 `src/content/blog/en/`
- **frontmatter**：
  - `title/description/pubDate` 都存在
  - `pubDate` 格式符合本规范（`MMM DD YYYY`）
  - 如果填了 `updatedDate`，也符合同样格式
  - 如果填了 `heroImage`，路径正确且图片存在
- **链接**：
  - 站内链接可点通（尤其是跨语言/跨目录链接）
- **本地构建**：
  - `pnpm build` 通过（这是 CI 部署会跑的关键一步）

---

## 部署说明（只读信息，便于作者理解发布节奏）

本仓库已配置 GitHub Actions：每次 push 到 `main` 会自动构建并部署到 GitHub Pages。

因此作者侧的“发布动作”就是：**合入 `main`**（或直接 push 到 `main`，取决于你的协作流程）。

