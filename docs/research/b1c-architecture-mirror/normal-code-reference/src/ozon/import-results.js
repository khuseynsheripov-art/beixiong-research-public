import { ISSUE_SEVERITY, createPreflightIssueCandidate } from "../../contracts/erp-contracts.js";
import { mapFailureToPreflightIssue } from "./failure-taxonomy.js";

function normalizeResultStatus(rawStatus) {
  const status = String(rawStatus || "").toLowerCase();
  if (/imported|success|done|processed/.test(status)) return "imported";
  if (/fail|error|rejected/.test(status)) return "failed";
  if (/review|moderation|manual/.test(status)) return "manual_review";
  if (/process|pending|queued/.test(status)) return "processing";
  return "unknown";
}

export function mapImportResultRows({ taskId, rows = [], expectedOfferIds = [] }) {
  const mappedRows = rows.map((row) => {
    const status = normalizeResultStatus(row.status || row.state);
    const failures = (row.errors || row.warnings || []).map((message) => ({
      source: "ozon_import_result",
      message,
      draftId: row.offer_id || row.offerId
    }));
    return {
      taskId,
      offerId: row.offer_id || row.offerId || "",
      productId: row.product_id || row.productId || null,
      status,
      warnings: row.warnings || [],
      errors: row.errors || [],
      issues: failures.map((failure) => mapFailureToPreflightIssue(failure, failure.draftId)),
      raw: row
    };
  });

  const seen = new Set(mappedRows.map((row) => row.offerId).filter(Boolean));
  const missing = expectedOfferIds.filter((offerId) => !seen.has(offerId));
  const missingIssues = missing.map((offerId) => createPreflightIssueCandidate({
    code: "import_result_missing_offer",
    severity: ISSUE_SEVERITY.REVIEW,
    message: `Import polling result does not include expected offer: ${offerId}`,
    owner: "upload-intent",
    draftId: offerId,
    evidence: { taskId, offerId }
  }));

  return { rows: mappedRows, missingIssues };
}

export function summarizeImportPollingResult({ taskIds = [], resultRows = [], expectedOfferIds = [] }) {
  const mapped = taskIds.map((taskId) => mapImportResultRows({
    taskId,
    rows: resultRows.filter((row) => String(row.task_id || row.taskId) === String(taskId)),
    expectedOfferIds
  }));
  const rows = mapped.flatMap((item) => item.rows);
  const issues = [...mapped.flatMap((item) => item.missingIssues), ...rows.flatMap((row) => row.issues)];
  const counts = {
    total: rows.length,
    imported: rows.filter((row) => row.status === "imported").length,
    failed: rows.filter((row) => row.status === "failed").length,
    manualReview: rows.filter((row) => row.status === "manual_review").length,
    processing: rows.filter((row) => row.status === "processing").length,
    unknown: rows.filter((row) => row.status === "unknown").length
  };
  const status = counts.failed > 0 ? "partial_failed" : counts.processing > 0 ? "processing" : counts.imported === counts.total ? "imported" : "needs_review";
  return {
    contract: "ImportPollingResultCandidate",
    taskIds,
    status,
    counts,
    rows,
    issues,
    noExternalCalls: true,
    evidence: "B1C/B1D uploader waitForOzonImportResult/pollImportResult surfaces; local fixture only"
  };
}
