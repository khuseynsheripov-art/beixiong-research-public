# B1D 北熊本地 Fixture Payload Trace

更新时间：2026-06-24
任务包：`B1D-BEIXIONG-LOCAL-FIXTURE-PAYLOAD-TRACE`

## 摘要

B1D 继续按“北熊 Ozon 上架工具 2.0.8 是用户给到的混淆本地源码样本”处理，没有覆盖原始源码。基于 B1C readable mirror 和动态探针，本轮生成了一个本地 fixture trace，把链路从类目属性一路跑到 Ozon import item JSON。

本轮只调用本仓库本地模块：

```text
category/type attributes
-> buildTemplateMeta
-> buildAiSchema
-> compact AI schema payload
-> splitSchemaPayload
-> sample AI rows
-> normalizeAiRows / sanitizeRowsBySchema
-> draft fields + media placeholders
-> buildAttributesArray
-> buildImportItems JSON
-> failure/manual review table
```

没有做任何真实 Ozon/1688/51 写入、上传、发布、库存/价格变更、订单、付费动作或 provider call。

## 产物

Fixture 目录：

`docs/research/b1c-architecture-mirror/fixture-traces/`

文件：

- `category-attributes.fixture.json`
- `source-rows.fixture.json`
- `trace-output.json`
- `failure-manual-review-table.json`
- `README.md`

生成脚本：

`.workflow/scratch/b1d-local-fixture-trace.mjs`

执行命令：

```powershell
node .workflow\scratch\b1d-local-fixture-trace.mjs
```

结果摘要：

```json
{
  "normalizedRows": 2,
  "importItems": 2,
  "manualReviewRows": 9,
  "noExternalCalls": true
}
```

## Fixture 输入

### 类目与属性

本轮使用脱敏 fixture：

- `descriptionCategoryId: 17028922`
- `typeId: 97031654`
- `categoryTitle: B1D Demo Fixture Category`

类目属性包含：

| 属性 | Ozon id | 类型 | 规则目的 |
| --- | ---: | --- | --- |
| `Название` | 4180 | text | 标题字段，用于 import item `name` |
| `Brand` | 85 | text/dictionary | 品牌字段，观察自动/人工 gate |
| `Color` | 10096 | multi-select dictionary | 验证 `dictionary_value_id` |
| `Material` | 9024 | text | 普通文本属性 |
| `Battery included` | 777001 | select | 人工核对/空选项 gate |

### 样本 AI Rows

两条 AI rows：

- Row 1：标题、合法颜色 `Black`、材质 `steel`、描述、标签。
- Row 2：标题、非法颜色 `Blue`、空材质、描述、含营销/品牌倾向的标签、未知字段。

## Trace 关键发现

### 1. templateMeta

`buildTemplateMeta(categoryAttributes, categoryTitle)` 产出：

- `editorOrder`
- `fieldMeta`
- 注入系统字段：价格、折扣前价格、毛重、包装宽/高/长
- `Название` 被识别为 `_isNameField: true`
- `Color` 带 `_optionIds: { Black: 201, White: 202 }`
- `Brand` 被标为 `_systemFieldType: brand`，但没有进入 AI schema 的 required_text；这导致 fixture 中 Brand 被 schema gate 当未知字段处理，需要人工/实现侧规则确认

### 2. templateMeta -> AI schema payload

`buildAiSchema(templateMeta)` 给出高层 schema 后，B1D 额外构造 compact payload 供 `splitSchemaPayload` 和 `normalizeAiRows` 使用。

重要细节：select 的 compact option 形状必须是：

```json
{ "v": "Black", "i": "" }
```

如果误写成字符串数组 `["Black", "White"]` 或 `{ "value": "Black" }`，`normalizeAiRows` 会把合法选项也判成 invalid。这个是 B1D 比 B1C 更具体的实现参考。

### 3. splitSchemaPayload

`splitSchemaPayload(compactSchemaPayload)` 把字段拆成：

| payload | 字段 |
| --- | --- |
| structuralPayload | `Battery included` |
| multiSelectPayload | `Color` |
| plainTextPayload | `Material` |
| descriptionPayload | `商品简介` |
| tagsPayload | `主题标签` |

### 4. normalize / sanitize

归一化统计：

```text
精确匹配 10，模糊匹配 0，忽略未知字段 3，丢弃无效选项 1，丢弃无效标签 2，丢弃含中文标题 0，丢弃含中文文本 0，自动补值 0，未知key示例 Brand / Brand / UnexpectedField
```

归一化后：

- Row 1 保留 `Название`、`Color: ["Black"]`、`Material`、`商品简介`
- Row 2 保留 `Название`、`商品简介`
- `Blue` 被丢弃
- `Brand` 未进 compact schema，被记录为 unknown key
- 标签被 tag gate 丢弃

### 5. draft fields + media placeholders

Draft 添加了：

- `offerId`
- `rowIndex/sourceSkuIndex`
- 系统字段：价格、折扣前价格、毛重、包装宽/高/长
- 媒体占位：`mainImage`、`extraImages`、`colorSample`、`videoUrl`

媒体全部使用 `https://fixture.invalid/...`，只用于本地结构 trace。

### 6. buildAttributesArray

Row 1 的属性输出包含：

```json
[
  {
    "id": 4180,
    "complex_id": 0,
    "values": [{ "value": "Steel organizer BrandX black" }]
  },
  {
    "id": 10096,
    "complex_id": 0,
    "values": [{ "dictionary_value_id": 201, "value": "Black" }]
  },
  {
    "id": 9024,
    "complex_id": 0,
    "values": [{ "value": "steel" }]
  }
]
```

Row 2 的 `Color` 属性 values 为空，因为 `Blue` 没有通过 schema gate。

### 7. buildImportItems JSON

Row 1 import item 关键字段：

```json
{
  "description_category_id": 17028922,
  "type_id": 97031654,
  "name": "Steel organizer BrandX black",
  "offer_id": "B1D-FIXTURE-1",
  "price": "1290",
  "old_price": "1590",
  "count": 7,
  "weight": 640,
  "depth": 330,
  "width": 220,
  "height": 60,
  "images": [
    "https://fixture.invalid/generated/sku-1-main.jpg",
    "https://fixture.invalid/generated/sku-1-detail-1.jpg",
    "https://fixture.invalid/generated/sku-1-detail-2.jpg"
  ],
  "color_image": "https://fixture.invalid/generated/sku-1-color.jpg",
  "video": ["https://fixture.invalid/generated/sku-1-video.mp4"]
}
```

Row 2 import item 关键差异：

- `count: 0` 来自 source stock fixture
- `weight: 500`，因为草稿毛重为空，触发默认值
- `Color` attribute values 为空
- 无 `video`

## Failure / Manual Review Table

本轮生成 9 条 gate：

| gate | severity | 原因 |
| --- | --- | --- |
| `schema_unknown_keys` | review | Brand/UnexpectedField 被 schema gate 忽略 |
| `invalid_select_values` | block_or_regenerate | `Blue` 不在 Color 字典选项中 |
| `invalid_tag_values` | review | 标签不满足 tag gate |
| `missing_required_draft_field` | block | Brand 缺失 |
| `missing_required_draft_field` | block | Color 缺失或 values 为空 |
| `missing_required_draft_field` | block | Row 2 毛重缺失 |
| `fixture_media_placeholder` | research_only | 媒体 URL 只是 fixture placeholder |

完整表见：

`docs/research/b1c-architecture-mirror/fixture-traces/failure-manual-review-table.json`

## ERP 实现参考

这些点可回流给 ERP/S1D，但不能复制北熊代码：

- Product Workbench 需要保存 `templateMeta` 和 compact schema 两层：前者用于编辑器/upload，后者用于 AI/schema gate。
- select option contract 应支持 `{ v, i }`，并映射回 upload meta 的 `_optionIds`。
- `normalizeAiRows` 的 stats 应成为 preflight/gap matrix 的输入，而不是仅作为日志。
- `Brand` 这类 auto/system 字段不能简单依赖 AI schema；需要产品侧单独决定默认、人工、来源证据或品牌策略。
- import preview 应显式展示 payload 默认值，例如重量默认 500、库存 0、无 video、空 attribute values。
- 媒体对象要在 Product Workbench 里以 provenance/placeholder/selected/generated 状态表达，不能只传 URL 字符串。

## Proves

- B1D 继续了北熊反混淆，不停在 B1C 报告。
- 可以在本地无外部调用地跑出从类目属性到 import item JSON 的 fixture trace。
- `buildTemplateMeta/buildAiSchema/splitSchemaPayload/normalizeAiRows/sanitizeRowsBySchema/buildAttributesArray/buildImportItems` 的关键数据合同已被一条具体 fixture 串起来。
- 发现 compact select option 形状必须使用 `{ v, i }`，否则合法选项会被误判无效。
- 发现 Brand/system 字段可能不进入 AI schema，需要 ERP 自己设计来源和人工 gate。

## Does Not Prove

- 不证明 ERP 已实现北熊能力。
- 不证明真实 Ozon 上传、发布、库存/价格变更、订单、付费动作或平台侧结果。
- 不证明 provider 调用、账号授权、额度、风控或服务端行为。
- 不证明 fixture media 的图片质量、用户接受或平台审核结果。
- 不证明所有真实类目、复杂属性、多店铺、多 SKU 异常都覆盖。

## Open Questions For Orchestrator

- 是否将 `{ v, i }` compact option contract 纳入 S1D/S1E 的字段合同？
- Brand/default brand 是否由 Product Workbench 独立策略处理，还是由 source facts/用户设置填充？
- 对于 import item 里空 `values` 的必填属性，S1D 是阻断 preview，还是允许 research-only preview 并标红？
- Row 2 这种 `stock: 0` 是否作为 preflight warning，还是阻断首版 import preview？

## Next Recommended Task

建议由总编排决定是否开 B1E。若继续北熊支线，优先方向是“复杂属性/视频/多店铺后缀/失败回写 UI 的 fixture trace”，仍不做外部写入。
