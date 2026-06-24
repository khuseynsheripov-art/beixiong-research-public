export const OZON_API_SURFACES = Object.freeze({
  categoryTree: { method: "POST", path: "/v1/description-category/tree", write: false },
  categoryAttributes: { method: "POST", path: "/v1/description-category/attribute", write: false },
  attributeValues: { method: "POST", path: "/v1/description-category/attribute/values", write: false },
  attributeValueSearch: { method: "POST", path: "/v1/description-category/attribute/value/search", write: false },
  productImport: { method: "POST", path: "/v3/product/import", write: true },
  importInfo: { method: "POST", path: "/v1/product/import/info", write: false },
  stockUpdate: { method: "POST", path: "/v2/products/stocks", write: true }
});

export function buildOzonApiRequestDescriptor(surface, body = {}) {
  const descriptor = OZON_API_SURFACES[surface];
  if (!descriptor) throw new Error(`Unknown Ozon API surface: ${surface}`);
  return {
    surface,
    ...descriptor,
    body,
    requiresApprovedCredentialBoundary: true,
    noLiveCallInReferenceProject: true,
    evidence: "B1C api.js static surface; B1E keeps descriptor only"
  };
}
