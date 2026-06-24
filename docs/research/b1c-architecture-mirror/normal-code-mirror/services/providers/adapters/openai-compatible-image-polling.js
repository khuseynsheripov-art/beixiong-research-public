/**
 * B1F normal-code mirror.
 * original path: services/providers/adapters/openai-compatible-image-polling.js
 * readable path: docs/research/b1c-architecture-mirror/readable/services/providers/adapters/openai-compatible-image-polling.js
 * related normal-code-reference modules:
 * - src/media/provider-proof-gaps.js
 * confidence: behavior_verified_by_fixture for fixture task status mapping; proof_gap for live provider polling.
 * proof gaps: live provider polling, auth errors, quota, retry timing, response variants.
 */

export {
  normalizeProviderTaskProbe,
  buildMediaProviderProofGapReport
} from "../../../../normal-code-reference/src/media/provider-proof-gaps.js";

export async function pollOpenAiCompatibleImageTask(taskDescriptor) {
  return normalizeProviderTaskProbe({
    ...taskDescriptor,
    status: taskDescriptor.status || "processing"
  });
}
