/**
 * B1F normal-code mirror.
 * original path: ui/modules/ozon/uploader.js
 * readable path: docs/research/b1c-architecture-mirror/readable/ui/modules/ozon/uploader.js
 * related normal-code-reference modules:
 * - src/ozon/upload-intent.js
 * - src/ozon/import-results.js
 * - src/ozon/failure-taxonomy.js
 * confidence: behavior_verified_by_fixture for dry-run intent and local result mapping; proof_gap for live submit/poll.
 * proof gaps: live Ozon submit, live polling, account-side permissions, platform review.
 */

export { createUploadIntentCandidate } from "../../../../normal-code-reference/src/ozon/upload-intent.js";
export { summarizeImportPollingResult, mapImportResultRows } from "../../../../normal-code-reference/src/ozon/import-results.js";
export { classifyFailure, mapFailureToPreflightIssue } from "../../../../normal-code-reference/src/ozon/failure-taxonomy.js";

export async function uploadToOzon(input) {
  return createUploadIntentCandidate({
    importPreviews: input.importPreviews || [],
    preflightIssues: input.preflightIssues || [],
    externalWriteApproved: false
  });
}

export async function waitForOzonImportResultFromFixture(input) {
  return summarizeImportPollingResult({
    taskIds: input.taskIds || [],
    resultRows: input.resultRows || [],
    expectedOfferIds: input.expectedOfferIds || []
  });
}
