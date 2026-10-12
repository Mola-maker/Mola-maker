# Mola 动态 GitHub Profile

这一版使用你最终选定的第一版角色：蓝色 OC、浅蓝白耳机、背后的吉他与原来的裙长。背景是淡蓝天空和粉蓝晚霞云。

## 文件

- `README.md`：可直接放入同名公开仓库的 Profile 文案。
- `assets/hero.svg`：自包含的桌面动态横幅，包含云彩漂移、角色轻微起伏、漂浮音符和声波动画。
- `assets/hero-mobile.svg`：窄屏竖版，避免把角色和标题一同缩成很小的图片。
- `assets/hero-still.svg` 与 `hero-mobile-still.svg`：减少动态效果偏好下的静态版本。
- `assets/hero.gif`：24 秒循环的兼容预览，也可替换 README 中的头图。
- `assets/oc-headphones-guitar.png`：第一版角色的原始透明 PNG。
- `assets/badges/`：18 个带图标或文字的技术标签，已保存为本地 SVG。
- `assets/snake.svg` 与 `snake-dark.svg`：基于 2026 年 10 月 12 日公开贡献快照生成的 Snake，支持明暗主题。
- `.github/workflows/snake.yml`：自动更新 Snake 的 Actions 配置。
- `scripts/build-banner.mjs`：动态与静态头图的源代码，用 Node.js 运行即可重新生成 SVG，无须安装依赖。
- `preview.html`：本地预览，解压后保持目录结构，用浏览器打开。

## 放到 GitHub

1. 在公开同名仓库 `Mola-maker/Mola-maker` 的根目录放入 `README.md`、`assets/`、`scripts/` 和 `.github/`。上传时保留目录结构，包括隐藏的 `.github` 目录。
2. 本地素材已经齐全，第一次展示无需等待工作流。
3. 在 Actions 中手动运行一次 **Refresh pastel snake**，核对生成结果。随后工作流计划每天北京时间 03:17 刷新；GitHub 的定时任务可能延迟。
4. 工作流使用 GitHub 自动提供的 `GITHUB_TOKEN`，无需手工添加个人 Token。仓库策略需允许 Actions 向默认分支提交；若分支保护拒绝提交，请按仓库策略调整更新方式。

GitHub README 不运行 JavaScript。这里的动态横幅使用 SVG 动画，图片中的角色是内嵌 PNG；技术标签和 Snake 都通过普通图片标签展示。SVG 不含脚本，也不依赖外部字体、图片或接口。

如果某个客户端无法播放动态 SVG，将 README 的头图 `assets/hero.svg` 改为 `assets/hero.gif`；保留现有 SVG 和静态素材方便切换。GIF 是桌面版兼容预览，移动版仍可保留 SVG。

## 技术标签与内容

标签包括 Python、TypeScript、JavaScript、C++、React、Next.js、Node.js、Docker、Linux、Git、Agent Harness、MCP、TikZ，以及放在持续学习栏中的 Rust、PyTorch、LoRA、FPGA、AI Infra。沿用 Anka 的 `for-the-badge` 形式，并依据你的简历和项目选择内容。

Snake 使用 [Platane/snk](https://github.com/Platane/snk) 的官方 SVG 路径求解与绘制逻辑；蓝色贡献格、粉色蛇与深色版本的配色在工作流中设置。初始快照读取 [Mola-maker 的公开贡献记录](https://github.com/users/Mola-maker/contributions)，不包括对私有仓库活动的额外访问。

## 角色生成记录

使用内置 `imagegen`，参考你站点现有 OC，生成耳机和背吉他的新插画。后续提出的加长裙摆版本没有用于本套素材；最终采用第一版。

生成提示词的核心要求：保留参考图中的蓝色长发、蓝眼睛、柔和脸部、粉色腮红与浅蓝白衣服；三分之二背身回望，戴浅蓝白头戴耳机；六弦电吉他通过肩带背在背后，琴身和琴头可见；安静听歌；透明背景，无文字、水印或其他角色。完整提示词保存在 `PROMPT.txt`。

生成素材用于个人 Profile。Profile README 和动画素材由此仓库维护。Bio 与置顶顺序可以独立调整；Snake 的更新状态见仓库 Actions。

参考：[Anka Profile](https://github.com/anka-afk/anka-afk) · [你的个人简历](https://molamaker.cn/about) · [GitHub Profile README 文档](https://docs.github.com/en/account-and-profile/how-tos/profile-customization/managing-your-profile-readme)
