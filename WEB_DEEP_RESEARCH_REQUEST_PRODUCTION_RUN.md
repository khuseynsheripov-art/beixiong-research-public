# Web Deep Research Request: Beixiong Production-Run Normal Code

> ERP reserved-interface context: also read `ERP_RESERVED_INTERFACE_PREVIEW_FOR_WEB.md`.
> That file is only the final-section mapping frame. The first priority remains Beixiong production-run normal-code recovery.

请用中文输出报告。

这次研究的第一目标不是设计我们的 ERP 接口，而是判断北熊这份授权研究仓库里的反混淆/normal-code 产物，距离“跑回北熊原本生产阶段”还差什么。

请把仓库当作公开研究输入和授权样本，不要把它当成 Ozon ERP 产品代码主线。

## 研究对象

- Web 可见 fork：`https://github.com/likterdslikterds-ux/beixiong-research-public`
- 上游公开镜像：`https://github.com/khuseynsheripov-art/beixiong-research-public`
- 最低需要看到的 commit：包含本文件 `WEB_DEEP_RESEARCH_REQUEST_PRODUCTION_RUN.md` 的最新 commit。
- 如果 fork 还没同步，请先提示需要同步上游后再分析。

## 总目标

请围绕这个目标分析：

> 按代码文件逐个深度反混淆，把北熊混淆代码整理成正常代码，形成可直接运行、可导入、可继续开发的 normal-code project，并尽量走到北熊原本生产链路阶段。

这里的“生产链路阶段”不是让你做真实外部写入，而是确认代码结构、入口、模块调用、字段填充、媒体生成、导入 payload、上传/轮询边界是否已经被恢复到可以本地 dry-run、fixture-run、mock-run 的程度。

## 必读路径

优先阅读：

- `manifest.json`
- `WEB_DEEP_RESEARCH_REQUEST_B1E.md`
- `docs/research/2026-06-24-b1f-complex-attributes-import-polling-and-media-gaps.md`
- `docs/research/b1c-architecture-mirror/README.md`
- `docs/research/b1c-architecture-mirror/readable/`
- `docs/research/b1c-architecture-mirror/normal-code-mirror/`
- `docs/research/b1c-architecture-mirror/normal-code-mirror/file-trace-map.yaml`
- `docs/research/b1c-architecture-mirror/normal-code-mirror/behavior-parity-report.yaml`
- `docs/research/b1c-architecture-mirror/normal-code-reference/`
- `docs/research/b1c-architecture-mirror/normal-code-reference/file-map.yaml`
- `docs/research/b1c-architecture-mirror/normal-code-reference/erp-interface-map.yaml`
- `docs/research/b1c-architecture-mirror/normal-code-reference/output/`
- `docs/research/b1c-architecture-mirror/normal-code-reference/tests-or-smoke/`

如果仓库里已经包含 B1G 相关文件，也请一并阅读：

- `docs/research/2026-06-24-b1g-remaining-normal-code-mirror.md`
- `docs/research/b1c-architecture-mirror/normal-code-reference/output/b1g-mirror-parity-output.json`
- `docs/research/b1c-architecture-mirror/normal-code-reference/tests-or-smoke/b1g-remaining-mirror-parity-smoke.mjs`

如果这些 B1G 文件不存在，请明确报告：Web 当前只能看到 B1F/B1E 阶段，不能审查 B1G 完整覆盖。

## 重点问题

### 1. normal-code-mirror 是否真的逐文件不丢功能

请检查：

- original/readable 文件和 `normal-code-mirror` 是否路径一一对应。
- 每个 mirror 文件是否只是 prettier/重命名，还是已经恢复出可理解的职责、导出、调用边和数据转换。
- `behavior-parity-report.yaml` 的 parity-backed / proof_gap 分类是否可信。
- 哪些文件仍然是 proof_gap，为什么不能证明行为一致。
- 是否还有 readable-only 文件没有进入 mirror。

输出时请用表格列出：

- 文件路径
- 原始职责推断
- mirror 职责
- 导出符号是否对齐
- 调用边是否对齐
- fixture/smoke 是否覆盖
- 结论：parity-backed / proof_gap / readable-only / missing

### 2. normal-code-reference 是否像一个可运行项目

请检查：

- `package.json` 是否提供可复跑 smoke 命令。
- `tests-or-smoke/` 是否覆盖字段、媒体、导入 payload、上传意图、轮询/失败处理。
- `output/*.json` 是否能作为稳定证据。
- 模块是否可以被其他代码 import。
- 哪些模块还只是研究脚本，不算可继续开发的 project 模块。

请特别判断：

- 当前 normal-code-reference 能不能本地 dry-run。
- 能不能用 fixture 模拟一条完整链路。
- 能不能作为后续开发的 normal-code project 基础。
- 如果不能，缺哪些入口文件、配置、fixture、mock adapter、导出面和测试。

### 3. 北熊原本生产链路恢复到哪一步

请用大白话画出链路，不要只讲架构名词：

1. 用户采集/导入货源数据。
2. 选择或识别 Ozon 类目。
3. 获取/构造 Ozon schema 和属性字段。
4. AI 或规则填充标题、描述、属性、SKU、价格等字段。
5. 处理图片、参考图、生成图、套图或媒体资产。
6. 形成草稿或导入预览。
7. 组装 Ozon import/upload payload。
8. 发起上传意图。
9. 轮询/解析导入结果。
10. 失败分类、人工复核、重试。

对每一步标注：

- 仓库里已经恢复的证据路径。
- 当前是 runnable / dry-run only / mock only / proof_gap / missing。
- 若要跑到北熊原本生产阶段，还缺什么。

### 4. 真实生产运行还缺哪些安全边界

请不要要求或使用真实凭证。只分析如果未来合法授权运行，需要哪些边界：

- 凭证注入方式。
- cookie/token/session/headers 的禁止输出和脱敏规则。
- provider 调用边界。
- Ozon 上传/导入/发布边界。
- dry-run 到 live-run 的开关条件。
- 错误回滚和人工确认点。

### 5. 我们 ERP 只需要预留接口，不是第一优先级

第一版目标仍然是北熊 normal-code 跑回生产链路。ERP 接口只作为“以后接入时别堵死”的预留。

请只在最后一节做 ERP 预留接口映射，按这些接口判断即可：

- `SourcePack`：采集来的货源事实、SKU、图片、价格、供应商、证据。
- `FormGroup`：我们自己的形态组，减少人工逐个 SKU 分组。
- `ProductWorkbenchItem`：ERP 中央工作台对象，串采集、字段、媒体、预检、上传意图。
- `AttributeGapMatrix`：字段缺口矩阵。
- `ImportPreview`：上传前导入预览，不代表真实上传。
- `CanvasMediaBridge` / `MediaSuiteDraft`：图片、视频、套图、可编辑媒体层。
- `PreflightResult`：本地预检，不等于平台通过。
- `UploadIntentCandidate`：未来 Ozon 上传意图，当前必须 dry-run only。

请判断：

- 哪些北熊模块未来可映射到这些接口。
- 哪些只适合作为规则参考。
- 哪些不应该复制进 ERP。
- 哪些接口现在还不重要，可以先不阻塞北熊 production-run 恢复。

## 报告格式

请按这个结构输出：

1. 执行摘要：北熊 normal-code 距离“可运行、可导入、可继续开发、可 dry-run 原生产链路”还差什么。
2. 文件级 mirror 审计表。
3. normal-code-reference 可运行性审计。
4. 北熊原生产链路恢复图。
5. 当前可 dry-run 的链路和不能 live-run 的原因。
6. 缺口清单：入口、模块、fixture、mock adapter、配置、测试、凭证边界、上传/轮询边界。
7. ERP 预留接口映射：放在最后，不要喧宾夺主。
8. 下一步建议：如果继续反混淆/正常代码化，最该补哪 5 个任务。

## 禁止和边界

- 不要声明 Ozon ERP 已经自动上品可用。
- 不要声明北熊 live 上传、导入、发布、平台通过已经成立。
- 不要声明生成图质量、UI、seller-ready、listing-ready、profit、actionability 已验收。
- 不要提取、复用或输出任何密钥、cookie、token、session、完整 headers 或账号敏感信息。
- 不要建议把北熊闭源实现直接复制进 ERP。
- 不要把 proof_gap 写成已证明。
- 如果你只能看到 B1F，不能看到 B1G，请明确说明“只能审查 B1F 可见产物”。
