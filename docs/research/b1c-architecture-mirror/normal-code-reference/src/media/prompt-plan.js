export function buildProductContext({ sourcePack, categorySignals, formGroup }) {
  return {
    title: sourcePack.title,
    sourceUrl: sourcePack.sourceUrl,
    supplier: sourcePack.supplier,
    skuFacts: sourcePack.skuFacts,
    category: {
      descriptionCategoryId: categorySignals.descriptionCategoryId,
      typeId: categorySignals.typeId,
      categoryTitle: categorySignals.categoryTitle
    },
    searchTerms: categorySignals.searchTerms || [],
    formGroup,
    mustNotInvent: ["certification", "brand authorization", "performance claims", "contact info"]
  };
}

export function buildPromptPlanCandidate({ sourcePack, categorySignals, formGroup, canvasMedia }) {
  const productContext = buildProductContext({ sourcePack, categorySignals, formGroup });
  return {
    schemaVersion: "2.0-reference",
    contract: "CanvasMediaPromptPlanCandidate",
    productContext,
    requestedSlots: [
      { slot: "main_image", aspectRatio: "3:4", referenceImages: [canvasMedia.mainImage || sourcePack.images?.[0]].filter(Boolean) },
      { slot: "gallery", aspectRatio: "3:4", referenceImages: canvasMedia.gallery || sourcePack.images || [] },
      { slot: "color_image", aspectRatio: "1:1", referenceImages: [canvasMedia.colorImage].filter(Boolean) }
    ],
    rules: [
      "preserve product structure, color, and material",
      "do not add logo, watermark, promotion text, contact info, certification, or warranty claims",
      "keep source evidence linked to generated media refs"
    ]
  };
}
