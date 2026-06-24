/**
 * Original Beixiong evidence:
 * - ui/modules/ozon/category-builder.js
 * - ui/modules/text/row-normalizer.js
 * - ui/modules/ozon/uploader-payload.js
 *
 * These typedefs reserve ERP-facing contracts without editing ERP code.
 */

/**
 * @typedef {Object} BeixiongReferenceSourcePackInput
 * @property {string} sourceId
 * @property {string} title
 * @property {string} sourceUrl
 * @property {Array<Object>} skuFacts
 * @property {Array<string>} images
 * @property {Object} pricing
 * @property {Object} supplier
 * @property {Array<Object>} evidence
 */

/**
 * @typedef {Object} BeixiongReferenceFormGroupInput
 * @property {string} groupId
 * @property {string} strategy
 * @property {Array<string>} skuKeys
 * @property {Array<Object>} decisions
 */

/**
 * @typedef {Object} BeixiongReferenceCanvasMediaBridge
 * @property {string} mainImage
 * @property {Array<string>} gallery
 * @property {string=} colorImage
 * @property {string=} video
 * @property {string=} editableSuiteId
 * @property {Array<Object>} provenance
 */

/**
 * @typedef {Object} BeixiongReferenceCategorySignalInput
 * @property {number} descriptionCategoryId
 * @property {number} typeId
 * @property {string} categoryTitle
 * @property {Array<string>} searchTerms
 * @property {Array<string>} titleHints
 * @property {Array<string>} tagHints
 */

/**
 * @typedef {Object} BeixiongReferenceSelectionSignalInput
 * @property {Object=} selection
 * @property {Object=} profit
 * @property {Object=} future3d
 */

export const ISSUE_SEVERITY = Object.freeze({
  INFO: "info",
  REVIEW: "review",
  BLOCK: "block",
  REGENERATE: "block_or_regenerate"
});

export const IMPLEMENTATION_CONFIDENCE = Object.freeze({
  MECHANICAL: "mechanical",
  FIXTURE_VERIFIED: "behavior_verified_by_fixture",
  INFERRED: "inferred",
  PROOF_GAP: "proof_gap"
});

export function createPreflightIssueCandidate({
  code,
  severity = ISSUE_SEVERITY.REVIEW,
  message,
  owner = "listing-prep",
  evidence = null,
  draftId = null
}) {
  return { code, severity, message, owner, evidence, draftId };
}
