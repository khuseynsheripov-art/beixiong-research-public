export const referenceFixture = {
  categorySignals: {
    descriptionCategoryId: 17028922,
    typeId: 97031654,
    categoryTitle: "B1E Demo Fixture Category",
    searchTerms: ["steel organizer", "storage rack"],
    titleHints: ["compact steel organizer"],
    tagHints: ["home storage", "steel"]
  },
  categoryAttributes: [
    {
      id: 4180,
      name: "Name",
      description: "Product title shown to Ozon buyers",
      is_required: true,
      type: "String"
    },
    {
      id: 10096,
      name: "Color",
      description: "Visible product color",
      is_required: true,
      is_collection: true,
      dictionary_id: 1002,
      type: "String",
      values: [
        { value: "Black", id: 201 },
        { value: "White", id: 202 }
      ]
    },
    {
      id: 777001,
      name: "Battery included",
      description: "Manual safety check field",
      is_required: false,
      type: "String",
      values: [
        { value: "No", id: 301 },
        { value: "Yes", id: 302 }
      ]
    },
    {
      id: 9024,
      name: "Material",
      description: "Main material",
      is_required: false,
      type: "String"
    },
    {
      id: 85,
      name: "Brand",
      description: "Brand value",
      is_required: true,
      dictionary_id: 1001,
      type: "String",
      freeTextDictionaryValue: true
    }
  ],
  sourcePack: {
    sourceId: "B1E-REF",
    title: "Steel organizer source item",
    sourceUrl: "https://fixture.invalid/source/steel-organizer",
    images: [
      "https://fixture.invalid/reference/sku-main.jpg",
      "https://fixture.invalid/reference/sku-detail.jpg"
    ],
    pricing: { priceCny: 1290, oldPriceCny: 1590 },
    packaging: { weightG: 640, widthMm: 220, heightMm: 60, depthMm: 330 },
    supplier: { name: "Fixture Supplier", platform: "fixture" },
    skuFacts: [
      { skuKey: "black", color: "Black", priceCny: 1290, oldPriceCny: 1590, weightG: 640 },
      { skuKey: "blue", color: "Blue", priceCny: 1290, oldPriceCny: 1590, weightG: "" }
    ],
    evidence: [{ kind: "fixture", path: "normal-code-reference/fixtures/reference-fixture.mjs" }]
  },
  formGroup: {
    groupId: "shape-steel-organizer",
    strategy: "erp_shape_group_preselected",
    skuKeys: ["black", "blue"],
    decisions: [{ reason: "B1E reserves FormGroup input to reduce manual SKU grouping friction" }]
  },
  canvasMedia: {
    mainImage: "https://fixture.invalid/reference/canvas-main.jpg",
    gallery: ["https://fixture.invalid/reference/canvas-detail.jpg"],
    colorImage: "https://fixture.invalid/reference/canvas-color.jpg",
    video: "https://fixture.invalid/reference/canvas-video.mp4",
    editableSuiteId: "fixture-suite-1",
    provenance: [{ source: "fixture", noProviderCall: true }]
  },
  selectionSignals: {
    selection: { score: null, reserved: true },
    profit: { grossMargin: null, reserved: true },
    future3d: { cluster: null, reserved: true }
  },
  aiRows: [
    {
      Name: "Steel organizer BrandX black",
      Color: ["Black"],
      Material: "steel",
      "Battery included": "No",
      UnexpectedField: "must be reviewed"
    },
    {
      Name: "Steel organizer BrandX blue",
      Color: ["Blue"],
      Material: "steel"
    }
  ]
};
