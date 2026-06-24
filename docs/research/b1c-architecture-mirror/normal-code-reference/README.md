# B1E Normal Code Reference

This directory is a runnable normal-code reference project derived from the authorized Beixiong Ozon listing tool 2.0.8 research mirror.

It is not ERP product code. It preserves behavior evidence and clean interface shapes so ERP work can translate the behavior into its own implementation.

## Smoke

```powershell
node docs\research\b1c-architecture-mirror\normal-code-reference\tests-or-smoke\fixture-smoke.mjs
```

The smoke uses local fixtures only. It does not call Ozon, 1688, 51, image providers, or any account/write surface.

## Main Flow

```text
SourcePack + FormGroup + Canvas media + category/search signals
-> category template meta
-> AttributeGapMatrixCandidate
-> schema payload
-> AI row normalization
-> draft candidates
-> generated media refs / prompt plan
-> OzonImportItemPreviewCandidate
-> PreflightIssueCandidate
-> UploadIntentCandidate
```
