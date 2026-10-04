const { z } = require('zod');

const IngredientSchema = z.object({
  name_bn: z.string().default(''),
  name_en: z.string().default(''),
  quantity: z.union([z.number(), z.string()]).transform(v => {
    if (v === null || v === undefined) return '';
    return String(v).trim();
  }).default(''),
  unit: z.string().default('')
});

const RecipeSchema = z.object({
  id: z.string().optional(),
  title_bn: z.string().min(1, 'Bangla title is required'),
  title_en: z.string().min(1, 'English title is required'),
  ingredients: z.array(IngredientSchema).min(1, 'At least one ingredient is required'),
  steps_bn: z.array(z.string().min(1)).min(1, 'At least one step in Bangla is required'),
  steps_en: z.array(z.string().min(1)).min(1, 'At least one step in English is required'),
  servings: z.coerce.number().int().min(1).default(4),
  time_minutes: z.coerce.number().int().min(0).default(30),
  notes: z.string().default(''),
  uncertain: z.array(z.string()).default([])
});

/**
 * Robustly strips markdown fences and extracts outermost JSON object
 */
function extractAndCleanJson(rawText) {
  if (typeof rawText !== 'string') {
    throw new Error('Expected rawText to be a string');
  }

  let text = rawText.trim();

  // Strip code block fences if present
  text = text.replace(/^```json\s*/i, '').replace(/^```\s*/, '').replace(/\s*```$/, '');

  // Find outermost JSON object
  const firstBrace = text.indexOf('{');
  const lastBrace = text.lastIndexOf('}');

  if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
    throw new Error('No valid JSON object structure found in LLM response');
  }

  let jsonSubstring = text.slice(firstBrace, lastBrace + 1);

  // Remove trailing commas before closing braces/brackets (common LLM JSON flaw)
  jsonSubstring = jsonSubstring.replace(/,\s*([}\]])/g, '$1');

  return jsonSubstring;
}

/**
 * Validates JSON against RecipeSchema
 */
function validateRecipe(data) {
  return RecipeSchema.parse(data);
}

module.exports = {
  IngredientSchema,
  RecipeSchema,
  extractAndCleanJson,
  validateRecipe
};
