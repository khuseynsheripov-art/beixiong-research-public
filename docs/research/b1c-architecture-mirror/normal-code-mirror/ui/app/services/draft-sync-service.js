/**
 * B1F normal-code mirror.
 * original path: ui/app/services/draft-sync-service.js
 * readable path: docs/research/b1c-architecture-mirror/readable/ui/app/services/draft-sync-service.js
 * related normal-code-reference modules:
 * - src/draft/draft-merge.js
 * - src/ozon/store-upload-context.js
 * confidence: behavior_verified_by_fixture for fixture draft merge; inferred for full UI sync behavior.
 * proof gaps: live UI edits, pricing-warning variants, user override precedence.
 */

export {
  buildDraftCandidates as buildSyncedProductDraftState,
  buildDraftCandidates
} from "../../../../normal-code-reference/src/draft/draft-merge.js";

export {
  buildStoreUploadContexts
} from "../../../../normal-code-reference/src/ozon/store-upload-context.js";
