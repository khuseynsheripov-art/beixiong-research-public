import { createPreflightIssueCandidate, ISSUE_SEVERITY } from "../../contracts/erp-contracts.js";
import { optionMap, toArray, toNumber } from "../utils/field-utils.js";

export function buildAttributesArray(fields, templateMeta) {
  const attributes = [];
  const issues = [];

  for (const label of templateMeta.editorOrder) {
    const meta = templateMeta.fieldMeta[label];
    if (!meta || !meta._ozonAttributeId || meta.isAutoManaged) continue;
    const rawValue = fields[label];
    const values = toArray(rawValue);

    if (meta.required && values.length === 0) {
      issues.push(createPreflightIssueCandidate({
        code: "empty_attribute_values",
        severity: ISSUE_SEVERITY.BLOCK,
        message: `Required Ozon attribute has no value: ${label}`,
        evidence: { attributeId: meta._ozonAttributeId, label }
      }));
      continue;
    }

    if (values.length === 0) continue;
    const byOption = optionMap(meta.options);
    attributes.push({
      id: meta._ozonAttributeId,
      complex_id: meta._complexId || 0,
      values: values.map((value) => {
        const option = byOption.get(String(value).toLowerCase());
        return option?.i ? { dictionary_value_id: option.i, value } : { value };
      })
    });
  }

  return { attributes, issues };
}

export function buildImportPreviewCandidates({ drafts, templateMeta, categorySignals }) {
  const issues = [];
  const items = drafts.map((draft) => {
    const attrResult = buildAttributesArray(draft.fields, templateMeta);
    issues.push(...attrResult.issues.map((issue) => ({ ...issue, draftId: draft.draftId })));
    return {
      contract: "OzonImportItemPreviewCandidate",
      draftId: draft.draftId,
      item: {
        description_category_id: categorySignals.descriptionCategoryId,
        type_id: categorySignals.typeId,
        name: draft.fields["Name"] || draft.fields["Название"] || draft.fields.Title || draft.offerId,
        offer_id: draft.offerId,
        barcode: "",
        price: String(toNumber(draft.fields["Price, CNY"], 0)),
        old_price: String(toNumber(draft.fields["Old price, CNY"], 0)),
        premium_price: "0",
        vat: "0",
        count: toNumber(draft.fields.Stock, 0),
        weight: toNumber(draft.fields["Weight, g"], 500),
        weight_unit: "g",
        depth: toNumber(draft.fields["Package length, mm"], 300),
        width: toNumber(draft.fields["Package width, mm"], 200),
        height: toNumber(draft.fields["Package height, mm"], 100),
        dimension_unit: "mm",
        attributes: attrResult.attributes,
        complex_attributes: [],
        images: [draft.media.mainImage, ...(draft.media.gallery || [])].filter(Boolean),
        color_image: draft.media.colorImage || "",
        video: draft.media.video || "",
        images360: []
      }
    };
  });

  for (const item of items) {
    if (!item.item.images.length) {
      issues.push(createPreflightIssueCandidate({
        code: "missing_main_image",
        severity: ISSUE_SEVERITY.BLOCK,
        message: "Import preview has no media image",
        draftId: item.draftId
      }));
    }
  }

  return { items, issues };
}
