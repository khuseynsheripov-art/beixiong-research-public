# B1C 北熊 Ozon 上架工具 2.0.8 AST/CFG/字段规则矩阵

更新时间：2026-06-24
任务包：`B1C-BEIXIONG-AST-CFG-FIELD-RULE-MATRIX`

## 结论摘要

本轮按“北熊 Ozon 上架工具 2.0.8 是混淆过的本地源码样本”处理：原始文件不覆盖，另建 `docs/research/b1c-architecture-mirror/` 做对照镜像、格式化副本、模块索引和证据矩阵。

静态与本地动态探针共同证明：北熊前端/本地模块内存在一条“类目属性 -> AI 字段 schema -> 行级 AI 结果规范化 -> 草稿编辑/同步 -> 图片生成/选择 -> Ozon import item -> import submit/poll”的生产链路。它不是单一按钮魔法，而是一组可分层复刻的规则模块、草稿状态和上传 payload 组装器。

本轮不证明真实 Ozon 账号侧上传成功、不证明图片质量达标、不证明 ERP 已具备同等能力，也不证明任何商业或平台验收结论。

## 证据等级

| 等级 | 含义 |
| --- | --- |
| `direct_static` | 直接读取原始混淆源码、manifest、既有 B1B 产物。 |
| `formatted_static` | 从原始文件生成的可读镜像副本；仅用于阅读，不替换原文件。 |
| `direct_dynamic_probe` | 本地导入纯函数或构造函数形状的探针；未调用外部平台。 |
| `inferred` | 由调用关系、命名、导出和相邻流程推断，仍需后续样本/运行态验证。 |
| `unknown` | 当前证据不足。 |

## 反混淆镜像

生成脚本：`.workflow/scratch/b1c-deobfuscate-mirror.cjs`

输出目录：

- `docs/research/b1c-architecture-mirror/readable/`
- `docs/research/b1c-architecture-mirror/deobfuscation-summary.json`
- `docs/research/b1c-architecture-mirror/README.md`

本轮处理了 40 个重点文件。原始重点文件多为单行混淆文件，例如 `ui/modules/text/index.js` 为 191758 bytes、1 行、约 10424 个 `_0x` 标记。镜像脚本完成了分行格式化、导入/导出/函数名/关键词索引；字符串 decoder 替换尝试未成功产生替换，因此镜像不是“完全还原源码”，而是“格式化对照镜像 + 运行探针证据”。

## 架构镜像

| 层 | 关键文件 | 作用 | 证据 |
| --- | --- | --- | --- |
| 入口/流程 | `ui/app/workflows/run-workflow.js`, `refine-workflow.js`, `ozon-upload-workflow.js` | 采集/生成/修正/上传流程编排 | `formatted_static` |
| 文本 AI schema | `ui/modules/text/schema-payload.js`, `category-ai-schema-builder.js` | 拆分 schema、构造 AI 可填字段 | `direct_dynamic_probe`, `formatted_static` |
| 来源/视觉 payload | `ui/modules/text/source-visual-payload.js` | 构建源商品、视觉摘要、共享 profile | `formatted_static` |
| AI 结果清洗 | `ui/modules/text/row-normalizer.js`, `json-result-parser.js` | JSON 修复、字段匹配、选项校验、数字归一 | `direct_dynamic_probe` |
| Ozon 类目规则 | `ui/modules/ozon/category-builder.js`, `field-semantics.js` | 属性保留、字典属性、自动/人工字段、系统字段 | `direct_dynamic_probe`, `formatted_static` |
| 草稿编辑/同步 | `ui/app/components/product-editor*.js`, `draft-sync-service.js` | 草稿字段、offerId、价格警告、草稿合并 | `formatted_static`, `inferred` |
| 图片生成 | `ui/modules/image-generation/*`, `ui/app/services/*image*` | 提示词计划、参考图、AI 图资产、主图/选图服务 | `direct_dynamic_probe`, `formatted_static` |
| Provider | `services/clients/dashscope-client.js`, `services/providers/adapters/*` | 文本/视觉/图像请求、OpenAI-compatible 请求和轮询 | `formatted_static` |
| Ozon API/上传 | `ui/modules/ozon/api.js`, `uploader-payload.js`, `uploader.js` | 类目/属性/字典值查询、import payload、submit/poll | `direct_dynamic_probe`, `formatted_static` |

## CFG/调用主链

```text
fetchCategoryTree / fetchCategoryAttributes / fetchAttributeValues
-> shouldKeepCategoryAttribute / getDictionaryAttributeIds / buildTemplateMeta
-> buildAiSchema / splitSchemaPayload
-> buildSourcePayload / buildVisualPayload
-> runText / parseAIResult / normalizeAiRows / sanitizeRowsBySchema
-> buildSyncedProductDraftState / renderProductEditor / applyDraftFieldChange
-> buildPromptPlanPlannerInput / runAiProductImageGeneration / generated image assets
-> resolveProductDraftSyncResult
-> buildImportItems / buildAttributesArray
-> submitProductImport / pollImportResult / waitForOzonImportResult
```

这条链路中的外部写入节点只作为静态调用面识别，本轮没有执行。

## 字段规则矩阵

| 字段类别 | 主要模块/函数 | 输入来源 | 处理规则 | 上传前 gate | 证据 |
| --- | --- | --- | --- | --- | --- |
| 类目/类型 | `fetchCategoryTree`, `fetchCategoryAttributes`, `buildTemplateMeta` | Ozon 类目树、属性表 | `descriptionCategoryId/typeId` 最后映射为 `description_category_id/type_id` | 缺类目/类型会导致 import item 不完整 | `direct_dynamic_probe` |
| 必填属性 | `shouldKeepCategoryAttribute`, `buildTemplateMeta` | Ozon attributes | 先过滤保留属性，再按 required/group/id 排序，生成 `editorOrder/fieldMeta` | 草稿编辑器可定位首个缺失必填字段 | `formatted_static` |
| 字典属性 | `getDictionaryAttributeIds`, `mergeAttributeValues` | `dictionary_id` 和 values | 有字典且非自动/人工/用户托管时拉取字典值，`_optionIds` 用于 `dictionary_value_id` | 值不在 options 时上传属性会跳过并 warn | `direct_dynamic_probe` |
| 多选属性 | `schema-payload`, `row-normalizer`, `buildAttributesArray` | AI rows、schema options | 多选最多保留合法选项；字符串可拆为数组；上传生成多个 `values` | 无合法值时可跳过或补空值 | `direct_dynamic_probe` |
| 普通文本 | `row-normalizer`, `buildAttributesArray` | AI 结果、人工编辑 | 去空、按 schema 保留；上传为 `{ value }` | 未知 key 被忽略 | `direct_dynamic_probe` |
| 数字/包装 | `row-normalizer`, `uploader-payload` | AI 结果、草稿字段、rawData packaging | 数字 coercion；重量/长宽高默认 `500/300/200/100`，重量单位 g、尺寸单位 mm | 负数/非法数格式化为 `0` 或默认值 | `direct_dynamic_probe` |
| 标题/name | `field-semantics`, `buildTemplateMeta`, `uploader-payload` | Ozon name 属性、draft fields | `_isNameField` 被识别后作为 import `name`，fallback 到 offerId | 空标题会 fallback，不等于可直接上架 | `direct_dynamic_probe` |
| 品牌 | `field-semantics`, `uploader-payload` | AI/人工字段、默认品牌规则 | 品牌字段有专门语义识别；默认品牌值会被过滤避免误写 | 字典值不合法则跳过 | `formatted_static` |
| 自动管理字段 | `isAutoManagedAttribute`, `buildTemplateMeta` | Ozon 属性名/type/dictionary | 自动字段通常 `frontendHidden`，values 被清空，不给 AI/人工乱填 | 上传时缺 `_ozonAttributeId` 或不可编辑会跳过 | `formatted_static` |
| 人工字段 | `isManualOnlyAttribute`, `shouldTreatAsManualOnlyAttribute` | 属性名/type/id | 标记 `manualOnly`，前端隐藏或保留为人工核对 | 不作为 AI 自动填充依据 | `formatted_static` |
| 用户托管字段 | `isUserManagedAttribute` | 属性名/type/id | 不进入字典自动拉取集合 | 需要人工/业务规则确认 | `formatted_static` |
| 复杂属性 | `buildAttributesArray` | `_complexId` | 上传属性包含 `complex_id` | `complex_attributes` 当前静态为 `[]`，复杂属性仍需样本验证 | `direct_dynamic_probe`, `unknown` |

动态探针确认的 `buildAttributesArray` 输出形状：

```json
[
  { "id": 4180, "complex_id": 0, "values": [{ "value": "Demo SKU title" }] },
  { "id": 85, "complex_id": 0, "values": [{ "dictionary_value_id": 101, "value": "BrandX" }] },
  { "id": 10096, "complex_id": 0, "values": [
    { "dictionary_value_id": 201, "value": "Black" },
    { "dictionary_value_id": 202, "value": "White" }
  ] }
]
```

## AI 字段与清洗链路

`splitSchemaPayload` 会把 schema 拆成结构字段、多选字段、普通文本、描述、标签等分组。探针中 `color` 进入 multi-select，`description` 进入 description，`tags` 进入 tags，普通字段分流到 plain text。

`normalizeAiRows` 探针确认：

- 未知 key 被忽略；
- 无效 select/tag 被丢弃；
- 数字字符串可 coercion；
- 标题/中文/商业词过滤存在计数位；
- 清洗统计可格式化为中文摘要。

这说明北熊不是把 LLM 输出直接上传，而是在 AI 输出和草稿之间有 schema gate。

## 图片链路矩阵

| 环节 | 模块/函数 | 规则/输出 | 证据 |
| --- | --- | --- | --- |
| 商品上下文 | `buildProductContext` | 包含 source facts、Ozon rules、`mustNotInvent` | `direct_dynamic_probe` |
| 规划输入 | `buildPromptPlanPlannerInput`, `buildPromptPlanPlannerRequest` | 输出 schemaVersion `2.0`、SKU hero/gallery 计数、`aspectRatio: 3:4` | `direct_dynamic_probe` |
| 直接生成计划 | `buildDirectImagePromptPlan` | 生成 `sku_main_image` 计划、参考图 URL、mustKeep/mustAvoid、输出合同 | `direct_dynamic_probe` |
| 风控/约束 | prompt plan | 不新增配件/套装、不改结构材质颜色、不捏造 logo/认证/质保/性能、不加水印/促销/联系方式 | `direct_dynamic_probe` |
| Provider 适配 | `dashscope-client`, `openai-compatible-image-request`, `openai-compatible-image-polling` | DashScope 文本/视觉/图像；OpenAI-compatible JSON/multipart/polling | `formatted_static` |
| 生成资产 | `buildAiGeneratedSourceEntry` | 生成 `sourceType: ai_generated`、scope、providerTaskId、prompt、skuRowKeys | `direct_dynamic_probe` |
| 主图/参考图服务 | `single-ai-main-source-service`, `user-selected-ai-image-generation-service` | 存在参考图收集、rawData 注入、队列/slot 状态 | `formatted_static`, 部分 `direct_dynamic_probe` |
| 上传媒体 | `buildImportItems` | `media.mainImage + media.extraImages -> images`；`colorSample -> color_image`；`videoUrl -> video` | `direct_dynamic_probe` |

动态探针确认 import item 媒体输出：

```json
{
  "images": ["https://img.example/main.jpg", "https://img.example/side.jpg"],
  "color_image": "https://img.example/color.jpg",
  "video": ["https://video.example/v.mp4"],
  "images360": []
}
```

## 上传链路矩阵

| 环节 | 模块/函数 | 输入 | 输出/动作 | 证据 |
| --- | --- | --- | --- | --- |
| 草稿选择 | `sku-upload-selection`, `buildImportItems` | drafts | 仅上传 enabled draft | `formatted_static` |
| import item | `buildImportItems` | draft fields/media、templateMeta、categoryInfo、rawData | Ozon import item | `direct_dynamic_probe` |
| 属性数组 | `buildAttributesArray` | `editorOrder/fieldMeta` + draft fields | `attributes: [{ id, complex_id, values }]` | `direct_dynamic_probe` |
| 价格/库存 | `uploader-payload` | draft price fields、rawData stock | `price/old_price/count`，默认 price `0`、stock `999` | `direct_dynamic_probe` |
| 包装 | `uploader-payload` | draft system fields、rawData packaging | `weight/depth/width/height` 默认值 | `direct_dynamic_probe` |
| 提交 | `submitProductImport`, `uploadToOzon` | import items | `/v3/product/import` 调用面 | `formatted_static` |
| 轮询 | `pollImportResult`, `waitForOzonImportResult` | task/import id | import result 状态映射 | `formatted_static` |
| 库存相关 | `fetchProductStocks`, `updateProductStocks` | product/warehouse data | 存在库存读写调用面 | `formatted_static`，未执行 |

动态探针确认 `buildImportItems` 的关键输出：

```json
{
  "description_category_id": 17028922,
  "type_id": 97031654,
  "name": "Demo SKU title",
  "offer_id": "OFFER-1",
  "price": "0",
  "count": 7,
  "weight": 640,
  "weight_unit": "g",
  "depth": 300,
  "width": 200,
  "height": 100,
  "dimension_unit": "mm",
  "attributes": "...see field matrix...",
  "complex_attributes": [],
  "images360": []
}
```

## 草稿合并/编辑规则

| 主题 | 关键模块 | 观察 |
| --- | --- | --- |
| 字段编辑 | `product-editor.js`, `product-editor-field-model.js` | 存在 `applyDraftFieldChange`, `patchProductEditorChange`, `getEditableFieldKeys`, `findFirstMissingRequiredDraftField`。 |
| offerId/SKU | `product-editor-field-model.js`, `store-upload-helpers.js` | 存在 SKU prefix、offerId 构造、多店铺后缀辅助。 |
| 草稿同步 | `draft-sync-service.js` | 存在定价模板、图片 export context、draft sync result、pricing warning 汇总。 |
| 合并优先级 | `mergeEditableDraftValues`, `buildSyncedProductDraftState` | 证据显示会保留/合并可编辑草稿值，但精确优先级仍需 UI 状态样本验证。 |

## Ozon API 面

B1B 与 B1C 静态证据共同识别到这些 API 面：

- `/v1/description-category/tree`
- `/v1/description-category/attribute`
- `/v1/description-category/attribute/values`
- `/v1/description-category/attribute/value/search`
- `/v3/product/import`
- `/v1/product/import/info`
- warehouse/product/stock 相关查询与库存更新调用面

本轮未执行任何真实外部调用。

## Proves

- 北熊 2.0.8 本地样本可以作为混淆源码研究对象，且可建立对照镜像目录分析。
- 存在 Ozon 类目属性到 AI schema，再到草稿字段，再到 Ozon import item 的完整本地组装链。
- `buildTemplateMeta` 是字段合同中心，产出 `editorOrder/fieldMeta` 和自动/人工/字典/系统字段标记。
- `normalizeAiRows` 在 AI 输出进入草稿前做 schema 清洗，而不是裸传 LLM 输出。
- 图片链路包含参考图、提示词计划、provider adapter、生成资产和 upload media 绑定。
- `buildImportItems/buildAttributesArray` 可在本地无外部调用下生成 Ozon import payload 的核心结构。

## Does Not Prove

- 不证明 ERP 已实现或复刻北熊能力。
- 不证明任何真实 Ozon 上传、发布、库存变更、订单、付款或平台侧结果。
- 不证明生成图片质量、用户可接受性或平台审核通过。
- 不证明服务端 provider 的真实返回、额度、风控或账号权限。
- 不证明复杂属性、多店铺、多 SKU、异常重试在所有真实样本中都正确。
- 不证明商业收益、可运营性或可交付状态。

## Open Questions For Orchestrator

- 是否需要 B1D 专门用样本跑“真实类目属性 JSON -> templateMeta -> AI schema -> draft -> import payload”的端到端本地 fixture？
- 是否需要把本轮字段规则矩阵拆给 V2 插件做“字段合同/清洗器”设计，而不是复制北熊实现？
- 是否需要 Canvas/图片支线单独吸收 prompt plan 的约束清单和参考图优先级？
- 是否需要后续任务专门验证复杂属性、视频字段、库存更新边界和失败回写 UI？

## Risks

- 镜像脚本未完全解码所有字符串，局部控制流仍需结合动态探针确认。
- 本地探针使用人工构造的最小对象，不能覆盖真实 Ozon 类目的所有属性形态。
- 静态看到 API 调用面容易被误读为真实能力已通过平台验证，必须继续保持研究证据边界。
- Provider 与账号授权逻辑可能在服务端或运行环境中，当前只证明客户端/本地调用面。

## Next Recommended Task

建议下一包为 `B1D-BEIXIONG-LOCAL-FIXTURE-PAYLOAD-TRACE`：选 1 个用户认可的北熊样本或脱敏类目属性 fixture，只在本地跑完整 trace，产出字段前后对照表、图片输入输出占位、import payload JSON、失败/人工核对点，不做外部写入。
