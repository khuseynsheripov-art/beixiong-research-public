import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { referenceFixture } from "../fixtures/reference-fixture.mjs";
import { runReferencePipeline } from "../src/pipeline/run-reference-pipeline.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const outputDir = path.join(root, "output");
const outputPath = path.join(outputDir, "b1e-smoke-output.json");

const result = runReferencePipeline(referenceFixture);

await mkdir(outputDir, { recursive: true });
await writeFile(outputPath, `${JSON.stringify(result, null, 2)}\n`, "utf8");

console.log(JSON.stringify({
  noExternalCalls: result.noExternalCalls,
  output: path.relative(process.cwd(), outputPath),
  templateFields: result.counts.templateFields,
  attributeGapFields: result.counts.attributeGapFields,
  normalizedRows: result.counts.normalizedRows,
  draftCandidates: result.counts.draftCandidates,
  importPreviewCandidates: result.counts.importPreviewCandidates,
  preflightIssues: result.counts.preflightIssues,
  uploadIntentIssues: result.counts.uploadIntentIssues,
  readyForLiveWrite: result.uploadIntent.readyForLiveWrite
}, null, 2));
