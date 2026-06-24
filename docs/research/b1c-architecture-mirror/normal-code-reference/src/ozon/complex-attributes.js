import { createPreflightIssueCandidate, ISSUE_SEVERITY } from "../../contracts/erp-contracts.js";
import { optionMap, toArray } from "../utils/field-utils.js";

function mapComplexValue(value, field) {
  const byOption = optionMap(field.options || []);
  const option = byOption.get(String(value).toLowerCase());
  return option?.i ? { dictionary_value_id: option.i, value } : { value };
}

export function buildComplexAttributeRows({ draft, complexGroups = [] }) {
  const rows = [];
  const issues = [];

  for (const group of complexGroups) {
    const rowValues = [];
    for (const field of group.fields || []) {
      const rawValue = draft.fields?.[field.label];
      const values = toArray(rawValue);
      if (field.required && values.length === 0) {
        issues.push(createPreflightIssueCandidate({
          code: "complex_required_field_missing",
          severity: ISSUE_SEVERITY.BLOCK,
          message: `Required complex attribute is empty: ${group.name}.${field.label}`,
          draftId: draft.draftId,
          evidence: { complexId: group.complexId, attributeId: field.attributeId, label: field.label }
        }));
        continue;
      }

      for (const value of values) {
        rowValues.push({
          id: field.attributeId,
          complex_id: group.complexId,
          values: [mapComplexValue(value, field)]
        });
      }
    }

    if (rowValues.length) {
      rows.push({
        complex_id: group.complexId,
        groupName: group.name,
        attributes: rowValues
      });
    }
  }

  return { rows, issues };
}

export function buildComplexAttributesForDrafts({ drafts, complexGroups = [] }) {
  const byDraft = [];
  const issues = [];
  for (const draft of drafts) {
    const result = buildComplexAttributeRows({ draft, complexGroups });
    byDraft.push({ draftId: draft.draftId, complex_attributes: result.rows });
    issues.push(...result.issues);
  }
  return {
    contract: "ComplexAttributePreviewCandidate",
    byDraft,
    issues,
    complexGroupCount: complexGroups.length,
    complexRowCount: byDraft.reduce((sum, item) => sum + item.complex_attributes.length, 0)
  };
}

export function attachComplexAttributesToImportPreviews(importPreviews, complexByDraft = []) {
  const complexMap = new Map(complexByDraft.map((entry) => [entry.draftId, entry.complex_attributes]));
  return importPreviews.map((preview) => ({
    ...preview,
    item: {
      ...preview.item,
      complex_attributes: complexMap.get(preview.draftId) || []
    }
  }));
}
