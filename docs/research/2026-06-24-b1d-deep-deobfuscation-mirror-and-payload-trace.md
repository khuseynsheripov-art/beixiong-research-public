# B1D Deep Deobfuscation Mirror And Payload Trace

更新时间：2026-06-24
任务包：`B1D-BEIXIONG-LOCAL-FIXTURE-PAYLOAD-TRACE`

## Direction Correction

本轮是 B1D 内部方向纠偏，不是新开 B1E。

董事长进一步澄清后，B1D 不再只理解为“写一份 fixture trace 报告”。新的 B1D 目标是把北熊 Ozon 上架工具 2.0.8 当作作者给到的混淆/压缩本地代码，继续维护一套可对照、可运行、可研究的参考项目：

```text
original obfuscated source
-> path-matched readable mirror
-> module responsibility index
-> runnable local reference project
-> fixture/probe outputs
-> ERP port map
```

原始文件保持不动。本轮只在 `docs/research/` 和 `.workflow/` 写研究产物。

## Added Artifacts

在窄版 B1D fixture trace 基础上，新增：

- `docs/research/b1c-architecture-mirror/module-index.json`
- `docs/research/b1c-architecture-mirror/reference-project/`
- `docs/research/b1c-architecture-mirror/reference-project/src/pipeline.mjs`
- `docs/research/b1c-architecture-mirror/reference-project/output/reference-output.json`
- `docs/research/b1c-architecture-mirror/port-map/erp-port-map.md`
- `docs/research/b1c-architecture-mirror/port-map/behavior-classification.yaml`
- `.workflow/scratch/b1d-direction-change-notice.yaml`

原有 B1D fixture trace 继续保留：

- `docs/research/b1c-architecture-mirror/fixture-traces/trace-output.json`
- `docs/research/b1c-architecture-mirror/fixture-traces/failure-manual-review-table.json`

## Mirror Structure

| Layer | Path | Purpose |
| --- | --- | --- |
| Path-matched readable mirror | `docs/research/b1c-architecture-mirror/readable/` | Preserve original relative paths and readable formatted files. |
| Module index | `docs/research/b1c-architecture-mirror/module-index.json` | Map original file -> readable file -> responsibility -> exports -> ERP candidate owner. |
| Fixture traces | `docs/research/b1c-architecture-mirror/fixture-traces/` | Store local input/output JSON and manual-review gates. |
| Runnable reference project | `docs/research/b1c-architecture-mirror/reference-project/` | Run local Beixiong modules through the fixture pipeline. |
| ERP port map | `docs/research/b1c-architecture-mirror/port-map/` | Separate behavior to borrow, translate, reject, and proof gaps. |

## Runnable Reference Project

Run command:

```powershell
node docs\research\b1c-architecture-mirror\reference-project\src\pipeline.mjs
```

Observed output:

```json
{
  "output": "docs\\research\\b1c-architecture-mirror\\reference-project\\output\\reference-output.json",
  "normalizedRows": 2,
  "importItems": 2,
  "manualReviewRows": 7
}
```

The reference project imports local Beixiong modules:

- `ui/modules/ozon/category-builder.js`
- `ui/modules/text/schema-payload.js`
- `ui/modules/text/row-normalizer.js`
- `ui/modules/ozon/uploader-payload.js`

It does not call Ozon, 1688, 51, provider APIs, or any external write surface.

## Recovered Production-Like Chain

```text
category fixture
-> buildTemplateMeta
-> buildAiSchema
-> compact schema payload
-> splitSchemaPayload
-> sample AI rows
-> normalizeAiRows
-> sanitizeRowsBySchema
-> draft fields
-> fixture media
-> buildAttributesArray
-> buildImportItems
-> manual review gates
```

This is not a full clean-room rewrite of Beixiong. It is a runnable research harness that proves the local chain shape and exposes port decisions for ERP.

## Module Responsibility Index

Key recovered module responsibilities:

| Original | Responsibility | ERP Candidate Owner |
| --- | --- | --- |
| `ui/modules/ozon/category-builder.js` | Ozon category attributes to template metadata; field flags; dictionary ids; manual/auto/user-managed gates. | Product Workbench field-contract service |
| `ui/modules/ozon/category-ai-schema-builder.js` | Template metadata to AI-fill schema categories. | AI Fill adapter / AttributeGapMatrix |
| `ui/modules/text/schema-payload.js` | Split compact AI schema payload into structural, multi-select, plain text, description, tags. | AI schema planner |
| `ui/modules/text/row-normalizer.js` | Normalize AI rows against schema; drop unknown/invalid values; produce stats. | DraftFieldValue normalizer / PreflightResult |
| `ui/modules/ozon/uploader-payload.js` | Draft fields and media to Ozon import item JSON. | ImportPreview builder |
| `ui/modules/ozon/uploader.js` | Submit import items and wait for import result. | External-write adapter behind explicit gate |
| `ui/modules/ozon/api.js` | Ozon category, attribute, product, import, warehouse, stock API surfaces. | Approved Ozon API adapter |
| `ui/modules/image-generation/prompt-plan-builder.js` | Product context and image prompt plan contracts. | Canvas/Product Workbench media planning |
| `ui/modules/image-generation/generated-image-assets.js` | Generated image source entry metadata. | ProductWorkbenchMediaRef provenance |
| `ui/app/services/draft-sync-service.js` | Draft sync, pricing warning, media export context. | ProductWorkspaceItem draft lifecycle |

Full index:

`docs/research/b1c-architecture-mirror/module-index.json`

## ERP Port Map Summary

### Borrow As Behavior

- Category attributes become `templateMeta` with `editorOrder`, `fieldMeta`, required flags, dictionary ids, system field types, hidden/manual flags.
- AI-facing compact schema is distinct from upload-facing template metadata.
- AI rows pass through a schema gate before draft/upload.
- Select options use compact `{ v, i }` objects for AI validation and `_optionIds` for upload mapping.
- Draft media maps to `images`, `color_image`, optional `video`.
- Import preview should expose defaults and empty values as preflight evidence.

### Translate Into Our Own ERP Implementation

- `templateMeta.fieldMeta` -> typed `ProductWorkspaceFieldContract`.
- `normalizeAiRows` stats -> `PreflightIssue[]`.
- Freeform draft fields -> `ProductWorkspaceItem` + typed `DraftFieldValue`.
- Media URL strings -> `ProductWorkbenchMediaRef` with provenance.
- Upload builder -> ERP-owned import preview builder, no live write before explicit gate.

### Do Not Bring Into ERP

- Obfuscation scaffolding and decoder code.
- Browser-extension credential/cookie/debugger assumptions.
- Direct provider headers/endpoints.
- Direct code copy from Beixiong modules.
- Silent fallback values that appear valid without visible preflight warning.

### Still Needs Proof

- Complex attributes and grouped/aspect fields.
- Brand/default-brand strategy.
- Multi-store offer suffix behavior.
- Import polling/result mapping.
- Image quality and user acceptance.
- External-write gate behavior.

Full map:

`docs/research/b1c-architecture-mirror/port-map/erp-port-map.md`

## New Concrete Findings Since Narrow B1D

1. `module-index.json` now makes the mirror consumable by ERP/S1D without searching through all readable files.
2. `reference-project/src/pipeline.mjs` is a runnable research harness, not only a report.
3. Compact select option shape `{ v, i }` remains a critical contract: if represented as strings or `{ value }`, valid options can be rejected.
4. Brand/system fields need explicit ERP ownership; they can be absent from AI schema while still required by business/product policy.
5. Empty attribute values are visible in payload and should become preflight blocks/warnings in ERP, not hidden defaults.

## Commands Run

```powershell
node .workflow\scratch\b1d-local-fixture-trace.mjs
node docs\research\b1c-architecture-mirror\reference-project\src\pipeline.mjs
Get-Content -Raw docs\research\b1c-architecture-mirror\reference-project\output\reference-output.json | ConvertFrom-Json
```

## Proves

- B1D continued beyond a narrow fixture trace into a deep deobfuscation mirror with module index, runnable reference project, and ERP port map.
- The local reference project can run Beixiong module chain without external calls and emit research output.
- The mirror now has a clear original -> readable -> responsibility -> ERP candidate owner mapping.
- The port map gives S1D/orchestrator immediate implementation input while preserving the “do not copy Beixiong code” boundary.

## Does Not Prove

- ERP has implemented or replicated Beixiong behavior.
- Any real Ozon/1688/51 write, upload, publish, stock/price change, order, payment, or provider call occurred.
- Provider authorization, quota, or risk behavior works.
- Generated image quality, user acceptance, or platform-side review outcome is proven.
- The mirror is a complete clean-room rewrite of every Beixiong file.

## Next

Park after receipt. Do not self-dispatch B1E. If the orchestrator wants more, the next bounded packet should target complex attributes, video/multimedia lanes, multi-store offer suffixes, import polling/result fixtures, or UI failure feedback.
