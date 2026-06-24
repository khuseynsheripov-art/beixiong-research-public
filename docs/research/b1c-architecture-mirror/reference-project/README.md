# B1D Runnable Reference Project

This is a local research wrapper around the Beixiong Ozon Listing Tool 2.0.8 modules.

It does not copy Beixiong code into ERP. It imports the local research-copy modules in this repository and emits fixture outputs for comparison and port-map analysis.

## Run

```powershell
node docs\research\b1c-architecture-mirror\reference-project\src\pipeline.mjs
```

Output:

- `output/reference-output.json`

## Flow

```text
fixture category attributes
-> buildTemplateMeta
-> buildAiSchema
-> compact schema payload
-> splitSchemaPayload
-> normalizeAiRows / sanitizeRowsBySchema
-> draft fields + fixture media
-> buildAttributesArray
-> buildImportItems
-> manual review gates
```

## Boundaries

- No real Ozon/1688/51 calls.
- No provider calls.
- No credentials, cookies, tokens, sessions, full headers, or activation secrets.
- No ERP/source-plugin-v2/Canvas edits.
- Fixture media uses `https://fixture.invalid/...` placeholders.
