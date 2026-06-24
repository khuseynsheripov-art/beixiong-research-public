# ERP Reserved Interface Preview for Web Research

请用中文输出报告。

这份文件只给 Web Deep Research 一个“我们 ERP 未来要接什么资产”的对照框架。它不是当前第一版实现目标，也不是最终合同定稿。

第一版主线仍然是：先判断北熊授权反混淆 / normal-code 产物能不能尽量跑回北熊原本的生产链路。ERP 接口只放在报告最后一节做预留映射，不要喧宾夺主。

## 研究用法

Web 在审计北熊仓库时，请对每个关键模块最后回答三件事：

1. 这个北熊模块未来可能接 ERP 哪个输入对象。
2. 这个北熊模块未来可能产出 ERP 哪个输出候选。
3. 它更适合“复刻成 normal-code 能力”、“只作为规则参考”，还是“不应该复制进 ERP”。

不要因为看到这些接口名，就把研究方向改成 ERP interface-first。当前优先级仍是北熊 production-run normal-code。

## ERP 输入资产预览

### 1. SourcePackInput

含义：我们采集来的货源事实包。

典型字段：

```ts
type SourcePackInput = {
  sourcePackId: string;
  sourcePlatform: "1688" | "manual" | "other";
  sourceUrl?: string;
  title?: string;
  description?: string;
  supplier?: {
    name?: string;
    shopUrl?: string;
    location?: string;
  };
  price?: {
    min?: number;
    max?: number;
    currency?: string;
  };
  skus: Array<{
    sourceSkuId: string;
    name?: string;
    attributes?: Record<string, string>;
    price?: number;
    stock?: number;
    imageRefs?: string[];
  }>;
  media: Array<{
    mediaId: string;
    kind: "main_image" | "gallery_image" | "sku_image" | "video" | "detail_image";
    url?: string;
    localPath?: string;
    sourceSkuId?: string;
  }>;
  evidence: Array<{
    kind: "page_snapshot" | "ocr" | "vlm" | "manual_note";
    ref: string;
    confidence?: number;
  }>;
};
```

Web 观察点：北熊的导入、图片读取、SKU 行解析、标题/描述/属性填充模块，未来哪些可以吃这个输入。

### 2. FormGroupInput

含义：我们自己的“形态组”。它的价值是减少北熊那种让用户一个个挑 SKU 分组的摩擦。

典型字段：

```ts
type FormGroupInput = {
  formGroupId: string;
  sourcePackId: string;
  axes: Array<{
    axisName: "color" | "size" | "model" | "bundle" | "material" | string;
    values: string[];
  }>;
  skuLinks: Array<{
    sourceSkuId: string;
    groupKey: string;
    axisValues: Record<string, string>;
  }>;
  groupingMethod: "auto" | "semi_auto" | "manual";
  confidence?: number;
};
```

Web 观察点：北熊 SKU 分组、变体、属性行、Ozon offer/item 组装处，未来是否能由 FormGroup 直接喂进去。

### 3. CategorySearchIntent

含义：我们对类目、搜索词、标题方向、标签方向的候选信号。

典型字段：

```ts
type CategorySearchIntent = {
  productType?: string;
  ozonCategoryCandidates: Array<{
    categoryId?: string;
    categoryName?: string;
    confidence?: number;
    evidenceRef?: string;
  }>;
  searchKeywords: string[];
  titleHints: string[];
  tagHints?: string[];
  locale?: "ru" | "zh" | "en";
};
```

Web 观察点：北熊类目选择、schema 获取、属性模板构建、关键词/标题提示词模块，哪些可以用这些信号提前减人工。

### 4. CanvasMediaBridge / MediaSuiteDraftRef

含义：Canvas 是我们更高级的媒体工作区，不只是“生成图片”。它可能管理主图、图库、色图、视频、套图和可编辑层。

典型字段：

```ts
type CanvasMediaBridge = {
  mediaSuiteDraftId: string;
  sourcePackId?: string;
  mainImageRef?: string;
  galleryImageRefs: string[];
  skuImageRefs?: Record<string, string[]>;
  videoRefs?: string[];
  generatedSetRefs?: string[];
  editableLayerRefs?: string[];
  rightsState?: "unknown" | "source_provided" | "generated" | "manual_review_required";
  receiptRefs?: string[];
};
```

Web 观察点：北熊生图、参考图、套图、图片上传 payload、图片校验模块，未来哪些能接 Canvas 资产，而不是只用货源原图。

### 5. SelectionSignalBundle

含义：未来三维选品、利润、搜索热度、竞争信号的预留入口。当前第一版不阻塞上品链。

典型字段：

```ts
type SelectionSignalBundle = {
  sourcePackId: string;
  profitability?: {
    estimatedCost?: number;
    estimatedPrice?: number;
    marginRate?: number;
  };
  demandSignals?: Array<{
    kind: "keyword" | "category" | "trend" | "competitor";
    value: string;
    score?: number;
  }>;
  riskSignals?: Array<{
    kind: "brand" | "restricted_category" | "low_margin" | "unknown";
    message: string;
  }>;
};
```

Web 观察点：只判断北熊哪里未来可能接选品信号；不要把这块当当前必须实现。

## ERP 中央对象预览

### ProductWorkbenchItem

含义：ERP 工作台里的中心商品对象。它把采集、形态组、媒体、类目、字段、预检和上传意图串起来。

```ts
type ProductWorkbenchItem = {
  workbenchItemId: string;
  sourcePackRef: string;
  formGroupRef?: string;
  canvasMediaBridgeRef?: string;
  categorySearchIntentRef?: string;
  selectedSkuIds?: string[];
  attributeGapMatrixRef?: string;
  importPreviewRef?: string;
  preflightResultRef?: string;
  uploadIntentRef?: string;
  operatorReviewState: "draft" | "needs_review" | "preflight_passed" | "blocked";
};
```

Web 观察点：北熊如果有“草稿/编辑器/导入预览/上传准备”的中心对象，未来可能映射到 ProductWorkbenchItem；如果没有，也要说明它现在是散落在什么模块里。

## ERP 输出候选预览

### AttributeGapMatrixCandidate

含义：字段缺口矩阵。告诉我们哪些 Ozon 属性有值、没值、需要人工确认、来源是什么。

```ts
type AttributeGapMatrixCandidate = {
  categoryId?: string;
  rows: Array<{
    attributeId?: string;
    attributeName: string;
    required?: boolean;
    value?: string | number | boolean | string[];
    source: "source_pack" | "form_group" | "ai" | "rule" | "manual" | "unknown";
    confidence?: number;
    issue?: "missing" | "ambiguous" | "invalid_format" | "needs_manual_review";
  }>;
};
```

### ImportPreviewCandidate

含义：上传前的 Ozon 导入/上传 payload 预览。它不是实际上传成功证明。

```ts
type ImportPreviewCandidate = {
  categoryId?: string;
  offerId?: string;
  title?: string;
  description?: string;
  price?: number;
  skuRows?: unknown[];
  attributes?: unknown[];
  mediaRefs?: string[];
  payloadPreview?: unknown;
  readyForLiveWrite: false;
};
```

### PreflightResult / PreflightIssueCandidate

含义：本地预检结果。它只能证明我们本地发现了什么问题，不等于平台通过。

```ts
type PreflightResult = {
  status: "pass" | "warn" | "block";
  issues: Array<{
    code: string;
    severity: "info" | "warn" | "block";
    message: string;
    fieldPath?: string;
    suggestedFix?: string;
  }>;
};
```

### UploadIntentCandidate

含义：未来 Ozon 上传/导入意图。当前必须 dry-run only。

```ts
type UploadIntentCandidate = {
  target: "ozon_import" | "ozon_product_update" | "ozon_media_upload";
  payloadRef?: string;
  preflightResultRef?: string;
  dryRun: true;
  liveWriteAllowed: false;
  requiresCredentialGate: true;
  requiresHumanConfirm: true;
};
```

## Web 最后一节要回答的问题

请把 ERP 接口映射放到报告最后，并用表格回答：

| 北熊模块/文件 | 当前职责推断 | 可能接入的 ERP 输入 | 可能产出的 ERP 候选 | 适合复刻/参考/不复制 | 缺口 |
| --- | --- | --- | --- | --- | --- |

重点判断：

- 北熊哪些模块能帮助我们更快恢复“采集 -> 类目/schema -> 属性填充 -> 图片/生图 -> import preview -> upload intent”的链路。
- 北熊哪些规则可以作为生产标杆。
- 北熊哪些闭源/混淆实现不应该直接复制进 ERP，只能作为行为参考。
- 哪些 ERP 接口现在只需要预留，不应该阻塞北熊 production-run normal-code。

## 边界

- 不要声明 ERP 自动上品已经可用。
- 不要声明 Ozon 上传、导入、发布或平台通过已经成立。
- 不要要求或输出 cookie、token、session、完整 headers、账号密钥。
- 不要把 `UploadIntentCandidate` 写成真实上传。
- 不要把 `PreflightResult` 写成平台验收。
- 不要把 Canvas 媒体能力写成已被北熊证明。
- 不要把选品/利润/三维选品写成当前第一版必需项。
