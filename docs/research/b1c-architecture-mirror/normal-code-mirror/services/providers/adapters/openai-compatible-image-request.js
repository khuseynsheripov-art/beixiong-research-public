/**
 * B1F normal-code mirror.
 * original path: services/providers/adapters/openai-compatible-image-request.js
 * readable path: docs/research/b1c-architecture-mirror/readable/services/providers/adapters/openai-compatible-image-request.js
 * related normal-code-reference modules:
 * - src/media/provider-proof-gaps.js
 * confidence: proof_gap
 * proof gaps: live request body validation, provider headers, credentials, quota, and model-specific payload variants.
 */

export function buildOpenAiCompatibleImageRequestDescriptor({ providerId, model, prompt, referenceImages = [] }) {
  return {
    providerId,
    model,
    prompt,
    referenceImages,
    noProviderCallInReferenceProject: true,
    proofGap: "provider_request"
  };
}
