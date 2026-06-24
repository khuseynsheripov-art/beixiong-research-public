function clean(value) {
  return String(value ?? "").trim();
}

export function appendStoreSuffix(value, storeSuffix) {
  const base = clean(value);
  const suffix = clean(storeSuffix).replace(/^-+/, "");
  if (!base || !suffix || base.endsWith(`-${suffix}`)) return base;
  return `${base}-${suffix}`;
}

export function stripStoreSuffix(value, storeSuffix) {
  const base = clean(value);
  const suffix = clean(storeSuffix).replace(/^-+/, "");
  if (!suffix || !base.endsWith(`-${suffix}`)) return base;
  return base.slice(0, -suffix.length - 1);
}

export function injectStoreSuffixIntoSkuCode(skuCode, storeSuffix) {
  return appendStoreSuffix(skuCode, storeSuffix).toUpperCase();
}

export function stripStoreSuffixFromSkuCode(skuCode, storeSuffix) {
  return stripStoreSuffix(skuCode, storeSuffix).toUpperCase();
}

export function buildStoreUploadContexts({ stores = [], drafts = [] }) {
  return stores.map((store) => {
    const suffix = clean(store.suffix || store.code || store.storeId);
    const mappedDrafts = drafts.map((draft) => ({
      draftId: draft.draftId,
      storeId: store.storeId,
      offerId: appendStoreSuffix(draft.offerId, suffix),
      skuCode: injectStoreSuffixIntoSkuCode(draft.sourceSkuKey || draft.offerId, suffix),
      originalOfferId: draft.offerId
    }));
    return {
      contract: "StoreUploadContextCandidate",
      storeId: store.storeId,
      storeName: store.name,
      suffix,
      mappedDrafts,
      erpOwnership: "ERP should own store config and suffix policy; Beixiong helper behavior is reference only."
    };
  });
}

export function classifyStoreHelperForErp() {
  return {
    borrow: ["suffix collision prevention", "strip/append symmetry tests"],
    translate: ["store config", "offer id policy", "SKU namespace ownership"],
    reject: ["implicit global suffix mutation", "browser-account-coupled store selection"],
    proof_gap: ["real multi-store upload result mapping was not executed"]
  };
}
