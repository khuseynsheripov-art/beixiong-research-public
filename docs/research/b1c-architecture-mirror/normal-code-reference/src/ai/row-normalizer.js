import { ISSUE_SEVERITY, createPreflightIssueCandidate } from "../../contracts/erp-contracts.js";
import { lowerKey, normalizeText, optionMap, toArray, toNumber, unique } from "../utils/field-utils.js";

function buildFieldLookup(templateMeta) {
  const fields = Object.values(templateMeta.fieldMeta || {});
  return {
    byExact: new Map(fields.map((field) => [field.editorLabel, field])),
    byLower: new Map(fields.map((field) => [lowerKey(field.editorLabel), field]))
  };
}

function normalizeValue(value, field) {
  if (field.valueKind === "numeric") return toNumber(value, null);
  if (field.valueKind === "select") {
    const options = optionMap(field.options);
    const selected = unique(toArray(value).map(normalizeText));
    const valid = selected.filter((item) => options.has(lowerKey(item)));
    return field.isCollection ? valid : valid[0] || "";
  }
  return normalizeText(value);
}

export function normalizeAiRows(rows, { templateMeta }) {
  const lookup = buildFieldLookup(templateMeta);
  const stats = {
    exactKeyMatches: 0,
    fuzzyKeyMatches: 0,
    unknownKeys: 0,
    unknownKeySamples: [],
    invalidSelectValues: 0,
    numericCoercions: 0
  };
  const issues = [];

  const normalizedRows = rows.map((row, rowIndex) => {
    const normalized = {};
    for (const [key, value] of Object.entries(row)) {
      const field = lookup.byExact.get(key) || lookup.byLower.get(lowerKey(key));
      if (!field) {
        stats.unknownKeys += 1;
        stats.unknownKeySamples.push(key);
        issues.push(createPreflightIssueCandidate({
          code: "schema_unknown_key",
          severity: ISSUE_SEVERITY.REVIEW,
          message: `AI row key is outside schema: ${key}`,
          evidence: { rowIndex, key }
        }));
        continue;
      }

      if (field.editorLabel === key) stats.exactKeyMatches += 1;
      else stats.fuzzyKeyMatches += 1;

      const normalizedValue = normalizeValue(value, field);
      if (field.valueKind === "select") {
        const inputCount = toArray(value).length;
        const validCount = toArray(normalizedValue).length;
        if (inputCount > validCount) {
          stats.invalidSelectValues += inputCount - validCount;
          issues.push(createPreflightIssueCandidate({
            code: "invalid_select_value",
            severity: ISSUE_SEVERITY.REGENERATE,
            message: `Invalid option removed for ${field.editorLabel}`,
            evidence: { rowIndex, input: value, valid: field.options }
          }));
        }
      }
      if (field.valueKind === "numeric" && normalizedValue !== value) stats.numericCoercions += 1;
      if (normalizedValue !== "" && normalizedValue != null && !(Array.isArray(normalizedValue) && normalizedValue.length === 0)) {
        normalized[field.editorLabel] = normalizedValue;
      }
    }
    return normalized;
  });

  return { normalizedRows, stats, issues };
}

export function sanitizeRowsBySchema(rows, templateMeta) {
  const lookup = buildFieldLookup(templateMeta);
  return rows.map((row) => Object.fromEntries(
    Object.entries(row).filter(([key]) => lookup.byExact.has(key) || lookup.byLower.has(lowerKey(key)))
  ));
}

export function formatValidationStats(stats) {
  return `exact=${stats.exactKeyMatches}, fuzzy=${stats.fuzzyKeyMatches}, unknown=${stats.unknownKeys}, invalidSelect=${stats.invalidSelectValues}`;
}
