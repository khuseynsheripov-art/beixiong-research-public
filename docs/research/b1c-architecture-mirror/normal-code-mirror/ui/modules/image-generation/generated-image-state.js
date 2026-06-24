/**
 * B1F normal-code mirror.
 * original path: ui/modules/image-generation/generated-image-state.js
 * readable path: docs/research/b1c-architecture-mirror/readable/ui/modules/image-generation/generated-image-state.js
 * related normal-code-reference modules:
 * - src/media/provider-proof-gaps.js
 * confidence: behavior_verified_by_fixture for provider task descriptor normalization.
 * proof gaps: full generated image UI state transitions and user acceptance.
 */

export {
  MEDIA_PROOF_GAP as GENERATED_IMAGE_PROOF_GAPS,
  normalizeProviderTaskProbe,
  buildMediaProviderProofGapReport
} from "../../../../normal-code-reference/src/media/provider-proof-gaps.js";

export const GENERATED_IMAGE_STATUSES = Object.freeze({
  PENDING: "pending",
  PROCESSING: "processing",
  SUCCEEDED: "succeeded",
  FAILED: "failed",
  ACCEPTANCE_REQUIRED: "acceptance_required"
});
