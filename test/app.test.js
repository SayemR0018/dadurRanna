const { describe, it } = require('node:test');
const assert = require('node:assert');
const { extractAndCleanJson, validateRecipe, RecipeSchema } = require('../src/schema');
const { buildRecipePrompt } = require('../src/prompts');
const { extractRecipe, getMockExtraction } = require('../src/llm');

describe('Schema & JSON Parser Tests', () => {
  it('extracts and cleans JSON wrapped in markdown code fences', () => {
    const raw = '```json\n{\n  "title_bn": "ইলিশ মাছ",\n  "title_en": "Hilsa Fish",\n  "ingredients": [{"name_bn": "ইলিশ", "name_en": "Hilsa", "quantity": "4", "unit": "pieces"}],\n  "steps_bn": ["ধাপ ১"],\n  "steps_en": ["Step 1"],\n  "servings": 4,\n  "time_minutes": 25,\n  "notes": "টিপস",\n  "uncertain": []\n}\n```';
    const cleaned = extractAndCleanJson(raw);
    const parsed = JSON.parse(cleaned);
    assert.strictEqual(parsed.title_bn, 'ইলিশ মাছ');
    assert.strictEqual(parsed.ingredients.length, 1);
  });

  it('removes trailing commas before closing braces', () => {
    const raw = '{\n  "title_bn": "টেস্ট",\n  "title_en": "Test",\n  "ingredients": [\n    {"name_bn": "ডাল", "name_en": "Dal", "quantity": "1", "unit": "cup",},\n  ],\n  "steps_bn": ["রাঁধুন",],\n  "steps_en": ["Cook",],\n}';
    const cleaned = extractAndCleanJson(raw);
    const parsed = JSON.parse(cleaned);
    assert.strictEqual(parsed.title_bn, 'টেস্ট');
    assert.strictEqual(parsed.ingredients[0].name_bn, 'ডাল');
  });

  it('validates a complete recipe using RecipeSchema', () => {
    const validData = {
      title_bn: 'দাদুর স্পেশাল সর্ষে ইলিশ',
      title_en: "Dadu's Mustard Hilsa",
      ingredients: [
        { name_bn: 'ইলিশ মাছ', name_en: 'Hilsa fish', quantity: '4', unit: 'pieces' },
        { name_bn: 'সর্ষে বাটা', name_en: 'Mustard paste', quantity: '2', unit: 'tbsp' }
      ],
      steps_bn: ['মাছ নুন-হলুদ মাখান।', 'সর্ষের তেলে রান্না করুন।'],
      steps_en: ['Marinate fish with salt & turmeric.', 'Cook in mustard oil.'],
      servings: 4,
      time_minutes: 30,
      notes: 'কাঁচা তেল দিয়ে নামাবেন।',
      uncertain: ['সর্ষের অনুপাত অস্পষ্ট ছিল']
    };

    const validated = validateRecipe(validData);
    assert.strictEqual(validated.title_bn, validData.title_bn);
    assert.strictEqual(validated.uncertain.length, 1);
    assert.strictEqual(validated.servings, 4);
  });

  it('fails validation when mandatory fields are missing', () => {
    const invalidData = {
      title_bn: 'অসম্পূর্ণ রেসিপি'
      // missing ingredients, steps, etc.
    };
    assert.throws(() => validateRecipe(invalidData));
  });
});

describe('Prompt Generation Tests', () => {
  it('generates prompt containing instructions and user recipe text', () => {
    const userText = 'আলু পোস্ত ৪০০ গ্রাম আলু, ৪ চামচ পোস্ত';
    const prompt = buildRecipePrompt(userText);
    assert(prompt.includes('Dadur Ranna'));
    assert(prompt.includes('RECIPE INPUT TEXT'));
    assert(prompt.includes(userText));
    assert(prompt.includes('OUTPUT JSON OBJECT'));
  });
});

describe('Recipe Extraction Pipeline Tests', () => {
  it('generates authentic mock extraction when offline/keyless', async () => {
    const text = 'Shorshe Ilish er niyam: Padmar ilish anbe 4 tukro. Shorshe bata 2.5 chamoch.';
    const result = await extractRecipe({ text });
    assert(result.title_bn.includes('ইলিশ'));
    assert(result.ingredients.length >= 4);
    assert(result.steps_bn.length >= 2);
    assert(result.steps_en.length >= 2);
    assert(result.servings > 0);
    assert(result.notes.length > 0);
    assert(Array.isArray(result.uncertain));
  });

  it('includes uncertain flag in sample extraction for human-in-the-loop review', async () => {
    const text = 'Begun bhaja secret spice recipe';
    const result = getMockExtraction(text);
    assert(Array.isArray(result.uncertain));
    assert(result.uncertain.length > 0, 'Should have uncertain items for verification');
  });
});
