export const MEDIA_PROOF_GAP = Object.freeze({
  REFERENCE_SELECTION: "reference_selection",
  PROMPT_PLAN: "prompt_plan",
  PROVIDER_REQUEST: "provider_request",
  PROVIDER_POLLING: "provider_polling",
  GENERATED_ASSET_ACCEPTANCE: "generated_asset_acceptance"
});

function normalizeProviderStatus(status) {
  const text = String(status || "").toLowerCase();
  if (/success|done|completed/.test(text)) return "succeeded";
  if (/fail|error|reject/.test(text)) return "failed";
  if (/process|queue|pending|running/.test(text)) return "processing";
  return "unknown";
}

export function normalizeProviderTaskProbe(task) {
  const status = normalizeProviderStatus(task.status);
  return {
    providerTaskId: task.providerTaskId || task.taskId || "",
    providerId: task.providerId || "",
    model: task.model || task.providerModel || "",
    status,
    outputUrls: task.outputUrls || [task.outputUrl].filter(Boolean),
    error: task.error || "",
    noProviderCallInReferenceProject: true,
    proofGap: status === "succeeded" ? MEDIA_PROOF_GAP.GENERATED_ASSET_ACCEPTANCE : MEDIA_PROOF_GAP.PROVIDER_POLLING
  };
}

export function buildMediaProviderProofGapReport({ promptPlan, providerTasks = [], canvasMedia }) {
  const normalizedTasks = providerTasks.map(normalizeProviderTaskProbe);
  const gaps = [
    {
      gap: MEDIA_PROOF_GAP.REFERENCE_SELECTION,
      status: canvasMedia?.provenance?.length ? "fixture_backed" : "proof_gap",
      recommendation: "CanvasMediaBridge should carry source image provenance and editable suite id."
    },
    {
      gap: MEDIA_PROOF_GAP.PROMPT_PLAN,
      status: promptPlan?.requestedSlots?.length ? "fixture_backed" : "proof_gap",
      recommendation: "Product Workbench should keep prompt slots and non-invention constraints visible."
    },
    {
      gap: MEDIA_PROOF_GAP.PROVIDER_REQUEST,
      status: "proof_gap",
      recommendation: "Provider request bodies and headers remain outside B1F; use approved provider adapter only."
    },
    {
      gap: MEDIA_PROOF_GAP.PROVIDER_POLLING,
      status: normalizedTasks.length ? "fixture_backed_descriptor_only" : "proof_gap",
      recommendation: "Represent provider polling as descriptor/result mapping, not live call."
    },
    {
      gap: MEDIA_PROOF_GAP.GENERATED_ASSET_ACCEPTANCE,
      status: "needs_user_or_visual_acceptance",
      recommendation: "Do not treat generated URLs as accepted Canvas media until image quality/user review passes."
    }
  ];

  return {
    contract: "CanvasMediaProviderProofGapCandidate",
    tasks: normalizedTasks,
    gaps,
    gapCount: gaps.length,
    noExternalCalls: true
  };
}
