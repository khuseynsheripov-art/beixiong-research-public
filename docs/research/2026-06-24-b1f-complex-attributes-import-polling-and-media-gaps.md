# B1F Complex Attributes Import Polling And Media Gaps

Updated: 2026-06-24

Task packet: `B1F-BEIXIONG-COMPLEX-ATTRIBUTES-IMPORT-POLLING-AND-MEDIA-GAPS`

## Summary

B1F continues the authorized Beixiong normal-code work from B1E. The goal was not another broad analysis report; it was to extend the runnable `normal-code-reference` project with the production-risk areas left open by B1E:

- complex attributes and grouped `complex_id` payload rows
- import polling/result mapping
- multi-store/store suffix helpers
- account/import/provider failure taxonomy
- media/provider proof gaps

All work stayed under `docs/research/` and `.workflow/`. Original author-provided Beixiong files were not overwritten. No live Ozon/API/provider/account call was made.

## Direction Correction: Path-Matched Mirror

During B1F, the shape was corrected: `normal-code-reference/` is the runnable/importable composition project, but it cannot replace a path-matched mirror.

B1F therefore adds:

- `docs/research/b1c-architecture-mirror/normal-code-mirror/`
- `docs/research/b1c-architecture-mirror/normal-code-mirror/file-trace-map.yaml`

Mirror coverage:

- readable focus files total: 40
- B1F priority files counted: 15
- B1F priority files with `normal-code-mirror`: 15
- B1F priority files still only readable: 0
- overall readable focus files still only readable: 25
- B1F priority files with live-behavior proof gap: 4

All 15 mirror JS files were dynamically imported by Node. The mirror files preserve original relative paths and each file header records original path, readable path, related normal-code-reference modules, confidence, and proof gaps.

## Behavior Parity Evidence

B1F adds explicit behavior parity evidence because a prettier-only or rename-only file is not accepted as deobfuscation completion.

Command:

```powershell
node docs\research\b1c-architecture-mirror\normal-code-reference\tests-or-smoke\b1f-mirror-parity-smoke.mjs
```

Observed output:

```json
{
  "noExternalCalls": true,
  "priorityFiles": 15,
  "parityBackedNormalCodeMirror": 11,
  "proofGapMirrorFiles": 4,
  "priorityReadableOnly": 0,
  "overallReadableOnly": 25,
  "exportMappingFailures": 0,
  "parityCallEdgeFailures": 0
}
```

Parity artifacts:

- `docs/research/b1c-architecture-mirror/normal-code-reference/output/b1f-mirror-parity-output.json`
- `docs/research/b1c-architecture-mirror/normal-code-mirror/behavior-parity-report.yaml`

The parity smoke records, per priority file:

- export symbol mapping
- call-edge/import mapping to `normal-code-reference`
- fixture input/output comparison where locally provable
- explicit `proof_gap` where live API/provider/account/UI behavior cannot be proven without forbidden external actions

## Added Normal-Code Modules

| Module | Purpose |
| --- | --- |
| `src/ozon/complex-attributes.js` | Builds complex attribute row previews and missing grouped-value issues. |
| `src/ozon/import-results.js` | Maps import task result rows to imported/failed/manual-review/processing status and issues. |
| `src/ozon/store-upload-context.js` | Normalizes store suffix helpers and ERP ownership classification. |
| `src/ozon/failure-taxonomy.js` | Maps account/import/provider failures to `PreflightIssueCandidate` classes. |
| `src/media/provider-proof-gaps.js` | Records provider polling, request, generated asset, and Canvas acceptance proof gaps. |

Fixture and smoke:

- `fixtures/advanced-reference-fixture.mjs`
- `tests-or-smoke/b1f-fixture-smoke.mjs`
- `output/b1f-smoke-output.json`

Path-matched mirror examples:

- `ui/modules/ozon/uploader.js` -> `normal-code-mirror/ui/modules/ozon/uploader.js`
- `ui/modules/text/row-normalizer.js` -> `normal-code-mirror/ui/modules/text/row-normalizer.js`
- `ui/app/services/draft-sync-service.js` -> `normal-code-mirror/ui/app/services/draft-sync-service.js`
- `services/providers/adapters/openai-compatible-image-polling.js` -> `normal-code-mirror/services/providers/adapters/openai-compatible-image-polling.js`

## Smoke Result

Command:

```powershell
node docs\research\b1c-architecture-mirror\normal-code-reference\tests-or-smoke\b1f-fixture-smoke.mjs
```

Observed output:

```json
{
  "noExternalCalls": true,
  "output": "docs\\research\\b1c-architecture-mirror\\normal-code-reference\\output\\b1f-smoke-output.json",
  "complexGroups": 2,
  "complexAttributeRows": 4,
  "storeContexts": 2,
  "importResultRows": 4,
  "failureCases": 7,
  "mediaProofGaps": 5,
  "preflightIssues": 12,
  "readyForLiveWrite": false
}
```

Expanded counts from `b1f-smoke-output.json`:

- `complexAttributeDrafts=2`
- `storeMappedDrafts=4`
- `importImported=1`
- `importFailed=1`
- `importManualReview=1`
- `failureClasses=7`
- `mediaProviderTasks=3`

## ERP Interface Additions

B1F updates `erp-interface-map.yaml` with concrete additions:

- `ComplexAttributeGroupCandidate`
- `ComplexAttributePreviewIssue`
- `ImportPollingResultCandidate`
- `StoreUploadContextCandidate`
- `StoreScopedUploadIntentCandidate`
- `PreflightIssueCandidateFailureTaxonomy`
- `CanvasMediaProviderProofGapCandidate`

ERP should translate these into Product Workbench / Preflight / UploadIntent / CanvasMediaBridge contracts. It should not copy Beixiong code into ERP runtime.

## Evidence Basis

- Store suffix helpers are visible in `readable/ui/modules/ozon/store-upload-helpers.js`.
- Upload submit/poll aggregation is visible in `readable/ui/modules/ozon/uploader.js`.
- Ozon API import/poll surfaces are visible in `readable/ui/modules/ozon/api.js`.
- Provider polling/status surfaces are visible in `readable/services/providers/adapters/openai-compatible-image-polling.js`.
- Generated image state/status surfaces are visible in `readable/ui/modules/image-generation/generated-image-state.js`.
- B1F fixture smoke exercises the normal-code equivalents without external calls.

## Proves

- The B1E normal-code-reference project was extended instead of replaced.
- A path-matched `normal-code-mirror/` exists for 15 B1F priority files and all mirror JS files import successfully.
- 11 priority mirror files are parity-backed by export mapping, call-edge mapping, and fixture IO evidence; 4 are explicitly marked proof_gap.
- Complex attributes can be represented locally as grouped rows with `complex_id`, nested attribute ids, dictionary ids, and missing-required issues.
- Import polling can be modeled locally as per-offer result rows and mapped to imported/failed/manual-review/processing states.
- Multi-store suffix behavior can be represented as ERP-owned store upload context.
- Failure taxonomy can feed `PreflightIssueCandidate` and `UploadIntentCandidate` design.
- Media/provider lanes can be represented as proof-gap descriptors without provider calls.

## Does Not Prove

- ERP automatic listing works.
- Any real Ozon upload, publish, import success, stock/price change, order, payment, provider call, or account-side action occurred.
- Ozon platform acceptance, seller readiness, listing readiness, image quality, Canvas UI acceptance, profit, or actionability.
- Real provider response quality, quota, risk, or authorization behavior.
- Real-world coverage for every complex attribute, store configuration, or import polling edge case.

## Risks

- Fixtures are local and deliberately de-identified.
- Complex attributes are modeled as reference behavior; real categories may contain additional nested/aspect/group variants.
- Import polling remains descriptor/local-result mapping only.
- Provider proof gaps intentionally do not include live request bodies, credentials, or headers.

## Next

Park after receipt and let `erp-orchestrator` ingest B1F. Do not self-dispatch B1G.
