/**
 * B1F normal-code mirror.
 * original path: ui/modules/ozon/uploader-payload.js
 * readable path: docs/research/b1c-architecture-mirror/readable/ui/modules/ozon/uploader-payload.js
 * related normal-code-reference modules:
 * - src/ozon/import-preview.js
 * - src/ozon/complex-attributes.js
 * confidence: behavior_verified_by_fixture
 * proof gaps: real Ozon complex_attributes acceptance and category-specific required grouped fields.
 */

export {
  buildAttributesArray,
  buildImportPreviewCandidates as buildImportItems
} from "../../../../normal-code-reference/src/ozon/import-preview.js";

export {
  buildComplexAttributeRows,
  buildComplexAttributesForDrafts,
  attachComplexAttributesToImportPreviews
} from "../../../../normal-code-reference/src/ozon/complex-attributes.js";
