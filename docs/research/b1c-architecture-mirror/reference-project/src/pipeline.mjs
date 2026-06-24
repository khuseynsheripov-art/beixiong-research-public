import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  buildAiSchema,
  buildTemplateMeta,
} from '../../../../../ui/modules/ozon/category-builder.js';
import {
  countPayloadOptions,
  splitSchemaPayload,
} from '../../../../../ui/modules/text/schema-payload.js';
import {
  formatValidationStats,
  normalizeAiRows,
  sanitizeRowsBySchema,
} from '../../../../../ui/modules/text/row-normalizer.js';
import {
  buildAttributesArray,
  buildImportItems,
} from '../../../../../ui/modules/ozon/uploader-payload.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(here, '../../../../..');
const fixtureDir = path.join(projectRoot, 'docs/research/b1c-architecture-mirror/fixture-traces');
const outputDir = path.join(projectRoot, 'docs/research/b1c-architecture-mirror/reference-project/output');

function readJson(file) {
  return JSON.parse(fs.readFileSync(path.join(fixtureDir, file), 'utf8'));
}

function writeJson(file, value) {
  fs.mkdirSync(outputDir, { recursive: true });
  const json = JSON.stringify(value, null, 2)
    .replace(/[\u007f-\uffff]/g, (char) => `\\u${char.charCodeAt(0).toString(16).padStart(4, '0')}`);
  fs.writeFileSync(path.join(outputDir, file), `${json}\n`, 'utf8');
}

function buildCompactSchemaPayload(aiSchema) {
  const fields = [];
  const pushDropdown = (items, required) => {
    for (const item of items || []) {
      fields.push({
        k: item.label,
        t: 'select',
        m: item.isCollection ? 1 : 0,
        r: required ? 1 : 0,
        d: item.description || '',
        o: (item.options || []).map((option) => ({ v: option.value, i: option.info || '' })),
      });
    }
  };
  const pushText = (items, required) => {
    for (const item of items || []) {
      fields.push({
        k: item.label,
        t: 'text',
        r: required ? 1 : 0,
        d: item.description || '',
        maxLen: item.maxLen || 120,
      });
    }
  };
  const pushNumeric = (items, required) => {
    for (const item of items || []) {
      fields.push({
        k: item.label,
        t: 'number',
        r: required ? 1 : 0,
        d: item.description || '',
      });
    }
  };

  pushDropdown(aiSchema.required_dropdown, true);
  pushDropdown(aiSchema.optional_dropdown, false);
  pushText(aiSchema.required_text, true);
  pushText(aiSchema.optional_text, false);
  pushNumeric(aiSchema.required_numeric, true);
  pushNumeric(aiSchema.optional_numeric, false);

  if (aiSchema.nameFieldLabel) {
    fields.unshift({
      k: aiSchema.nameFieldLabel,
      t: 'text',
      p: 'title',
      r: 1,
      d: 'Product title field detected by buildTemplateMeta/buildAiSchema',
      maxLen: 120,
    });
  }
  if (aiSchema.descriptionFieldLabel) {
    fields.push({
      k: aiSchema.descriptionFieldLabel,
      t: 'text',
      p: 'description',
      r: 0,
      d: 'Generated product description field',
      maxLen: 900,
    });
  }
  if (aiSchema.tagsFieldLabel) {
    fields.push({
      k: aiSchema.tagsFieldLabel,
      t: 'text',
      p: 'tags',
      r: 0,
      d: 'Generated search tags field',
      maxLen: 120,
    });
  }

  return { categoryTitle: aiSchema.categoryTitle, fields };
}

function findSystemField(templateMeta, systemType) {
  return Object.entries(templateMeta.fieldMeta || {}).find(([, meta]) => meta?._systemFieldType === systemType)?.[0] || null;
}

function buildDrafts(rows, templateMeta) {
  const priceKey = findSystemField(templateMeta, 'price');
  const oldPriceKey = findSystemField(templateMeta, 'old_price');
  const weightKey = findSystemField(templateMeta, 'weight_g');
  const widthKey = findSystemField(templateMeta, 'width_mm');
  const heightKey = findSystemField(templateMeta, 'height_mm');
  const depthKey = findSystemField(templateMeta, 'depth_mm');
  return rows.map((row, index) => ({
    offerId: `B1D-REF-${index + 1}`,
    rowIndex: index,
    sourceSkuIndex: index,
    fields: {
      ...row,
      ...(priceKey ? { [priceKey]: '1290' } : {}),
      ...(oldPriceKey ? { [oldPriceKey]: '1590' } : {}),
      ...(weightKey ? { [weightKey]: index === 0 ? '640' : '' } : {}),
      ...(widthKey ? { [widthKey]: '220' } : {}),
      ...(heightKey ? { [heightKey]: '60' } : {}),
      ...(depthKey ? { [depthKey]: '330' } : {}),
    },
    media: {
      mainImage: `https://fixture.invalid/reference/sku-${index + 1}-main.jpg`,
      extraImages: [`https://fixture.invalid/reference/sku-${index + 1}-detail.jpg`],
      colorSample: `https://fixture.invalid/reference/sku-${index + 1}-color.jpg`,
      videoUrl: index === 0 ? 'https://fixture.invalid/reference/sku-1-video.mp4' : '',
    },
  }));
}

function buildReview(stats, drafts, importItems) {
  const review = [];
  if (stats.unknownKeys) {
    review.push({ gate: 'schema_unknown_keys', severity: 'review', evidence: stats.unknownKeySamples });
  }
  if (stats.invalidSelectValues) {
    review.push({ gate: 'invalid_select_values', severity: 'block_or_regenerate', evidence: stats.invalidSelectValues });
  }
  if (stats.invalidTagValues) {
    review.push({ gate: 'invalid_tag_values', severity: 'review', evidence: stats.invalidTagValues });
  }
  drafts.forEach((draft, index) => {
    const item = importItems[index];
    if (item.attributes.some((attribute) => attribute.values && attribute.values.length === 0)) {
      review.push({ gate: 'empty_attribute_values', severity: 'block', draft: draft.offerId });
    }
    if (String(draft.media.mainImage).startsWith('https://fixture.invalid/')) {
      review.push({ gate: 'fixture_media_placeholder', severity: 'research_only', draft: draft.offerId });
    }
  });
  return review;
}

const { categoryInfo, categoryAttributes } = readJson('category-attributes.fixture.json');
const { sourceRows, sampleAiRows } = readJson('source-rows.fixture.json');

const templateMeta = buildTemplateMeta(categoryAttributes, categoryInfo.categoryTitle);
const aiSchema = buildAiSchema(templateMeta);
const compactSchemaPayload = buildCompactSchemaPayload(aiSchema);
const splitPayload = splitSchemaPayload(compactSchemaPayload);
const stats = {};
const normalizedRows = normalizeAiRows(sampleAiRows, {
  expectedRows: sampleAiRows.length,
  schemaPayload: compactSchemaPayload,
  outStats: stats,
});
const sanitizedRows = sanitizeRowsBySchema(normalizedRows, compactSchemaPayload);
const drafts = buildDrafts(sanitizedRows, templateMeta);
const attributesByDraft = drafts.map((draft) => ({
  offerId: draft.offerId,
  attributes: buildAttributesArray(draft.fields, templateMeta),
}));
const importItems = buildImportItems({
  drafts,
  templateMeta,
  categoryInfo,
  rawData: {
    sku_matrix: sourceRows.map((row) => ({ stock: row.sourceStock })),
    global_data: { packaging: { weight_g: 650, width_mm: 220, height_mm: 60, depth_mm: 330 } },
  },
});
const manualReview = buildReview(stats, drafts, importItems);

const output = {
  referenceProject: 'B1D runnable research reference',
  noExternalCalls: true,
  moduleImports: [
    'ui/modules/ozon/category-builder.js',
    'ui/modules/text/schema-payload.js',
    'ui/modules/text/row-normalizer.js',
    'ui/modules/ozon/uploader-payload.js',
  ],
  flow: {
    categoryInfo,
    templateMeta,
    aiSchema,
    compactSchemaPayload,
    splitPayload,
    normalizedRows,
    sanitizedRows,
    normalizationStats: stats,
    normalizationStatsText: formatValidationStats(stats),
    drafts,
    attributesByDraft,
    importItems,
    manualReview,
  },
};

writeJson('reference-output.json', output);
console.log(JSON.stringify({
  output: path.relative(projectRoot, path.join(outputDir, 'reference-output.json')),
  normalizedRows: normalizedRows.length,
  importItems: importItems.length,
  manualReviewRows: manualReview.length,
}, null, 2));
