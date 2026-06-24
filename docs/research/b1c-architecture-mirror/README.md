# B1C Architecture Mirror

本目录是北熊 Ozon 上架工具 2.0.8 的研究用对照镜像，不是 ERP 产品代码，也不是可直接复用源码。

## 目录

- `readable/`：从原始混淆文件生成的格式化副本，路径保持与原仓库相同，便于左右对照。
- `deobfuscation-summary.json`：每个重点文件的大小、原始行数、导出函数、函数名、关键词命中和反混淆尝试摘要。
- `README.md`：本索引。

## 生成方式

脚本：

```powershell
node .workflow\scratch\b1c-deobfuscate-mirror.cjs
```

脚本只读取原始文件并写入本研究目录，不覆盖 `ui/` 或 `services/` 下的原始源码。

## 覆盖范围

本轮重点覆盖：

- `ui/modules/text/*`
- `ui/modules/ozon/*`
- `ui/app/workflows/*`
- `ui/app/services/*image*`
- `ui/app/components/product-editor*`
- `ui/modules/image-generation/*`
- `services/clients/*`
- `services/providers/adapters/*`

## 已知限制

- 本轮自动 decoder 替换尝试没有产生字符串替换结果，`readable/` 是“格式化/分行/索引化镜像”，不是完全还原源码。
- 结论需要结合 `docs/research/2026-06-24-b1c-ast-cfg-field-rule-matrix.md` 里的本地动态探针证据阅读。
- 若遇到凭证、cookie、token、session、完整 headers 或 activation secret，不展开、不保存、不复用。

## 使用方式

先读报告的矩阵，再按模块进入 `readable/` 对照原始混淆文件。关键阅读顺序：

1. `readable/ui/modules/ozon/category-builder.js`
2. `readable/ui/modules/text/schema-payload.js`
3. `readable/ui/modules/text/row-normalizer.js`
4. `readable/ui/modules/ozon/uploader-payload.js`
5. `readable/ui/modules/image-generation/prompt-plan-builder.js`
6. `readable/ui/app/services/draft-sync-service.js`
7. `readable/ui/modules/ozon/api.js`

## Does Not Prove

本镜像不证明真实 Ozon 上传、平台验收、图片质量、ERP 功能完成、商业收益或任何外部写入结果。
