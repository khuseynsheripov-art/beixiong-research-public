import { createPreflightIssueCandidate, ISSUE_SEVERITY } from "../../contracts/erp-contracts.js";

export function buildDraftCandidates({
  sourcePack,
  formGroup,
  canvasMedia,
  normalizedRows,
  templateMeta,
  selectionSignals = {}
}) {
  const skuFacts = sourcePack.skuFacts || [];
  const issues = [];
  const drafts = normalizedRows.map((row, index) => {
    const sku = skuFacts[index] || skuFacts[0] || {};
    const offerId = `${sourcePack.sourceId}-${index + 1}`;
    const fields = {
      ...row,
      "Price, CNY": sku.priceCny ?? sourcePack.pricing?.priceCny ?? 0,
      "Old price, CNY": sku.oldPriceCny ?? sourcePack.pricing?.oldPriceCny ?? 0,
      "Weight, g": sku.weightG ?? sourcePack.packaging?.weightG ?? "",
      "Package width, mm": sku.widthMm ?? sourcePack.packaging?.widthMm ?? 200,
      "Package height, mm": sku.heightMm ?? sourcePack.packaging?.heightMm ?? 100,
      "Package length, mm": sku.depthMm ?? sourcePack.packaging?.depthMm ?? 300
    };

    for (const field of Object.values(templateMeta.fieldMeta)) {
      if (field.required && !fields[field.editorLabel] && !field.isAutoManaged) {
        issues.push(createPreflightIssueCandidate({
          code: "required_draft_field_missing",
          severity: ISSUE_SEVERITY.BLOCK,
          message: `Required draft field is empty: ${field.editorLabel}`,
          draftId: offerId,
          evidence: { field: field.editorLabel }
        }));
      }
    }

    return {
      draftId: offerId,
      offerId,
      sourceSkuKey: sku.skuKey || `sku-${index + 1}`,
      formGroupId: formGroup.groupId,
      fields,
      media: {
        mainImage: canvasMedia.mainImage || sourcePack.images?.[0] || "",
        gallery: canvasMedia.gallery || sourcePack.images || [],
        colorImage: canvasMedia.colorImage || "",
        video: canvasMedia.video || "",
        editableSuiteId: canvasMedia.editableSuiteId || ""
      },
      selectionSignals
    };
  });

  return { drafts, issues };
}
