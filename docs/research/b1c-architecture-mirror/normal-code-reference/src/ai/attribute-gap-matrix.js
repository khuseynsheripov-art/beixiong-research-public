export function buildAttributeGapMatrixCandidate(templateMeta, categorySignals = {}) {
  const fields = templateMeta.editorOrder
    .map((label) => templateMeta.fieldMeta[label])
    .filter((field) => field && !field.isAutoManaged)
    .map((field) => ({
      key: field.editorLabel,
      required: Boolean(field.required),
      kind: field.valueKind,
      isCollection: Boolean(field.isCollection),
      optionCount: field.options?.length || 0,
      systemFieldType: field._systemFieldType || "",
      owner: field.manualOnly ? "manual-review" : "ai-fill",
      evidence: field.evidence
    }));

  return {
    contract: "AttributeGapMatrixCandidate",
    category: templateMeta.categoryInfo,
    searchTerms: categorySignals.searchTerms || [],
    titleHints: categorySignals.titleHints || [],
    tagHints: categorySignals.tagHints || [],
    fields,
    requiredMissingStrategy: "block_or_regenerate_before_upload_preview"
  };
}

export function buildAiSchemaFromGapMatrix(matrix) {
  return {
    categoryTitle: matrix.category.categoryTitle,
    fields: matrix.fields.map((field) => ({
      k: field.key,
      t: field.kind === "numeric" ? "number" : field.kind,
      r: field.required ? 1 : 0,
      m: field.isCollection ? 1 : 0,
      p: field.systemFieldType || undefined,
      owner: field.owner
    }))
  };
}
