export function makeDefinerPrompt(
  term: string,
  options?: { audience?: string; tone?: string; maxLength?: number },
) {
  const audience = options?.audience ? ` for ${options.audience}` : "";
  const tone = options?.tone ? ` Use a ${options.tone} tone.` : "";
  const max = options?.maxLength
    ? ` Keep it under ${options.maxLength} words.`
    : "";

  return `Provide a clear, concise definition of the following term${audience}.${tone} ${max}\n\nTerm: "${term}"\n\nRespond with only the definition text (no bullet points, no numbering).`;
}

export function makeDefinerSavePayload(
  term: string,
  definition: string,
  isPublic = false,
  slug?: string,
) {
  return { term, definition, isPublic, slug };
}
