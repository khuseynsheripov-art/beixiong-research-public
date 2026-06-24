# B1E Normal Code Reference And ERP Interfaces

Updated: 2026-06-24

Task packet: `B1E-BEIXIONG-NORMAL-CODE-REFERENCE-AND-ERP-INTERFACES`

## Summary

B1E treats the Beixiong Ozon listing tool 2.0.8 input as an authorized obfuscated/minified local code sample supplied for analysis. The work continued from the B1C readable mirror and B1D reference project, but moved the main deliverable from reports/traces into a runnable normal-code reference project:

`docs/research/b1c-architecture-mirror/normal-code-reference/`

This project contains clean ESM modules with stable names, importable exports, fixture inputs, a smoke runner, output JSON, file mapping, and ERP interface reservations. Original Beixiong source files were not modified.

## Normal-Code Project

Key paths:

- `normal-code-reference/src/`
- `normal-code-reference/contracts/erp-contracts.js`
- `normal-code-reference/fixtures/reference-fixture.mjs`
- `normal-code-reference/tests-or-smoke/fixture-smoke.mjs`
- `normal-code-reference/output/b1e-smoke-output.json`
- `normal-code-reference/file-map.yaml`
- `normal-code-reference/erp-interface-map.yaml`

Main flow:

```text
SourcePack + FormGroup + Canvas media + category/search signals
-> buildCategoryTemplateMeta
-> buildAttributeGapMatrixCandidate
-> buildAiSchemaFromGapMatrix / splitSchemaPayload
-> normalizeAiRows / sanitizeRowsBySchema
-> buildDraftCandidates
-> buildPromptPlanCandidate / buildGeneratedImageAssetRef
-> buildImportPreviewCandidates
-> createUploadIntentCandidate
```

## Smoke Result

Command:

```powershell
node docs\research\b1c-architecture-mirror\normal-code-reference\tests-or-smoke\fixture-smoke.mjs
```

Observed output:

```json
{
  "noExternalCalls": true,
  "output": "docs\\research\\b1c-architecture-mirror\\normal-code-reference\\output\\b1e-smoke-output.json",
  "templateFields": 11,
  "attributeGapFields": 4,
  "normalizedRows": 2,
  "draftCandidates": 2,
  "importPreviewCandidates": 2,
  "preflightIssues": 4,
  "uploadIntentIssues": 5,
  "readyForLiveWrite": false
}
```

This proves the normal-code reference project is locally runnable and that its upload intent remains blocked by default. It does not prove live Ozon upload, provider behavior, image quality, or ERP readiness.

## Priority File Normalization

| Original Beixiong file | Normal-code file | Grade |
| --- | --- | --- |
| `ui/modules/ozon/category-builder.js` | `src/ozon/category-template.js` | `behavior_verified_by_fixture` |
| `ui/modules/ozon/category-ai-schema-builder.js` | `src/ai/attribute-gap-matrix.js` | `behavior_verified_by_fixture` |
| `ui/modules/text/schema-payload.js` | `src/ai/schema-payload.js` | `behavior_verified_by_fixture` |
| `ui/modules/text/row-normalizer.js` | `src/ai/row-normalizer.js` | `behavior_verified_by_fixture` |
| `ui/modules/ozon/uploader-payload.js` | `src/ozon/import-preview.js` | `behavior_verified_by_fixture` |
| `ui/app/services/draft-sync-service.js` | `src/draft/draft-merge.js` | `behavior_verified_by_fixture` |
| `ui/modules/image-generation/prompt-plan-builder.js` | `src/media/prompt-plan.js` | `behavior_verified_by_fixture` |
| `ui/modules/image-generation/generated-image-assets.js` | `src/media/generated-assets.js` | `behavior_verified_by_fixture` |
| `ui/modules/ozon/api.js` | `src/ozon/ozon-api-contract.js` | `proof_gap` |
| `ui/modules/ozon/uploader.js` | `src/ozon/upload-intent.js` | `proof_gap` |

Full function-level mapping is in:

`docs/research/b1c-architecture-mirror/normal-code-reference/file-map.yaml`

The two `proof_gap` grades are intentional: API and uploader behavior are represented as descriptors and a blocked upload intent because B1E forbids live Ozon writes and credential handling.

## ERP Interface Reservations

Reserved inputs:

- `BeixiongReferenceSourcePackInput`
- `BeixiongReferenceFormGroupInput`
- `BeixiongReferenceCanvasMediaBridge`
- `BeixiongReferenceCategorySignalInput`
- `BeixiongReferenceSelectionSignalInput`

Reserved outputs:

- `AttributeGapMatrixCandidate`
- `OzonImportItemPreviewCandidate`
- `PreflightIssueCandidate`
- `UploadIntentCandidate`

Full interface map:

`docs/research/b1c-architecture-mirror/normal-code-reference/erp-interface-map.yaml`

The normal code is intentionally shaped around ERP assets: SourcePack, FormGroup/shape groups, Canvas media, category/search signals, and future selection/profit/3D signals. This keeps the reference useful for ERP design without importing Beixiong implementation details into ERP.

## Evidence

- B1C readable mirror: `docs/research/b1c-architecture-mirror/readable/`
- B1D module index: `docs/research/b1c-architecture-mirror/module-index.json`
- B1D port map: `docs/research/b1c-architecture-mirror/port-map/erp-port-map.md`
- B1D accepted ingest: `E:\ozon-erp\.worktrees\erp-orchestrator\docs\research\2026-06-24-orch-3-b1d-receipt-ingest.md`
- B1E normal code: `docs/research/b1c-architecture-mirror/normal-code-reference/src/`
- B1E smoke output: `docs/research/b1c-architecture-mirror/normal-code-reference/output/b1e-smoke-output.json`

## Proves

- The B1E normal-code project is importable and runnable locally.
- Ten priority Beixiong files now have normal-code counterparts, function mappings, dependencies, behavior evidence, and completion grades.
- The local fixture flow reaches category template, AI schema, row cleaning, draft candidates, media refs, import preview, preflight issues, and upload intent.
- ERP-facing interfaces are reserved without editing ERP code.
- No external writes, provider calls, credentials, cookies, tokens, sessions, complete headers, or activation secrets were used.

## Does Not Prove

- ERP has implemented or replicated Beixiong behavior.
- Any real Ozon/1688/51 upload, publish, stock/price mutation, order, payment, provider call, or account-side action occurred.
- Ozon platform acceptance, seller readiness, listing readiness, image quality, profit, or actionability.
- Complex attributes, grouped/aspect fields, multi-store suffixes, and real import polling results.
- The normal-code reference is suitable for direct copy into ERP. It is implementation reference evidence only.

## Open Questions

- Whether ERP should adopt compact option `{ v, i }` as the internal AI-option handoff shape.
- Whether missing required attributes should block import preview or only block upload intent.
- How brand/default-brand policy should be owned across SourcePack, user choice, and category requirements.
- Which next packet should expand coverage: complex attributes, real polling fixtures, multi-store suffixes, or Canvas/media quality lanes.

## Next Recommended Task

Park after receipt and let `erp-orchestrator` ingest B1E. Do not self-dispatch B1F.
