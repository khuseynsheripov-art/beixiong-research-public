import { ISSUE_SEVERITY, createPreflightIssueCandidate } from "../../contracts/erp-contracts.js";

export const FAILURE_CLASS = Object.freeze({
  AUTH_MISSING: "auth_missing",
  PERMISSION_DENIED: "permission_denied",
  CATEGORY_SCHEMA_MISMATCH: "category_schema_mismatch",
  VALIDATION_FAILED: "validation_failed",
  MEDIA_FAILED: "media_failed",
  DUPLICATE_OR_INVALID_SKU: "duplicate_or_invalid_sku",
  IMPORT_POLLING_TIMEOUT: "import_polling_timeout",
  MANUAL_REVIEW_REQUIRED: "manual_review_required",
  PROVIDER_FAILED: "provider_failed",
  UNKNOWN: "unknown"
});

const FAILURE_RULES = [
  [FAILURE_CLASS.AUTH_MISSING, /auth|token|api key|client id|unauthor/i, ISSUE_SEVERITY.BLOCK],
  [FAILURE_CLASS.PERMISSION_DENIED, /permission|forbidden|access denied|403/i, ISSUE_SEVERITY.BLOCK],
  [FAILURE_CLASS.CATEGORY_SCHEMA_MISMATCH, /category|attribute|schema|type id|description_category/i, ISSUE_SEVERITY.BLOCK],
  [FAILURE_CLASS.MEDIA_FAILED, /image|media|photo|video|picture/i, ISSUE_SEVERITY.BLOCK],
  [FAILURE_CLASS.DUPLICATE_OR_INVALID_SKU, /sku|offer|duplicate|barcode/i, ISSUE_SEVERITY.BLOCK],
  [FAILURE_CLASS.IMPORT_POLLING_TIMEOUT, /timeout|poll|waiting|pending/i, ISSUE_SEVERITY.REVIEW],
  [FAILURE_CLASS.MANUAL_REVIEW_REQUIRED, /manual|moderation|review|check/i, ISSUE_SEVERITY.REVIEW],
  [FAILURE_CLASS.PROVIDER_FAILED, /provider|generation|task failed|model/i, ISSUE_SEVERITY.REVIEW],
  [FAILURE_CLASS.VALIDATION_FAILED, /valid|invalid|required|missing|error/i, ISSUE_SEVERITY.BLOCK]
];

export function classifyFailure(rawFailure = {}) {
  const message = String(rawFailure.message || rawFailure.error || rawFailure.reason || rawFailure.code || "").trim();
  const source = String(rawFailure.source || rawFailure.surface || "").trim();
  const haystack = `${source} ${message}`;
  const matched = FAILURE_RULES.find(([, pattern]) => pattern.test(haystack));
  const [failureClass, , severity] = matched || [FAILURE_CLASS.UNKNOWN, null, ISSUE_SEVERITY.REVIEW];
  return {
    class: failureClass,
    severity,
    message: message || "Unknown account/import/provider failure",
    source,
    retryable: failureClass === FAILURE_CLASS.IMPORT_POLLING_TIMEOUT || failureClass === FAILURE_CLASS.PROVIDER_FAILED,
    evidence: rawFailure
  };
}

export function mapFailureToPreflightIssue(rawFailure = {}, draftId = null) {
  const classified = classifyFailure(rawFailure);
  return createPreflightIssueCandidate({
    code: classified.class,
    severity: classified.severity,
    message: classified.message,
    owner: rawFailure.owner || "preflight",
    evidence: classified.evidence,
    draftId
  });
}

export function buildFailureTaxonomyReport(failures = []) {
  const issues = failures.map((failure) => mapFailureToPreflightIssue(failure, failure.draftId || null));
  const byClass = {};
  for (const issue of issues) byClass[issue.code] = (byClass[issue.code] || 0) + 1;
  return {
    contract: "PreflightIssueCandidateFailureTaxonomy",
    total: issues.length,
    byClass,
    issues,
    evidence: "B1F packet focus + B1C/B1D uploader/api/provider surfaces; local fixture only"
  };
}
