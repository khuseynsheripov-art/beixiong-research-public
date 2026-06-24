import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { advancedReferenceFixture } from "../fixtures/advanced-reference-fixture.mjs";
import { runReferencePipeline } from "../src/pipeline/run-reference-pipeline.js";
import { buildComplexAttributesForDrafts, attachComplexAttributesToImportPreviews } from "../src/ozon/complex-attributes.js";
import { summarizeImportPollingResult } from "../src/ozon/import-results.js";
import { buildStoreUploadContexts, classifyStoreHelperForErp } from "../src/ozon/store-upload-context.js";
import { buildFailureTaxonomyReport } from "../src/ozon/failure-taxonomy.js";
import { buildMediaProviderProofGapReport } from "../src/media/provider-proof-gaps.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const outputDir = path.join(root, "output");
const outputPath = path.join(outputDir, "b1f-smoke-output.json");

const base = runReferencePipeline(advancedReferenceFixture);
const complex = buildComplexAttributesForDrafts({
  drafts: base.drafts,
  complexGroups: advancedReferenceFixture.complexGroups
});
const advancedImportPreviews = attachComplexAttributesToImportPreviews(base.importPreviews, complex.byDraft);
const storeContexts = buildStoreUploadContexts({
  stores: advancedReferenceFixture.stores,
  drafts: base.drafts
});
const importPolling = summarizeImportPollingResult({
  taskIds: advancedReferenceFixture.importTaskIds,
  resultRows: advancedReferenceFixture.importResultRows,
  expectedOfferIds: base.drafts.map((draft) => draft.offerId)
});
const failureTaxonomy = buildFailureTaxonomyReport(advancedReferenceFixture.failureCases);
const mediaProofGaps = buildMediaProviderProofGapReport({
  promptPlan: base.promptPlan,
  providerTasks: advancedReferenceFixture.providerTasks,
  canvasMedia: advancedReferenceFixture.canvasMedia
});

const allIssues = [
  ...base.preflightIssues,
  ...complex.issues,
  ...importPolling.issues,
  ...failureTaxonomy.issues
];

const result = {
  referenceProject: "B1F complex attributes/import polling/media gaps",
  noExternalCalls: true,
  readyForLiveWrite: false,
  counts: {
    complexGroups: advancedReferenceFixture.complexGroups.length,
    complexAttributeDrafts: complex.byDraft.length,
    complexAttributeRows: complex.complexRowCount,
    storeContexts: storeContexts.length,
    storeMappedDrafts: storeContexts.reduce((sum, store) => sum + store.mappedDrafts.length, 0),
    importResultRows: importPolling.rows.length,
    importImported: importPolling.counts.imported,
    importFailed: importPolling.counts.failed,
    importManualReview: importPolling.counts.manualReview,
    failureCases: advancedReferenceFixture.failureCases.length,
    failureClasses: Object.keys(failureTaxonomy.byClass).length,
    mediaProviderTasks: mediaProofGaps.tasks.length,
    mediaProofGaps: mediaProofGaps.gapCount,
    preflightIssues: allIssues.length
  },
  complex,
  storeContexts,
  storeHelperClassification: classifyStoreHelperForErp(),
  importPolling,
  failureTaxonomy,
  mediaProofGaps,
  advancedImportPreviews
};

await mkdir(outputDir, { recursive: true });
await writeFile(outputPath, `${JSON.stringify(result, null, 2)}\n`, "utf8");

console.log(JSON.stringify({
  noExternalCalls: result.noExternalCalls,
  output: path.relative(process.cwd(), outputPath),
  complexGroups: result.counts.complexGroups,
  complexAttributeRows: result.counts.complexAttributeRows,
  storeContexts: result.counts.storeContexts,
  importResultRows: result.counts.importResultRows,
  failureCases: result.counts.failureCases,
  mediaProofGaps: result.counts.mediaProofGaps,
  preflightIssues: result.counts.preflightIssues,
  readyForLiveWrite: result.readyForLiveWrite
}, null, 2));
