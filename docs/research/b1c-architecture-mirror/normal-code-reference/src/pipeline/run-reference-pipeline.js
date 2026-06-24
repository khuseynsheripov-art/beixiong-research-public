import { buildAttributeGapMatrixCandidate, buildAiSchemaFromGapMatrix } from "../ai/attribute-gap-matrix.js";
import { normalizeAiRows, sanitizeRowsBySchema, formatValidationStats } from "../ai/row-normalizer.js";
import { splitSchemaPayload } from "../ai/schema-payload.js";
import { buildDraftCandidates } from "../draft/draft-merge.js";
import { buildGeneratedImageAssetRef } from "../media/generated-assets.js";
import { buildPromptPlanCandidate } from "../media/prompt-plan.js";
import { buildCategoryTemplateMeta } from "../ozon/category-template.js";
import { buildImportPreviewCandidates } from "../ozon/import-preview.js";
import { createUploadIntentCandidate } from "../ozon/upload-intent.js";

export function runReferencePipeline(fixture) {
  const templateMeta = buildCategoryTemplateMeta({
    categoryInfo: fixture.categorySignals,
    attributes: fixture.categoryAttributes
  });
  const gapMatrix = buildAttributeGapMatrixCandidate(templateMeta, fixture.categorySignals);
  const aiSchema = buildAiSchemaFromGapMatrix(gapMatrix);
  const schemaPayloads = splitSchemaPayload(aiSchema);
  const normalized = normalizeAiRows(fixture.aiRows, { templateMeta });
  const sanitizedRows = sanitizeRowsBySchema(normalized.normalizedRows, templateMeta);
  const draftResult = buildDraftCandidates({
    sourcePack: fixture.sourcePack,
    formGroup: fixture.formGroup,
    canvasMedia: fixture.canvasMedia,
    normalizedRows: sanitizedRows,
    templateMeta,
    selectionSignals: fixture.selectionSignals
  });
  const promptPlan = buildPromptPlanCandidate({
    sourcePack: fixture.sourcePack,
    categorySignals: fixture.categorySignals,
    formGroup: fixture.formGroup,
    canvasMedia: fixture.canvasMedia
  });
  const generatedAssetRefs = draftResult.drafts.map((draft) => buildGeneratedImageAssetRef({
    draftId: draft.draftId,
    slot: "main_image",
    url: draft.media.mainImage,
    prompt: "fixture prompt only; no provider call",
    sourceImages: fixture.sourcePack.images,
    editableSuiteId: draft.media.editableSuiteId
  }));
  const importPreviewResult = buildImportPreviewCandidates({
    drafts: draftResult.drafts,
    templateMeta,
    categorySignals: fixture.categorySignals
  });
  const preflightIssues = [
    ...normalized.issues,
    ...draftResult.issues,
    ...importPreviewResult.issues
  ];
  const uploadIntent = createUploadIntentCandidate({
    importPreviews: importPreviewResult.items,
    preflightIssues,
    externalWriteApproved: false
  });

  return {
    referenceProject: "B1E normal-code-reference",
    noExternalCalls: true,
    counts: {
      templateFields: templateMeta.editorOrder.length,
      attributeGapFields: gapMatrix.fields.length,
      normalizedRows: normalized.normalizedRows.length,
      draftCandidates: draftResult.drafts.length,
      generatedAssetRefs: generatedAssetRefs.length,
      importPreviewCandidates: importPreviewResult.items.length,
      preflightIssues: preflightIssues.length,
      uploadIntentIssues: uploadIntent.issues.length
    },
    templateMeta,
    gapMatrix,
    aiSchema,
    schemaPayloads,
    normalizedRows: normalized.normalizedRows,
    validationStats: normalized.stats,
    validationStatsText: formatValidationStats(normalized.stats),
    drafts: draftResult.drafts,
    promptPlan,
    generatedAssetRefs,
    importPreviews: importPreviewResult.items,
    preflightIssues,
    uploadIntent
  };
}
