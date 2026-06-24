export function buildGeneratedImageAssetRef({
  draftId,
  slot,
  url,
  prompt,
  providerTaskId = null,
  sourceImages = [],
  editableSuiteId = null
}) {
  return {
    contract: "ProductWorkbenchMediaRef",
    sourceType: "ai_generated",
    draftId,
    slot,
    url,
    prompt,
    providerTaskId,
    sourceImages,
    editableSuiteId,
    provenance: {
      evidence: "B1C generated-image-assets.js / B1D media placeholder trace",
      noProviderCallInSmoke: true
    }
  };
}
