/**
 * B1F normal-code mirror.
 * original path: ui/modules/image-generation/prompt-plan-builder.js
 * readable path: docs/research/b1c-architecture-mirror/readable/ui/modules/image-generation/prompt-plan-builder.js
 * related normal-code-reference modules:
 * - src/media/prompt-plan.js
 * - src/media/provider-proof-gaps.js
 * confidence: behavior_verified_by_fixture for local prompt plan shape.
 * proof gaps: provider-specific prompt acceptance and image quality.
 */

export {
  buildProductContext,
  buildPromptPlanCandidate as buildPromptPlanPlannerInput,
  buildPromptPlanCandidate
} from "../../../../normal-code-reference/src/media/prompt-plan.js";

export {
  buildMediaProviderProofGapReport
} from "../../../../normal-code-reference/src/media/provider-proof-gaps.js";
