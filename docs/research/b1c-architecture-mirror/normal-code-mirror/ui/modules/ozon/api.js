/**
 * B1F normal-code mirror.
 * original path: ui/modules/ozon/api.js
 * readable path: docs/research/b1c-architecture-mirror/readable/ui/modules/ozon/api.js
 * related normal-code-reference modules:
 * - src/ozon/ozon-api-contract.js
 * - src/ozon/failure-taxonomy.js
 * confidence: mechanical for endpoint descriptors; proof_gap for live network behavior.
 * proof gaps: live API authorization, rate limit, account permission, platform response variants.
 */

export {
  OZON_API_SURFACES,
  buildOzonApiRequestDescriptor
} from "../../../../normal-code-reference/src/ozon/ozon-api-contract.js";

export {
  classifyFailure,
  mapFailureToPreflightIssue,
  buildFailureTaxonomyReport
} from "../../../../normal-code-reference/src/ozon/failure-taxonomy.js";
