const DEFAULT_LIMITS = {
  structural: 40,
  multiSelect: 20,
  plainText: 60,
  description: 8,
  tags: 8
};

export function splitSchemaPayload(aiSchema, limits = DEFAULT_LIMITS) {
  const fields = aiSchema.fields || [];
  const byLane = {
    structural: [],
    multiSelect: [],
    plainText: [],
    description: [],
    tags: []
  };

  for (const field of fields) {
    if (field.p === "description") byLane.description.push(field);
    else if (field.p === "tags") byLane.tags.push(field);
    else if (field.t === "select" && field.m) byLane.multiSelect.push(field);
    else if (field.t === "text" || field.t === "select") byLane.plainText.push(field);
    else byLane.structural.push(field);
  }

  return Object.fromEntries(
    Object.entries(byLane).map(([lane, laneFields]) => [
      `${lane}Payload`,
      { categoryTitle: aiSchema.categoryTitle, fields: laneFields.slice(0, limits[lane] || laneFields.length) }
    ])
  );
}

export function countPayloadOptions(payload) {
  return (payload.fields || []).reduce((count, field) => count + (field.o?.length || 0), 0);
}

export function mergeSchemaPayloads(...payloads) {
  const categoryTitle = payloads.find((payload) => payload?.categoryTitle)?.categoryTitle || "";
  const fields = payloads.flatMap((payload) => payload?.fields || []);
  return { categoryTitle, fields };
}
