# B1D ERP Port Map

Purpose: translate Beixiong research behavior into ERP implementation guidance without copying Beixiong code.

## Borrow As Behavior

| Beixiong behavior | Evidence | ERP candidate owner |
| --- | --- | --- |
| Category attributes become `templateMeta` with `editorOrder`, `fieldMeta`, required flags, dictionary ids, system field types, hidden/manual flags. | `category-builder.js`, fixture trace | Product Workbench field-contract service |
| AI-facing compact schema is separate from upload-facing template meta. | `buildAiSchema`, `splitSchemaPayload` | AttributeGapMatrix / AI Fill adapter |
| AI rows pass through schema gate before draft/upload. | `normalizeAiRows`, `sanitizeRowsBySchema` | PreflightResult / DraftFieldValue normalizer |
| Select options use compact `{ v, i }` objects for AI validation and `_optionIds` for upload mapping. | B1D probe | Field option contract |
| Draft media maps to `images`, `color_image`, optional `video`. | `buildImportItems` fixture | ProductWorkbench media bridge |
| Import preview should show payload defaults such as weight fallback and empty attribute values. | B1D trace row 2 | ImportPreview / PreflightResult |

## Translate Into Our Own Implementation

| Beixiong surface | Translate to ERP |
| --- | --- |
| `templateMeta.fieldMeta` | Typed `ProductWorkspaceFieldContract` with stable ids, source provenance, option contract, and review policy. |
| `normalizeAiRows` stats | `PreflightIssue[]` with severity, owner, and user-facing resolution action. |
| Draft objects with freeform fields | `ProductWorkspaceItem` + typed `DraftFieldValue` map. |
| Fixture media URL strings | `ProductWorkbenchMediaRef` with provenance: source, generated, selected, placeholder. |
| Upload payload builder | ERP-owned import preview builder, no live write until explicit external-write gate. |
| Prompt/image constraints | Canvas/Product Workbench image generation contract, not listing-core logic. |

## Do Not Bring Into ERP

| Do not port | Reason |
| --- | --- |
| Obfuscation/minification structure and decoder scaffolding | Research artifact only. |
| Direct extension permissions/cookies/debugger assumptions | ERP must not depend on browser-extension credential surfaces. |
| Provider endpoints or account headers | External credential boundary; must be modeled via approved provider adapters. |
| Direct code copy from Beixiong modules | Use behavior as benchmark, implement own typed contracts/tests. |
| Silent fallbacks that look valid in preview | ERP should expose fallback/default values as warnings or blocks. |

## Still Needs Proof

| Gap | Why it matters |
| --- | --- |
| Real category attributes beyond fixture | Need coverage for complex attributes, video, grouped/aspect fields. |
| Brand/default-brand strategy | B1D shows Brand can be excluded from AI schema; ERP needs explicit owner. |
| Multi-store suffix and offerId rules | B1C identified helpers but B1D did not trace them. |
| Import polling/result mapping | Static surface exists; no local result fixture yet. |
| Image quality and user acceptance | Fixture media placeholders prove only payload shape. |
| External write gate | No live write performed; ERP must keep a hard account/write boundary. |

## Direction Change Notice

B1D was corrected from "fixture report only" to "deep mirror plus runnable reference project plus port map". ERP branches should consume the port map and fixture outputs, not this branch's source code.
