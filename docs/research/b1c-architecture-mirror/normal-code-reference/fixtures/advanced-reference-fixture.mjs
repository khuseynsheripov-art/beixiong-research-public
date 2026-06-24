export const advancedReferenceFixture = {
  categorySignals: {
    descriptionCategoryId: 17028922,
    typeId: 97031654,
    categoryTitle: "B1F Advanced Fixture Category",
    searchTerms: ["certified steel organizer", "multi store storage rack"],
    titleHints: ["certified steel organizer"],
    tagHints: ["certified", "storage", "steel"]
  },
  categoryAttributes: [
    { id: 4180, name: "Name", description: "Product title", is_required: true, type: "String" },
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
        { value: "White", id: 202 },
        { value: "Blue", id: 203 }
      ]
    },
    { id: 9024, name: "Material", description: "Main material", is_required: false, type: "String" },
    {
      id: 70010,
      complex_id: 9001,
      name: "Certificate type",
      description: "Complex certification row type",
      is_required: true,
      dictionary_id: 7001,
      type: "String",
      values: [
        { value: "EAC", id: 9101 },
        { value: "Declaration", id: 9102 }
      ]
    },
    {
      id: 70011,
      complex_id: 9001,
      name: "Certificate number",
      description: "Complex certification row number",
      is_required: true,
      type: "String"
    },
    {
      id: 70012,
      complex_id: 9002,
      name: "Package set item",
      description: "Optional kit component",
      is_required: false,
      is_collection: true,
      type: "String"
    }
  ],
  complexGroups: [
    {
      complexId: 9001,
      name: "Certification",
      fields: [
        {
          label: "Certificate type",
          attributeId: 70010,
          required: true,
          options: [
            { v: "EAC", i: 9101 },
            { v: "Declaration", i: 9102 }
          ]
        },
        { label: "Certificate number", attributeId: 70011, required: true }
      ]
    },
    {
      complexId: 9002,
      name: "Package set",
      fields: [
        { label: "Package set item", attributeId: 70012, required: false }
      ]
    }
  ],
  sourcePack: {
    sourceId: "B1F-ADV",
    title: "Certified steel organizer source item",
    sourceUrl: "https://fixture.invalid/source/certified-steel-organizer",
    images: [
      "https://fixture.invalid/b1f/main.jpg",
      "https://fixture.invalid/b1f/detail.jpg"
    ],
    pricing: { priceCny: 1390, oldPriceCny: 1690 },
    packaging: { weightG: 700, widthMm: 240, heightMm: 80, depthMm: 360 },
    supplier: { name: "Fixture Supplier", platform: "fixture" },
    skuFacts: [
      { skuKey: "black", color: "Black", priceCny: 1390, oldPriceCny: 1690, weightG: 700 },
      { skuKey: "white", color: "White", priceCny: 1390, oldPriceCny: 1690, weightG: 700 }
    ],
    evidence: [{ kind: "fixture", path: "normal-code-reference/fixtures/advanced-reference-fixture.mjs" }]
  },
  formGroup: {
    groupId: "shape-certified-steel-organizer",
    strategy: "erp_shape_group_preselected",
    skuKeys: ["black", "white"],
    decisions: [{ reason: "B1F keeps form group input ERP-owned for multi-store expansion" }]
  },
  canvasMedia: {
    mainImage: "https://fixture.invalid/b1f/canvas-main.jpg",
    gallery: ["https://fixture.invalid/b1f/canvas-detail.jpg"],
    colorImage: "https://fixture.invalid/b1f/canvas-color.jpg",
    video: "https://fixture.invalid/b1f/canvas-video.mp4",
    editableSuiteId: "fixture-suite-b1f",
    provenance: [{ source: "fixture", noProviderCall: true }]
  },
  selectionSignals: {
    selection: { score: null, reserved: true },
    profit: { grossMargin: null, reserved: true },
    future3d: { cluster: null, reserved: true }
  },
  aiRows: [
    {
      Name: "Certified steel organizer black",
      Color: ["Black"],
      Material: "steel",
      "Certificate type": "EAC",
      "Certificate number": "EAC-FIX-001",
      "Package set item": ["rack", "screw kit"]
    },
    {
      Name: "Certified steel organizer white",
      Color: ["White"],
      Material: "steel",
      "Certificate type": "Declaration",
      "Package set item": ["rack"],
      UnexpectedField: "should become review issue"
    }
  ],
  stores: [
    { storeId: "store-main", name: "Main Store", suffix: "main" },
    { storeId: "store-spb", name: "SPB Store", suffix: "spb" }
  ],
  importTaskIds: ["fixture-task-1"],
  importResultRows: [
    { task_id: "fixture-task-1", offer_id: "B1F-ADV-1", product_id: 111, status: "imported", warnings: [], errors: [] },
    { task_id: "fixture-task-1", offer_id: "B1F-ADV-2", product_id: null, status: "failed", warnings: [], errors: ["duplicate offer sku"] },
    { task_id: "fixture-task-1", offer_id: "B1F-ADV-3", product_id: null, status: "manual_review", warnings: ["media requires manual review"], errors: [] },
    { task_id: "fixture-task-1", offer_id: "B1F-ADV-4", product_id: null, status: "processing", warnings: ["still pending"], errors: [] }
  ],
  failureCases: [
    { source: "ozon_auth", message: "API key missing", owner: "external-write-gate" },
    { source: "ozon_permission", message: "permission denied for category", owner: "ozon-adapter" },
    { source: "ozon_schema", message: "category attribute schema mismatch", owner: "product-workbench" },
    { source: "ozon_validation", message: "required value missing", owner: "preflight" },
    { source: "ozon_media", message: "image validation failed", owner: "canvas-media" },
    { source: "ozon_import_result", message: "duplicate offer sku", owner: "upload-intent" },
    { source: "ozon_polling", message: "polling timeout while waiting for import result", owner: "upload-intent" }
  ],
  providerTasks: [
    { providerTaskId: "provider-task-1", providerId: "fixture-provider", model: "fixture-image", status: "succeeded", outputUrls: ["https://fixture.invalid/b1f/generated-main.jpg"] },
    { providerTaskId: "provider-task-2", providerId: "fixture-provider", model: "fixture-image", status: "failed", error: "task failed in provider" },
    { providerTaskId: "provider-task-3", providerId: "fixture-provider", model: "fixture-image", status: "processing" }
  ]
};
