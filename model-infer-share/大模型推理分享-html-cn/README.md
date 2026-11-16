# 大模型推理分享 · 单页滚动演示

把 Obsidian 笔记《大模型推理分享.md》整理成**一页到底、下拉滑动**的 HTML 演示页（不做翻页），
内容顺序与原文一致，用于投屏分享或自习浏览。

## 打开方式

双击 `index.html` 即可（无需服务器、无需联网；只有 webfonts 走 CDN，离线时自动回落到系统字体）。

如果要投屏演示，建议：

1. 用 Chrome / Edge 打开 `index.html`
2. 按 `F11` 全屏
3. 用**鼠标滚轮 / 触控板 / ↑↓ / 空格**滚动浏览

## 交互

| 操作 | 效果 |
|---|---|
| 下拉滚动 | 全篇一页到底，顶部进度条显示阅读位置 |
| 顶部「一二三四」 | 跳到对应章节 |
| 右上「目录」 | 右侧抽屉，列出全部 24 个小节，点任意条目直达 |
| 点击任意配图 | 全屏放大（竖长流程图建议放大后滚动查看） |
| `Esc` | 关闭目录抽屉 / 图片放大 |
| 右下「↑」 | 回到顶部 |

右侧目录抽屉会跟随滚动高亮当前小节，顶部导航会高亮当前章节。

## 目录结构

```
大模型推理分享-html/
├── index.html          演示页（全部内容）
├── style.css           单页滚动版式
├── deck.js             进度条 / 目录 / 高亮 / 动画 / 放大
├── README.md           本文件
└── assets/
    ├── base.css                      html-ppt 设计系统（令牌 + 基础组件）
    ├── fonts.css                     webfont 引入（离线自动回落）
    ├── animations.css                html-ppt 入场动画
    ├── themes/
    │   └── engineering-whiteprint.css  工程白图主题
    └── images/
        ├── flow-overview.png         整体流程与概念关系
        ├── inference-pipeline.png    推理流程
        ├── gsm8k-flow.png            GSM8K 执行流程
        └── engine-architecture.png   推理引擎架构
```

## 版式说明

- 设计系统来自 **html-ppt**（`base.css` + `engineering-whiteprint` 主题），
  配色、圆角、字体全部走 CSS 变量（`--accent` / `--text-1` / `--border` …），
  想换风格只需替换 `assets/themes/` 下的主题文件并改 `index.html` 里的那一行 `<link>`。
- 原文的 Markdown 表格全部渲染为 HTML 表格；原来无表头的键值表改用**行表头**（左侧深蓝标签列）。
- 原文的列表、引用、结论句分别映射为卡片 / 引用块 / 强调框；三个压测用例各成一张用例卡。
- 整页用 `html-ppt` 的 `anim-*` 入场动画（滚动到视口时触发），
  系统开启「减少动态效果」时自动关闭。

## 重新生成

内容如需更新，改 `index.html` 即可（结构：`section.chapter` → `article.sec` → 内容块）。
新增小节时记得同步：① 顶部导航（如需新章节）② `index.html` 里的目录抽屉列表。
