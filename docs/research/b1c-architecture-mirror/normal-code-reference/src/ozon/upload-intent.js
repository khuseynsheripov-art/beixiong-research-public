import { createPreflightIssueCandidate, ISSUE_SEVERITY } from "../../contracts/erp-contracts.js";
import { buildOzonApiRequestDescriptor } from "./ozon-api-contract.js";

export function createUploadIntentCandidate({
  importPreviews,
  preflightIssues,
  externalWriteApproved = false
}) {
  const blockingIssues = preflightIssues.filter((issue) => issue.severity === ISSUE_SEVERITY.BLOCK || issue.severity === ISSUE_SEVERITY.REGENERATE);
  const intentIssues = [...preflightIssues];

  if (!externalWriteApproved) {
    intentIssues.push(createPreflightIssueCandidate({
      code: "external_write_gate_closed",
      severity: ISSUE_SEVERITY.BLOCK,
      message: "Reference project does not perform live Ozon import writes.",
      owner: "external-write-gate"
    }));
  }

  return {
    contract: "UploadIntentCandidate",
    readyForLiveWrite: externalWriteApproved && blockingIssues.length === 0,
    noExternalCalls: true,
    importPreviewCount: importPreviews.length,
    requestDescriptor: buildOzonApiRequestDescriptor("productImport", { items: importPreviews.map((preview) => preview.item) }),
    pollingDescriptor: buildOzonApiRequestDescriptor("importInfo", { task_id: "<import-task-id>" }),
    issues: intentIssues,
    manualReviewRequired: intentIssues.length > 0
  };
}
