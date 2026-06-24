# Web Deep Research Request B1E: Beixiong Normal-Code Reference Review

Use this repository as GitHub-connected evidence for ChatGPT Web Deep Research.

If multiple similarly named repositories are selected, prefer the repository that contains this file:

```text
WEB_DEEP_RESEARCH_REQUEST_B1E.md
```

## Context

This repository is a public research mirror for the author-provided Beixiong Ozon listing tool sample. The local Codex branch has produced B1C/B1D/B1E research artifacts:

- B1C: readable/deobfuscated mirror and field/image/upload matrices.
- B1D: local fixture payload trace, runnable reference wrapper, and ERP port map.
- B1E: runnable `normal-code-reference` project with ERP interface reservations.

The goal is not to prove that Ozon ERP already works. The goal is to critique the recovered Beixiong chain and advise how Ozon ERP should translate the useful behavior into its own Product Workbench contracts.

## Primary Evidence Paths

Read these first:

```text
docs/research/2026-06-24-b1e-normal-code-reference-and-erp-interfaces.md
docs/research/b1c-architecture-mirror/normal-code-reference/README.md
docs/research/b1c-architecture-mirror/normal-code-reference/file-map.yaml
docs/research/b1c-architecture-mirror/normal-code-reference/erp-interface-map.yaml
docs/research/b1c-architecture-mirror/normal-code-reference/output/b1e-smoke-output.json
```

Then use these as supporting evidence:

```text
docs/research/2026-06-24-b1d-deep-deobfuscation-mirror-and-payload-trace.md
docs/research/b1c-architecture-mirror/module-index.json
docs/research/b1c-architecture-mirror/port-map/erp-port-map.md
docs/research/b1c-architecture-mirror/port-map/behavior-classification.yaml
docs/research/2026-06-24-b1c-ast-cfg-field-rule-matrix.md
docs/research/b1c-architecture-mirror/fixture-traces/trace-output.json
```

Optional raw/reference evidence:

```text
docs/research/b1c-architecture-mirror/readable/
docs/research/b1c-architecture-mirror/reference-project/
```

## Known Local Verification

The local orchestrator accepted B1E after rerunning:

```text
node docs\research\b1c-architecture-mirror\normal-code-reference\tests-or-smoke\fixture-smoke.mjs
```

The smoke output reported:

```text
noExternalCalls=true
readyForLiveWrite=false
templateFields=11
attributeGapFields=4
normalizedRows=2
draftCandidates=2
importPreviewCandidates=2
preflightIssues=4
uploadIntentIssues=5
```

Treat this as local fixture evidence only. It is not proof of real Ozon listing.

## Research Questions

1. What is the recovered Beixiong production-like chain from category/schema to draft/import preview/upload intent?
2. Which B1E normal-code modules are strong enough to translate into Ozon ERP Product Workbench contracts?
3. Which behaviors should be translated, not copied, into ERP-owned objects?
4. Which gaps should become B1F deep-deobfuscation tasks?
5. Which gaps should become ERP implementation tasks?
6. Should ERP adopt the compact option shape like `{ v, i }` for AI/select-option contracts?
7. Should missing required attributes block preview, block upload intent only, or trigger regenerate/manual-review before preview?
8. Where should brand/default-brand policy live: SourcePack, user settings, template metadata, or AI fill?
9. Does Canvas media receipt need to come before the next Product Workbench UI/API smoke?
10. Is `listing-core` needed now, or should it stay paused until Product Workbench contracts stabilize?

## Required Report Style

Write the report in Chinese.

Use this method:

```text
证据路径 -> 推断 -> 不确定点
```

Do not only summarize. Challenge the assumptions.

## Required Output Sections

1. Executive summary for the ERP chairman
2. Evidence map: path -> observed responsibility -> confidence
3. Recovered Beixiong chain
4. B1E normal-code module review
5. ERP interface review: SourcePack / FormGroup / Canvas media / category-search / selection-profit-3D / AttributeGapMatrix / ImportPreview / Preflight / UploadIntent
6. What ERP should translate directly into its own contracts
7. What ERP should not copy
8. What is still missing before a real listing flow
9. Recommended next packet among S1E / C1D / B1F / L1A
10. Open questions and proof gaps

## Hard Boundaries

- Do not claim ERP automatic listing works.
- Do not claim Ozon upload/publish/platform pass.
- Do not claim image quality, UI acceptance, seller-ready, listing-ready, profit, or actionability.
- Do not attempt to use credentials, cookies, tokens, sessions, complete headers, account data, or live provider/API calls.
- Treat B1E normal-code as a reference artifact; recommend translating useful behavior into ERP-owned code and contracts.
