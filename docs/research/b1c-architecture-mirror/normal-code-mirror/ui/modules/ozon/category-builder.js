/**
 * B1F normal-code mirror.
 * original path: ui/modules/ozon/category-builder.js
 * readable path: docs/research/b1c-architecture-mirror/readable/ui/modules/ozon/category-builder.js
 * related normal-code-reference modules:
 * - src/ozon/category-template.js
 * - src/ai/attribute-gap-matrix.js
 * confidence: behavior_verified_by_fixture
 * proof gaps: real category edge cases, grouped/aspect attributes, brand policy.
 */

export {
  buildCategoryTemplateMeta as buildTemplateMeta,
  buildCategoryTemplateMeta,
  getDictionaryAttributeIds,
  shouldKeepCategoryAttribute
} from "../../../../normal-code-reference/src/ozon/category-template.js";

export {
  buildAttributeGapMatrixCandidate,
  buildAiSchemaFromGapMatrix as buildAiSchema
} from "../../../../normal-code-reference/src/ai/attribute-gap-matrix.js";
