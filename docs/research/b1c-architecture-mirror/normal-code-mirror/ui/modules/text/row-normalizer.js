/**
 * B1F normal-code mirror.
 * original path: ui/modules/text/row-normalizer.js
 * readable path: docs/research/b1c-architecture-mirror/readable/ui/modules/text/row-normalizer.js
 * related normal-code-reference modules:
 * - src/ai/row-normalizer.js
 * - src/ozon/failure-taxonomy.js
 * confidence: behavior_verified_by_fixture
 * proof gaps: language filtering, commercial-term filtering, broader numeric coercion edge cases.
 */

export {
  normalizeAiRows,
  sanitizeRowsBySchema,
  formatValidationStats
} from "../../../../normal-code-reference/src/ai/row-normalizer.js";
