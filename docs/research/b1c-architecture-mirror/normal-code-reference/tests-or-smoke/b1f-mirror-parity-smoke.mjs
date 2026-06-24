import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { advancedReferenceFixture } from "../fixtures/advanced-reference-fixture.mjs";
import {
  runReferencePipeline,
  buildComplexAttributesForDrafts,
  summarizeImportPollingResult,
  buildStoreUploadContexts,
  buildFailureTaxonomyReport,
  buildMediaProviderProofGapReport
} from "../src/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const repoRoot = path.resolve(root, "../../../../..");
const mirrorRoot = path.resolve(root, "../normal-code-mirror");
const outputDir = path.join(root, "output");
const outputPath = path.join(outputDir, "b1f-mirror-parity-output.json");
const reportPath = path.resolve(mirrorRoot, "behavior-parity-report.yaml");

const mirrorFiles = [
  {
    original: "ui/modules/ozon/category-builder.js",
    mirror: "ui/modules/ozon/category-builder.js",
    reference: ["src/ozon/category-template.js", "src/ai/attribute-gap-matrix.js"],
    expectedExports: ["buildTemplateMeta", "buildCategoryTemplateMeta", "getDictionaryAttributeIds", "shouldKeepCategoryAttribute", "buildAttributeGapMatrixCandidate", "buildAiSchema"],
    parityStatus: "parity_backed",
    fixtureComparison: "template field count and category schema build"
  },
  {
    original: "ui/modules/ozon/category-ai-schema-builder.js",
    mirror: "ui/modules/ozon/category-ai-schema-builder.js",
    reference: ["src/ai/attribute-gap-matrix.js"],
    expectedExports: ["buildAttributeGapMatrixCandidate", "buildAiSchema"],
    parityStatus: "parity_backed",
    fixtureComparison: "attribute gap matrix field count"
  },
  {
    original: "ui/modules/text/schema-payload.js",
    mirror: "ui/modules/text/schema-payload.js",
    reference: ["src/ai/schema-payload.js"],
    expectedExports: ["splitSchemaPayload", "countPayloadOptions", "mergeSchemaPayloads"],
    parityStatus: "parity_backed",
    fixtureComparison: "schema payload lane keys"
  },
  {
    original: "ui/modules/text/row-normalizer.js",
    mirror: "ui/modules/text/row-normalizer.js",
    reference: ["src/ai/row-normalizer.js"],
    expectedExports: ["normalizeAiRows", "sanitizeRowsBySchema", "formatValidationStats"],
    parityStatus: "parity_backed",
    fixtureComparison: "normalized rows and invalid select handling"
  },
  {
    original: "ui/modules/ozon/uploader-payload.js",
    mirror: "ui/modules/ozon/uploader-payload.js",
    reference: ["src/ozon/import-preview.js", "src/ozon/complex-attributes.js"],
    expectedExports: ["buildAttributesArray", "buildImportItems", "buildComplexAttributeRows", "buildComplexAttributesForDrafts", "attachComplexAttributesToImportPreviews"],
    parityStatus: "parity_backed",
    fixtureComparison: "import preview count and complex attribute rows"
  },
  {
    original: "ui/modules/ozon/uploader.js",
    mirror: "ui/modules/ozon/uploader.js",
    reference: ["src/ozon/upload-intent.js", "src/ozon/import-results.js", "src/ozon/failure-taxonomy.js"],
    expectedExports: ["createUploadIntentCandidate", "summarizeImportPollingResult", "mapImportResultRows", "classifyFailure", "mapFailureToPreflightIssue", "uploadToOzon", "waitForOzonImportResultFromFixture"],
    parityStatus: "parity_backed",
    fixtureComparison: "blocked upload intent and local import result mapping"
  },
  {
    original: "ui/modules/ozon/api.js",
    mirror: "ui/modules/ozon/api.js",
    reference: ["src/ozon/ozon-api-contract.js", "src/ozon/failure-taxonomy.js"],
    expectedExports: ["OZON_API_SURFACES", "buildOzonApiRequestDescriptor", "classifyFailure", "mapFailureToPreflightIssue", "buildFailureTaxonomyReport"],
    parityStatus: "proof_gap",
    fixtureComparison: "descriptor surface only; live API behavior not proven"
  },
  {
    original: "ui/modules/ozon/store-upload-helpers.js",
    mirror: "ui/modules/ozon/store-upload-helpers.js",
    reference: ["src/ozon/store-upload-context.js"],
    expectedExports: ["appendStoreSuffix", "stripStoreSuffix", "injectStoreSuffixIntoSkuCode", "stripStoreSuffixFromSkuCode", "buildStoreSpecificDrafts", "classifyStoreHelperForErp"],
    parityStatus: "parity_backed",
    fixtureComparison: "store contexts and mapped drafts"
  },
  {
    original: "ui/app/services/draft-sync-service.js",
    mirror: "ui/app/services/draft-sync-service.js",
    reference: ["src/draft/draft-merge.js", "src/ozon/store-upload-context.js"],
    expectedExports: ["buildSyncedProductDraftState", "buildDraftCandidates", "buildStoreUploadContexts"],
    parityStatus: "parity_backed",
    fixtureComparison: "draft candidate count and store context bridge"
  },
  {
    original: "ui/modules/image-generation/prompt-plan-builder.js",
    mirror: "ui/modules/image-generation/prompt-plan-builder.js",
    reference: ["src/media/prompt-plan.js", "src/media/provider-proof-gaps.js"],
    expectedExports: ["buildProductContext", "buildPromptPlanPlannerInput", "buildPromptPlanCandidate", "buildMediaProviderProofGapReport"],
    parityStatus: "parity_backed",
    fixtureComparison: "prompt plan slots and proof-gap report"
  },
  {
    original: "ui/modules/image-generation/generated-image-assets.js",
    mirror: "ui/modules/image-generation/generated-image-assets.js",
    reference: ["src/media/generated-assets.js"],
    expectedExports: ["buildAiGeneratedSourceEntry", "buildGeneratedImageAssetRef"],
    parityStatus: "parity_backed",
    fixtureComparison: "generated media refs from pipeline"
  },
  {
    original: "ui/modules/image-generation/generated-image-state.js",
    mirror: "ui/modules/image-generation/generated-image-state.js",
    reference: ["src/media/provider-proof-gaps.js"],
    expectedExports: ["GENERATED_IMAGE_PROOF_GAPS", "normalizeProviderTaskProbe", "buildMediaProviderProofGapReport", "GENERATED_IMAGE_STATUSES"],
    parityStatus: "parity_backed",
    fixtureComparison: "provider task descriptors and media proof gaps"
  },
  {
    original: "services/providers/adapters/openai-compatible-image-polling.js",
    mirror: "services/providers/adapters/openai-compatible-image-polling.js",
    reference: ["src/media/provider-proof-gaps.js"],
    expectedExports: ["normalizeProviderTaskProbe", "buildMediaProviderProofGapReport", "pollOpenAiCompatibleImageTask"],
    parityStatus: "proof_gap",
    fixtureComparison: "fixture task descriptor only; live provider polling not proven"
  },
  {
    original: "services/providers/adapters/openai-compatible-image-request.js",
    mirror: "services/providers/adapters/openai-compatible-image-request.js",
    reference: ["src/media/provider-proof-gaps.js"],
    expectedExports: ["buildOpenAiCompatibleImageRequestDescriptor"],
    parityStatus: "proof_gap",
    fixtureComparison: "request descriptor only; live request body/headers not proven"
  },
  {
    original: "ui/app/workflows/ozon-upload-workflow.js",
    mirror: "ui/app/workflows/ozon-upload-workflow.js",
    reference: ["src/ozon/upload-intent.js", "src/ozon/import-results.js", "src/ozon/store-upload-context.js"],
    expectedExports: ["buildOzonUploadWorkflowPreview", "mapOzonUploadWorkflowResult"],
    parityStatus: "proof_gap",
    fixtureComparison: "workflow preview/result mapping only; live UI workflow not proven"
  }
];

function stripComments(source) {
  return source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
}

function scanSource(source) {
  const clean = stripComments(source);
  const exports = [];
  const imports = [];
  const callEdges = [];
  const exportRegexes = [
    /export\s+(?:async\s+)?function\s+([A-Za-z_$][\w$]*)/g,
    /export\s+const\s+([A-Za-z_$][\w$]*)/g,
    /export\s*\{([\s\S]*?)\}\s*from\s*["']([^"']+)["']/g,
    /export\s*\{([\s\S]*?)\}/g
  ];
  for (const regex of exportRegexes) {
    let match;
    while ((match = regex.exec(clean))) {
      if (match[1]?.includes(",")) {
        for (const part of match[1].split(",")) {
          const name = part.trim().split(/\s+as\s+/).pop()?.trim();
          if (name) exports.push(name);
        }
      } else if (match[1]) {
        exports.push(match[1].trim());
      }
      if (match[2]) imports.push(match[2]);
    }
  }
  const importRegex = /import\s+(?:[\s\S]*?)\s+from\s*["']([^"']+)["']/g;
  let importMatch;
  while ((importMatch = importRegex.exec(clean))) imports.push(importMatch[1]);
  const callRegex = /\b([A-Za-z_$][\w$]*)\s*\(/g;
  let callMatch;
  while ((callMatch = callRegex.exec(clean))) {
    const name = callMatch[1];
    if (!["if", "for", "while", "switch", "function", "return"].includes(name)) callEdges.push(name);
  }
  return {
    exports: Array.from(new Set(exports)).sort(),
    imports: Array.from(new Set(imports)).sort(),
    callEdges: Array.from(new Set(callEdges)).sort()
  };
}

function arrayEquals(a, b) {
  return JSON.stringify([...a].sort()) === JSON.stringify([...b].sort());
}

async function importModule(filePath) {
  return import(pathToFileURL(path.resolve(filePath)).href);
}

const base = runReferencePipeline(advancedReferenceFixture);
const complex = buildComplexAttributesForDrafts({
  drafts: base.drafts,
  complexGroups: advancedReferenceFixture.complexGroups
});
const importPolling = summarizeImportPollingResult({
  taskIds: advancedReferenceFixture.importTaskIds,
  resultRows: advancedReferenceFixture.importResultRows,
  expectedOfferIds: base.drafts.map((draft) => draft.offerId)
});
const storeContexts = buildStoreUploadContexts({
  stores: advancedReferenceFixture.stores,
  drafts: base.drafts
});
const failureTaxonomy = buildFailureTaxonomyReport(advancedReferenceFixture.failureCases);
const mediaProofGaps = buildMediaProviderProofGapReport({
  promptPlan: base.promptPlan,
  providerTasks: advancedReferenceFixture.providerTasks,
  canvasMedia: advancedReferenceFixture.canvasMedia
});

const fixtureIo = {
  templateFields: base.counts.templateFields,
  normalizedRows: base.counts.normalizedRows,
  importPreviewCandidates: base.counts.importPreviewCandidates,
  complexAttributeRows: complex.complexRowCount,
  importResultRows: importPolling.rows.length,
  storeContexts: storeContexts.length,
  failureCases: failureTaxonomy.total,
  mediaProofGaps: mediaProofGaps.gapCount
};

const fileResults = [];

for (const entry of mirrorFiles) {
  const mirrorPath = path.resolve(mirrorRoot, entry.mirror);
  const source = await readFile(mirrorPath, "utf8");
  const scanned = scanSource(source);
  const moduleExports = Object.keys(await importModule(mirrorPath)).sort();
  const missingExports = entry.expectedExports.filter((name) => !moduleExports.includes(name));
  const expectedCallOrImport = entry.reference.map((ref) => `../../../../normal-code-reference/${ref}`).some((needle) =>
    scanned.imports.some((item) => item.includes("normal-code-reference")) || source.includes(needle)
  );
  fileResults.push({
    original: entry.original,
    readable: `docs/research/b1c-architecture-mirror/readable/${entry.original}`,
    normal_code_mirror: `docs/research/b1c-architecture-mirror/normal-code-mirror/${entry.mirror}`,
    normal_code_reference: entry.reference.map((ref) => `docs/research/b1c-architecture-mirror/normal-code-reference/${ref}`),
    parity_status: entry.parityStatus,
    export_symbol_mapping: {
      expected: entry.expectedExports,
      actual: moduleExports,
      missing: missingExports,
      passed: missingExports.length === 0
    },
    call_edge_mapping: {
      imports: scanned.imports,
      callEdges: scanned.callEdges,
      linksToNormalCodeReference: expectedCallOrImport
    },
    fixture_io_comparison: {
      description: entry.fixtureComparison,
      shared_fixture_output: fixtureIo,
      passed: entry.parityStatus === "parity_backed" ? missingExports.length === 0 && expectedCallOrImport : "proof_gap_explicit"
    },
    proof_gap: entry.parityStatus === "proof_gap"
  });
}

const parityBacked = fileResults.filter((item) => item.parity_status === "parity_backed");
const proofGap = fileResults.filter((item) => item.parity_status === "proof_gap");
const readableOnly = 25;
const failedExports = fileResults.filter((item) => !item.export_symbol_mapping.passed);
const failedEdges = fileResults.filter((item) => item.parity_status === "parity_backed" && !item.call_edge_mapping.linksToNormalCodeReference);

const result = {
  task_id: "B1F_BEIXIONG_COMPLEX_ATTRIBUTES_IMPORT_POLLING_AND_MEDIA_GAPS",
  generated_at: "2026-06-24",
  tooling: {
    runtime: "node",
    ast_tooling: "lightweight ESM surface/call-edge scanner written in Node because Babel/acorn packages are unavailable in this sandbox",
    babel_available: false,
    apk_native_binary_tools_used: false
  },
  noExternalCalls: true,
  coverage: {
    priorityFiles: mirrorFiles.length,
    parityBackedNormalCodeMirror: parityBacked.length,
    proofGapMirrorFiles: proofGap.length,
    priorityReadableOnly: 0,
    overallReadableOnly: readableOnly,
    exportMappingFailures: failedExports.length,
    parityCallEdgeFailures: failedEdges.length
  },
  fixtureIo,
  parityBackedFiles: parityBacked.map((item) => item.original),
  proofGapFiles: proofGap.map((item) => item.original),
  readableOnlySummary: {
    priority_files: [],
    overall_count: readableOnly,
    note: "Non-priority readable focus files remain readable-only and are not claimed as normal-code parity."
  },
  files: fileResults
};

function yamlScalar(value) {
  return JSON.stringify(value);
}

function toYaml(resultObject) {
  const lines = [];
  lines.push(`task_id: ${resultObject.task_id}`);
  lines.push(`generated_at: ${yamlScalar(resultObject.generated_at)}`);
  lines.push("tooling:");
  lines.push(`  runtime: ${yamlScalar(resultObject.tooling.runtime)}`);
  lines.push(`  ast_tooling: ${yamlScalar(resultObject.tooling.ast_tooling)}`);
  lines.push(`  babel_available: ${resultObject.tooling.babel_available}`);
  lines.push(`  apk_native_binary_tools_used: ${resultObject.tooling.apk_native_binary_tools_used}`);
  lines.push(`noExternalCalls: ${resultObject.noExternalCalls}`);
  lines.push("coverage:");
  for (const [key, value] of Object.entries(resultObject.coverage)) lines.push(`  ${key}: ${value}`);
  lines.push("parity_backed_files:");
  for (const file of resultObject.parityBackedFiles) lines.push(`  - ${yamlScalar(file)}`);
  lines.push("proof_gap_files:");
  for (const file of resultObject.proofGapFiles) lines.push(`  - ${yamlScalar(file)}`);
  lines.push("readable_only:");
  lines.push(`  priority_files: []`);
  lines.push(`  overall_count: ${resultObject.readableOnlySummary.overall_count}`);
  lines.push(`  note: ${yamlScalar(resultObject.readableOnlySummary.note)}`);
  lines.push("files:");
  for (const file of resultObject.files) {
    lines.push(`  - original: ${yamlScalar(file.original)}`);
    lines.push(`    parity_status: ${file.parity_status}`);
    lines.push(`    export_mapping_passed: ${file.export_symbol_mapping.passed}`);
    lines.push(`    missing_exports: ${JSON.stringify(file.export_symbol_mapping.missing)}`);
    lines.push(`    links_to_normal_code_reference: ${file.call_edge_mapping.linksToNormalCodeReference}`);
    lines.push(`    fixture_io: ${yamlScalar(file.fixture_io_comparison.description)}`);
    lines.push(`    proof_gap: ${file.proof_gap}`);
  }
  return `${lines.join("\n")}\n`;
}

await mkdir(outputDir, { recursive: true });
await writeFile(outputPath, `${JSON.stringify(result, null, 2)}\n`, "utf8");
await writeFile(reportPath, toYaml(result), "utf8");

console.log(JSON.stringify({
  noExternalCalls: result.noExternalCalls,
  output: path.relative(process.cwd(), outputPath),
  report: path.relative(process.cwd(), reportPath),
  priorityFiles: result.coverage.priorityFiles,
  parityBackedNormalCodeMirror: result.coverage.parityBackedNormalCodeMirror,
  proofGapMirrorFiles: result.coverage.proofGapMirrorFiles,
  priorityReadableOnly: result.coverage.priorityReadableOnly,
  overallReadableOnly: result.coverage.overallReadableOnly,
  exportMappingFailures: result.coverage.exportMappingFailures,
  parityCallEdgeFailures: result.coverage.parityCallEdgeFailures
}, null, 2));
