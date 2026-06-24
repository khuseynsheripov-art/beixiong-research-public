/**
 * B1F normal-code mirror.
 * original path: ui/app/workflows/ozon-upload-workflow.js
 * readable path: docs/research/b1c-architecture-mirror/readable/ui/app/workflows/ozon-upload-workflow.js
 * related normal-code-reference modules:
 * - src/ozon/upload-intent.js
 * - src/ozon/import-results.js
 * - src/ozon/store-upload-context.js
 * confidence: inferred for orchestration shape; proof_gap for live workflow/account mutation.
 * proof gaps: real UI workflow state, user confirmation gate, live submit/poll.
 */

import { createUploadIntentCandidate } from "../../../../normal-code-reference/src/ozon/upload-intent.js";
import { summarizeImportPollingResult } from "../../../../normal-code-reference/src/ozon/import-results.js";
import { buildStoreUploadContexts } from "../../../../normal-code-reference/src/ozon/store-upload-context.js";

export function buildOzonUploadWorkflowPreview({ drafts = [], stores = [], importPreviews = [], preflightIssues = [] }) {
  const storeContexts = buildStoreUploadContexts({ stores, drafts });
  const uploadIntent = createUploadIntentCandidate({
    importPreviews,
    preflightIssues,
    externalWriteApproved: false
  });
  return {
    storeContexts,
    uploadIntent,
    noExternalCalls: true,
    readyForLiveWrite: false
  };
}

export function mapOzonUploadWorkflowResult({ taskIds = [], resultRows = [], expectedOfferIds = [] }) {
  return summarizeImportPollingResult({ taskIds, resultRows, expectedOfferIds });
}
