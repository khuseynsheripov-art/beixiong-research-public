# B1B 北熊静态反混淆与数据流地图

任务 ID：`B1B_BEIXIONG_DEOBFUSCATION_DATAFLOW_MAP`

日期：2026-06-24

## 边界

本次只在 `E:\ozon-erp\.worktrees\beixiong-research-public` 本地研究副本内做静态拆解、字符串还原、导出符号扫描和本地 `fetch` mock。未调用外部平台，未使用真实凭证，未提取/保存/打印 token、cookie、session 或完整 headers，未修改 ERP 产品代码，未复制北熊代码进入 ERP。

## 方法与证据强度

- `direct_manifest`：来自 `manifest.json` 的权限、host、资源和 content/background/ui 入口。
- `direct_export`：来自本地 JS 文件的导出函数名、导入路径和可读字符串。
- `mocked_runtime`：在 Node 中动态导入本地模块并 mock `fetch`，只记录 URL path、method 和 body key，不联网、不带真实凭证。
- `decoded_fragment`：从混淆文件的一行压缩代码中可见的解码片段、字段名和 object key。
- `cross_checked_report`：与本地既有报告 `E:\ozon-erp\北熊Ozon上架工具分析报告.md` 交叉确认；此类结论需要后续更完整 AST/CFG 展开提升证据等级。

## 生产能力链

北熊不是一个普通参考仓库，而是一个生产使用的竞品能力样本。当前静态证据支持以下能力链：

1. 源站采集：`content/strategies/*`、`content/*bridge*` 从 1688/淘宝/拼多多页面提取 source raw data、SKU、价格、源类目、主图/详情图。
2. Ozon schema 获取：`ui/modules/ozon/api.js` 封装 Seller API，拉取 Ozon 类目树、类目属性、属性值和属性值搜索。
3. schema 筛选与 AI schema：`ui/modules/ozon/category-builder.js`、`category-ai-schema-builder.js` 处理手填字段、自动管理字段、字典字段、复杂字段和 AI 可用 schema。
4. source/visual/schema payload：`ui/modules/text/source-visual-payload.js` 生成 source payload 与 visual payload；`ui/modules/text/schema-payload.js` 拆分 schema payload。
5. AI 分字段填充：`ui/modules/text/index.js` 的 `runText` 接收 `rawData`、`visualReport`、`schemaPayload`，通过 DashScope/OpenAI-compatible provider 生成 `rows`，再由 `row-normalizer.js` 做 schema 传播、清洗和预览行规范化。
6. Draft 同步：`ui/app/services/draft-sync-service.js` 以 `aiSchema`、`category`、`previousDrafts`、`buildProductDrafts`、`mergeEditableDraftValues` 等状态把 AI rows 合入草稿。
7. 图片链路：`ui/modules/image*`、`ui/modules/image-generation/*`、`ui/app/services/*image*` 组织 source images、referenceUrls、prompt/negativePrompt、providerTaskId、providerModel、generated slots 和人工选择/替换状态。
8. Ozon 上传：`ui/modules/ozon/uploader-payload.js` 将 draft 组装成 `/v3/product/import` items；`ui/modules/ozon/uploader.js` 分批提交并等待结果；`ui/app/workflows/ozon-upload-workflow.js` 处理草稿、多店、图片检查和结果汇总。

## 模块地图

### Source Capture

直接证据：

- `content/strategies/adapter_1688.js`、`adapter_taobao.js`、`adapter_pinduoduo.js` 暴露字符串：`source_url`、`source_platform`、`source_category_path`、`source_category_id`、`main_images`、`detail_images`、`sku_image_url`。
- `content/strategies/pinduoduo/rawdata-normalizer.js` 导出 `buildPddRawDataFromGoods`、`summarizePddRawData`。
- `content/strategies/pinduoduo/source-state-parser.js` 导出 `collectPddGoodsCandidates`、`findBestPddGoodsCandidate`、`analyzePddTextForGoods`。
- `content/strategies/taobao/sku-core-normalizer.js` 导出 `buildTaobaoRawDataFromSkuCore`、`buildTaobaoSkuRowsFromCore`、`hasTrustedTaobaoSkuPrices`。

推断数据对象：

- `SourceRawData`：源站商品、SKU、价格、类目、图片、包装/规格等原始信息。
- `SourcePayload`：供 AI 文案和属性填充使用的压缩事实包。

### Text / AI / Schema

直接证据：

- `ui/modules/text/source-visual-payload.js` 导出 `buildSourcePayload`、`buildCompactSourcePayload`、`buildSourcePayloadForRowIndexes`、`buildSharedProfile`、`buildVisualPayload`。
- 同文件可见字段：`product_description`、`sku_count`、`sku_list`、`sku_diff`、`sku_tips`、`image_text`。
- `ui/modules/text/schema-payload.js` 导出 `splitSchemaPayload`、`isMultiSelectSchemaField`、`countPayloadOptions`、`mergeSchemaPayloads`；可见 payload：`structuralPayload`、`multiSelectPayload`、`plainTextPayload`、`descriptionPayload`、`tagsPayload`。
- `ui/modules/text/index.js` 导出 `runText`、`checkTextAPI`，可见输入/状态：`schemaPayload`、`rawData`、`visualReport`、`generatedRows`、`makeCorrectionPayload`、`tags`、`model`。
- `ui/modules/text/row-normalizer.js` 导出 `normalizeAiRows`、`applySchemaPropagation`、`sanitizeRowsBySchema`、`normalizePreviewRows`。
- `ui/modules/text/json-result-parser.js` 导出 `parseAIResult` 和 JSON 修复函数。

结论：

- 北熊确实存在“source payload + visual payload + Ozon schema payload -> AI rows -> schema 清洗 -> draft”的静态链路。
- 当前证据能证明按 Ozon schema 分字段填充的架构存在；具体 prompt 全文、每个字段的 fallback 规则和所有异常分支仍需后续 AST/CFG 细化。

### Provider / Authorization

直接证据：

- `services/clients/dashscope-client.js` 导出 `requestTextGeneration`、`requestVisionGeneration`、`completeDashScopeResponse`、`streamDashScopeResponse`、`translateImage`；可见 `apiKey`、`model`、`TaskId`、`X-DashScope-Async`、`image_url`、`source_lang`、`providerTaskId`。
- `services/providers/adapters/dashscope-prompt-adapter.js` 导出 `dashscopePromptAdapter`；可见 `requiresApiKey`、`supportsVisionInput`、`Authorization`、`model`。
- `shared/contracts/provider-contracts.js` 导出 `PROVIDER_CAPABILITIES`、`PROVIDER_IDS`、`PROVIDER_SETTINGS_FIELDS`、`IMAGE_API_MODES`、`IMAGE_ASPECT_RATIOS`、`IMAGE_QUALITY_LEVELS`。
- `services/providers/adapters/openai-compatible-image-*`、`wan-image-adapter.js`、`nano-banana-image-adapter.js` 共同证明图片 provider 层支持 OpenAI-compatible、DashScope/Wan 风格异步任务、输入图、轮询和 provider setting。
- `ui/app/services/panel-settings-service.js` 读取/持久化 `xiangjiUserKey`、`xiangjiImgTransKey`、`xiangjiTextTransKey`、`openaiImageApiKey`、`openaiImageBaseUrl`、`imageProviderProfiles`、`ozonClientId`、`ozonApiKey`、`ozonStores`。

安全边界：

- 可分析需要哪些凭证和授权面；不可提取、保存、打印真实凭证值。
- 对 ERP 的启发是“凭证托管、授权测试、能力开关、审计日志、真实写入 gate”，不是复用北熊实现代码。

### Image / Prompt

直接证据：

- `ui/modules/image-generation/generated-image-assets.js` 导出 `buildAiGeneratedSourceEntry`，可见 `providerTaskId`、`providerId`、`providerModel`、`prompt`、`negativePrompt`、`skuRowKeys`。
- `ui/app/services/image-generated-prompt-service.js` 导出 `resolveGeneratedPromptForItem`、`findGeneratedPromptPlanSlot`、`buildGeneratedPromptTitle`。
- `ui/app/services/single-ai-main-source-service.js` 导出 `buildSingleAiMainGenerationRawData`、`collectSingleAiMainReferenceUrls`、`buildSingleAiMainQueueRequest`；可见 `referenceUrls`、`targetSku`、`rawData`、`sku_matr`。
- `ui/app/services/user-selected-ai-image-generation-service.js` 导出 `collectUserSelectedAiReferenceUrls`、`buildUserSelectedAiGenerationRawData`；可见 `main_images`、`detail_images`、`sku_matr`。
- `ui/app/workflows/image-upload-workflow.js` 导出 `runManualImageUploadWorkflow`、`runSharedImageUploadWorkflow`。

结论：

- 北熊有参考图选择、AI 生图/图像任务状态、生成资产入库、人工替换/选择和图片上传前置管理链。
- 生成图质量、Ozon 图片合规和 UI 验收不能由静态分析证明，必须保持 gated。

### Ozon API / Upload

`ui/modules/ozon/api.js` 直接导出：

- `fetchCategoryTree`
- `fetchCategoryAttributes`
- `fetchAttributeValues`
- `searchAttributeValues`
- `submitProductImport`
- `fetchWarehouseList`
- `fetchProductInfoList`
- `fetchAllProducts`
- `fetchProductStocks`
- `updateProductStocks`
- `pollImportResult`

本地 mock `fetch` 记录到的 endpoint：

| Function | Endpoint | Body keys |
| --- | --- | --- |
| `fetchCategoryTree` | `/v1/description-category/tree` | `language` |
| `fetchCategoryAttributes` | `/v1/description-category/attribute` | `description_category_id`, `type_id`, `language` |
| `fetchAttributeValues` | `/v1/description-category/attribute/values` | `description_category_id`, `type_id`, `attribute_id`, `language`, `last_value_id`, `limit` |
| `searchAttributeValues` | `/v1/description-category/attribute/value/search` | `description_category_id`, `type_id`, `attribute_id`, `language`, `value`, `limit` |
| `submitProductImport` | `/v3/product/import` | `items` |
| `fetchWarehouseList` | `/v2/warehouse/list` | none |
| `fetchProductInfoList` | `/v3/product/info/list` | `product_id` |
| `fetchAllProducts` | `/v3/product/list` | `filter`, `last_id`, `limit` |
| `fetchProductStocks` | `/v4/product/info/stocks` | `cursor`, `limit`, `filter` |
| `updateProductStocks` | `/v2/products/stocks` | `stocks` |
| `pollImportResult` | `/v1/product/import/info` | `task_id` |

`ui/modules/ozon/uploader-payload.js` 直接证明 `buildImportItems` 组装 import item，字段包括：

- `description_category_id`
- `type_id`
- `name`
- `offer_id`
- `barcode`
- `price`
- `old_price`
- `premium_price`
- `vat`
- `count`
- `weight`
- `weight_unit`
- `depth`
- `width`
- `height`
- `dimension_unit`
- `attributes`
- `complex_attributes`
- `images`
- `color_image`
- `video`
- `images360`

`ui/modules/ozon/uploader.js` 导出 `uploadToOzon`、`waitForOzonImportResult`，可见 `drafts`、`submittedCount`、`importedCount`、`imported`。`ui/app/workflows/ozon-upload-workflow.js` 导出 `runOzonUploadWorkflow`，可见 `productDrafts`、`categoryInfo`、`draftRows`、`importResult`、`pollResults`、`importStatus`。

结论：

- `/v3/product/import` 的 items 在 `uploader-payload.js` 组装，在 `api.js::submitProductImport` 提交。
- `/v1/product/import/info` 在 `api.js::pollImportResult` 轮询，`uploader.js`/`ozon-upload-workflow.js` 汇总导入状态。
- 当前分析没有证明真实店铺上传成功率、Ozon 后台最终发布状态或我们的 ERP 已具备相同能力。

## 实体映射

| Entity | Evidence | Status |
| --- | --- | --- |
| `SourcePayload` | `buildSourcePayload`、`buildCompactSourcePayload`、source 字段字符串 | proved_architecture |
| `VisualPayload` | `buildVisualPayload`、`visualReport`、`image_text`、`sku_tips` | proved_architecture |
| `OzonSchemaPayload` | `splitSchemaPayload` 与五类 payload | proved_architecture |
| `DraftProduct/DraftSku` | `draft-sync-service.js`、`buildProductDrafts`、`productDrafts`、`draftRows` | proved_architecture |
| `DraftFieldValue` | `normalizeAiRows`、`sanitizeRowsBySchema`、`buildAttributesArray` | proved_partial |
| `PromptPlan` | `prompt`、`negativePrompt`、`findGeneratedPromptPlanSlot`、`buildGeneratedPromptTitle` | proved_architecture |
| `ImageItem` | image item/model imports、`sourceImageId`、`workspaceImageId`、`providerTaskId` | proved_architecture |
| `OzonImportItem` | `buildImportItems` 字段列表 | proved_direct |
| `OzonImportTask` | `task_id`、`pollImportResult`、`waitForOzonImportResult` | proved_direct |
| `ManualReviewGate` | manualOnly/manual search/user-managed field classifiers、draft/workflow UI states | proved_partial |

## ERP 可学习的产品形态

- V2 source 插件应聚焦采集和 source payload 标准化，不应承载完整上品工作台。
- ERP 应有本地/网页工作台草稿箱：source facts、Ozon schema、AI rows、人工修改、图片候选、上传前预检分层呈现。
- Canvas/媒体工作台应承接参考图选择、AI prompt plan、生成图、人工替换、图片合规检查和 upload-ready 状态。
- Ozon API 适配应先实现授权配置、schema cache、字段 dictionary/search、import item preflight、分批提交、轮询和错误回填，而不是直接宣称自动上品。
- 对外能力表达应是“辅助生成草稿/预检/授权上传链路”，不是“已达到北熊生产能力”。

## 必须保持 Gate

- 真实 Ozon/1688/51 写入、上传、库存更新。
- 真实 API key/client id 的输入、保存、打印、传输和审计。
- AI 生成文案的合规性、俄语质量、类目/属性准确率。
- 图片生成质量、图片版权/平台合规、Ozon 图片上传结果。
- 多店铺上传、价格/库存/尺寸默认值的业务责任。
- UI 验收、人工审核点、失败恢复和回滚策略。

## 未证明事项

- 未完整恢复所有混淆函数的 AST/CFG。
- 未证明每一个 Ozon 属性字段的 prompt 规则、字典匹配规则和 fallback 优先级。
- 未证明北熊真实账号的上传成功率、生成图质量、平台审核通过率。
- 未证明三方授权服务 `123.57.239.211:3000` 的完整业务边界；当前只把它视为 activation/trial/device/update/oss policy 相关线索。
- 未证明 ERP 侧已有同等能力。

## 建议下一任务

建议 B1C 做受控 AST/CFG 展开：只对 `ui/modules/text/index.js`、`ui/modules/ozon/category-builder.js`、`ui/modules/ozon/uploader-payload.js`、`ui/app/services/draft-sync-service.js` 做格式化副本和调用图，不覆盖原始文件；输出“字段规则矩阵 + 手填 gate 矩阵 + draft merge 规则”。完成后再由总编排决定是否转入 ERP 产品合同设计。
