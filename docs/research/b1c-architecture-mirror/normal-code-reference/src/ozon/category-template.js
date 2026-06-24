import { compactOption, normalizeText } from "../utils/field-utils.js";

const SYSTEM_FIELDS = [
  ["price", "Price, CNY", "price", true],
  ["old_price", "Old price, CNY", "old_price", false],
  ["weight_g", "Weight, g", "weight_g", true],
  ["width_mm", "Package width, mm", "width_mm", true],
  ["height_mm", "Package height, mm", "height_mm", true],
  ["depth_mm", "Package length, mm", "depth_mm", true]
];

function inferValueKind(attribute) {
  const type = normalizeText(attribute.type || attribute.valueType).toLowerCase();
  if (type.includes("integer") || type.includes("decimal") || type.includes("number")) return "numeric";
  if (attribute.dictionary_id || attribute.dictionaryId || Array.isArray(attribute.values)) return "select";
  if (type.includes("text") || type.includes("string")) return "text";
  return "text";
}

function inferSystemFieldType(attribute) {
  const name = normalizeText(attribute.name || attribute.attribute_name).toLowerCase();
  if (name.includes("brand")) return "brand";
  if (name.includes("название") || name.includes("name") || name.includes("title")) return "name";
  if (name.includes("description") || name.includes("описание")) return "description";
  if (name.includes("tag")) return "tags";
  return "";
}

export function shouldKeepCategoryAttribute(attribute) {
  if (!attribute) return false;
  if (attribute.disabled || attribute.is_deleted) return false;
  const name = normalizeText(attribute.name || attribute.attribute_name);
  return Boolean(name);
}

export function getDictionaryAttributeIds(attributes = []) {
  return attributes
    .filter((attribute) => shouldKeepCategoryAttribute(attribute))
    .filter((attribute) => Number(attribute.dictionary_id || attribute.dictionaryId || 0) > 0)
    .map((attribute) => Number(attribute.id || attribute.attribute_id));
}

export function buildCategoryTemplateMeta({ categoryInfo, attributes = [] }) {
  const editorOrder = [];
  const fieldMeta = {};

  for (const [key, label, systemFieldType, required] of SYSTEM_FIELDS) {
    editorOrder.push(label);
    fieldMeta[label] = {
      key,
      editorLabel: label,
      header: label,
      required,
      editable: true,
      isAutoManaged: true,
      valueKind: "numeric",
      isCollection: false,
      options: [],
      _optionIds: {},
      _ozonAttributeId: 0,
      _dictionaryId: 0,
      _systemFieldType: systemFieldType,
      _isNameField: false,
      evidence: "B1C/B1D uploader-payload system field defaults"
    };
  }

  for (const attribute of attributes.filter(shouldKeepCategoryAttribute)) {
    const label = normalizeText(attribute.name || attribute.attribute_name);
    const options = (attribute.values || attribute.options || []).map(compactOption).filter((item) => item.v);
    const optionIds = Object.fromEntries(options.map((option) => [option.v, option.i]));
    const systemFieldType = inferSystemFieldType(attribute);
    editorOrder.push(label);
    fieldMeta[label] = {
      key: label,
      editorLabel: label,
      header: label,
      description: normalizeText(attribute.description),
      groupName: normalizeText(attribute.group_name || attribute.groupName),
      required: Boolean(attribute.is_required ?? attribute.required),
      editable: true,
      isAutoManaged: systemFieldType === "brand",
      manualOnly: Boolean(attribute.manualOnly),
      userManaged: Boolean(attribute.userManaged),
      valueKind: inferValueKind(attribute),
      isCollection: Boolean(attribute.is_collection ?? attribute.isCollection),
      options,
      _optionIds: optionIds,
      _ozonAttributeId: Number(attribute.id || attribute.attribute_id || 0),
      _dictionaryId: Number(attribute.dictionary_id || attribute.dictionaryId || 0),
      _complexId: Number(attribute.complex_id || attribute.complexId || 0),
      _systemFieldType: systemFieldType,
      _isNameField: systemFieldType === "name",
      _freeTextDictionaryValue: Boolean(attribute.freeTextDictionaryValue),
      evidence: "B1C category-builder.js + B1D fixture trace"
    };
  }

  return {
    categoryInfo: { ...categoryInfo },
    categoryTitle: categoryInfo.categoryTitle,
    editorOrder,
    fieldMeta,
    dictionaryAttributeIds: getDictionaryAttributeIds(attributes)
  };
}
