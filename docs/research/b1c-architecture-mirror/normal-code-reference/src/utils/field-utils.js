export function normalizeText(value) {
  return String(value ?? "").trim();
}

export function lowerKey(value) {
  return normalizeText(value).toLowerCase();
}

export function toArray(value) {
  if (Array.isArray(value)) return value;
  if (value == null || value === "") return [];
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return [];
    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      try {
        const parsed = JSON.parse(trimmed);
        return Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        return trimmed.split(/[,;，；]/).map((item) => item.trim()).filter(Boolean);
      }
    }
    return trimmed.split(/[,;，；]/).map((item) => item.trim()).filter(Boolean);
  }
  return [value];
}

export function toNumber(value, fallback = 0) {
  const numeric = Number(value);
  return Number.isFinite(numeric) && numeric > 0 ? numeric : fallback;
}

export function unique(values) {
  return Array.from(new Set(values.filter((value) => value !== "" && value != null)));
}

export function compactOption(option) {
  if (typeof option === "string") return { v: option, i: null };
  return {
    v: normalizeText(option.v ?? option.value ?? option.label ?? option.name),
    i: option.i ?? option.id ?? option.dictionary_value_id ?? option.dictionaryValueId ?? null
  };
}

export function optionMap(options = []) {
  const byValue = new Map();
  for (const option of options.map(compactOption).filter((item) => item.v)) {
    byValue.set(lowerKey(option.v), option);
  }
  return byValue;
}
