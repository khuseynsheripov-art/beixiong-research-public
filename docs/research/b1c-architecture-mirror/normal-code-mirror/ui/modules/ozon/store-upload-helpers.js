/**
 * B1F normal-code mirror.
 * original path: ui/modules/ozon/store-upload-helpers.js
 * readable path: docs/research/b1c-architecture-mirror/readable/ui/modules/ozon/store-upload-helpers.js
 * related normal-code-reference modules:
 * - src/ozon/store-upload-context.js
 * confidence: behavior_verified_by_fixture
 * proof gaps: real multi-store upload/polling result mapping.
 */

export {
  appendStoreSuffix,
  stripStoreSuffix,
  injectStoreSuffixIntoSkuCode,
  stripStoreSuffixFromSkuCode,
  buildStoreUploadContexts as buildStoreSpecificDrafts,
  classifyStoreHelperForErp
} from "../../../../normal-code-reference/src/ozon/store-upload-context.js";
