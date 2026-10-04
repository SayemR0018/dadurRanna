/**
 * Dadur Ranna (দাদুর রান্না) — Client-Side Application
 * Zero external JS dependencies. Pure Vanilla JavaScript.
 */

(function () {
  'use strict';

  // --- State ---
  const STORAGE_KEY = 'dadur_ranna_cookbook_v1';
  let activeRecipe = null;
  let activeBaseServings = 4;
  let currentTargetServings = 4;
  let currentLanguageMode = 'bilingual'; // 'bilingual' | 'bn' | 'en'
  let selectedFiles = []; // Uploaded and client-compressed images
  let sampleTextIndex = 0;

  // --- Fraction Utilities ---
  const FRACTION_MAP = {
    '½': 0.5,
    '¼': 0.25,
    '¾': 0.75,
    '⅓': 0.333,
    '⅔': 0.667,
    '⅛': 0.125,
    '⅜': 0.375,
    '⅝': 0.625,
    '⅞': 0.875
  };

  /**
   * Parse a string quantity into a floating number, supporting fractions and mixed numbers.
   * e.g. "1/2" -> 0.5, "1 1/2" -> 1.5, "½" -> 0.5, "250" -> 250
   */
  function parseQuantity(raw) {
    if (raw === null || raw === undefined) return null;
    let str = String(raw).trim();
    if (!str) return null;

    // Check unicode fractions
    for (const [char, val] of Object.entries(FRACTION_MAP)) {
      if (str.includes(char)) {
        const remaining = str.replace(char, '').trim();
        const whole = remaining ? parseFloat(remaining) : 0;
        return isNaN(whole) ? val : whole + val;
      }
    }

    // Check mixed fraction e.g. "1 1/2" or "2 3/4"
    const mixedMatch = str.match(/^(\d+)\s+(\d+)\/(\d+)$/);
    if (mixedMatch) {
      const whole = parseInt(mixedMatch[1], 10);
      const num = parseInt(mixedMatch[2], 10);
      const den = parseInt(mixedMatch[3], 10);
      return den > 0 ? whole + num / den : null;
    }

    // Check simple fraction e.g. "1/2", "3/4"
    const fracMatch = str.match(/^(\d+)\/(\d+)$/);
    if (fracMatch) {
      const num = parseInt(fracMatch[1], 10);
      const den = parseInt(fracMatch[2], 10);
      return den > 0 ? num / den : null;
    }

    // Check regular float/int e.g. "2.5", "500"
    const floatVal = parseFloat(str);
    return isNaN(floatVal) ? null : floatVal;
  }

  /**
   * Format scaled float number into human-friendly culinary string (fractions when applicable).
   */
  function formatQuantity(num) {
    if (num === null || num === undefined || isNaN(num)) return '';
    if (num <= 0) return '0';

    // Check for whole numbers
    if (Math.abs(num - Math.round(num)) < 0.05) {
      return String(Math.round(num));
    }

    const whole = Math.floor(num);
    const frac = num - whole;

    // Friendly fraction approximations
    let fracStr = '';
    if (Math.abs(frac - 0.5) < 0.08) fracStr = '½';
    else if (Math.abs(frac - 0.25) < 0.08) fracStr = '¼';
    else if (Math.abs(frac - 0.75) < 0.08) fracStr = '¾';
    else if (Math.abs(frac - 0.333) < 0.08) fracStr = '⅓';
    else if (Math.abs(frac - 0.667) < 0.08) fracStr = '⅔';

    if (fracStr) {
      return whole > 0 ? `${whole} ${fracStr}` : fracStr;
    }

    // Decimal rounding (max 2 decimals)
    return parseFloat(num.toFixed(2)).toString();
  }

  // --- LocalStorage Helpers ---
  function getSavedCookbook() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('LocalStorage read error:', e);
      return [];
    }
  }

  function saveCookbookToStorage(recipes) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
      updateBadgeCounts();
    } catch (e) {
      console.error('LocalStorage write error:', e);
      alert('Local storage is full or disabled. Please export your recipes as JSON.');
    }
  }

  function updateBadgeCounts() {
    const list = getSavedCookbook();
    document.querySelectorAll('.cookbook-badge-count').forEach(el => {
      el.textContent = list.length;
    });
  }

  // --- Client-side Image Compression with HTML5 Canvas ---
  async function compressImageFile(file) {
    const MAX_DIMENSION = 1600;
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = e => {
        const img = new Image();
        img.onload = () => {
          let width = img.width;
          let height = img.height;

          if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
            if (width > height) {
              height = Math.round((height * MAX_DIMENSION) / width);
              width = MAX_DIMENSION;
            } else {
              width = Math.round((width * MAX_DIMENSION) / height);
              height = MAX_DIMENSION;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            blob => {
              if (blob) {
                resolve(new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg' }));
              } else {
                resolve(file); // fallback
              }
            },
            'image/jpeg',
            0.85
          );
        };
        img.onerror = reject;
        img.src = e.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // --- UI Tab Switching ---
  const tabBtnExtract = document.getElementById('tab-btn-extract');
  const tabBtnCookbook = document.getElementById('tab-btn-cookbook');
  const creatorSection = document.getElementById('creator-section');
  const cookbookView = document.getElementById('cookbook-view');

  function switchTab(tabName) {
    if (tabName === 'extract') {
      tabBtnExtract.classList.add('active');
      tabBtnCookbook.classList.remove('active');
      creatorSection.style.display = 'block';
      cookbookView.style.display = 'none';
    } else {
      tabBtnExtract.classList.remove('active');
      tabBtnCookbook.classList.add('active');
      creatorSection.style.display = 'none';
      cookbookView.style.display = 'block';
      renderCookbookList();
    }
  }

  tabBtnExtract.addEventListener('click', () => switchTab('extract'));
  tabBtnCookbook.addEventListener('click', () => switchTab('cookbook'));
  document.getElementById('brand-home-btn').addEventListener('click', e => {
    e.preventDefault();
    switchTab('extract');
  });
  document.getElementById('hero-create-btn').addEventListener('click', () => switchTab('extract'));
  document.getElementById('hero-view-cookbook-btn').addEventListener('click', () => switchTab('cookbook'));
  document.getElementById('empty-create-btn').addEventListener('click', () => switchTab('extract'));

  // --- Image Upload Handlers ---
  const dropzone = document.getElementById('dropzone');
  const imageInput = document.getElementById('image-input');
  const previewStrip = document.getElementById('file-preview-strip');

  dropzone.addEventListener('click', () => imageInput.click());

  dropzone.addEventListener('dragover', e => {
    e.preventDefault();
    dropzone.classList.add('dragover');
  });

  dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));

  dropzone.addEventListener('drop', async e => {
    e.preventDefault();
    dropzone.classList.remove('dragover');
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await handleFileSelection(Array.from(e.dataTransfer.files));
    }
  });

  imageInput.addEventListener('change', async e => {
    if (e.target.files && e.target.files.length > 0) {
      await handleFileSelection(Array.from(e.target.files));
    }
  });

  async function handleFileSelection(files) {
    const validFiles = files.filter(f => /image\/(jpeg|png|webp)/i.test(f.type));
    for (const file of validFiles) {
      if (selectedFiles.length >= 4) {
        alert('Maximum 4 photos allowed per recipe extraction.');
        break;
      }
      try {
        const compressed = await compressImageFile(file);
        selectedFiles.push(compressed);
      } catch (err) {
        console.warn('Canvas compression fallback:', err);
        selectedFiles.push(file);
      }
    }
    renderFilePreviews();
  }

  function renderFilePreviews() {
    previewStrip.innerHTML = '';
    selectedFiles.forEach((file, index) => {
      const thumb = document.createElement('div');
      thumb.className = 'preview-thumb';

      const img = document.createElement('img');
      img.src = URL.createObjectURL(file);

      const removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.className = 'remove-img-btn';
      removeBtn.innerHTML = '&times;';
      removeBtn.title = 'Remove photo';
      removeBtn.addEventListener('click', e => {
        e.stopPropagation();
        selectedFiles.splice(index, 1);
        renderFilePreviews();
      });

      thumb.appendChild(img);
      thumb.appendChild(removeBtn);
      previewStrip.appendChild(thumb);
    });
  }

  // --- Sample Text Button & Clear ---
  const recipeTextInput = document.getElementById('recipe-text-input');
  const sampleTextBtn = document.getElementById('sample-text-btn');
  const clearTextBtn = document.getElementById('clear-text-btn');

  sampleTextBtn.addEventListener('click', () => {
    if (window.SAMPLE_MESSY_TEXTS && window.SAMPLE_MESSY_TEXTS.length > 0) {
      recipeTextInput.value = window.SAMPLE_MESSY_TEXTS[sampleTextIndex % window.SAMPLE_MESSY_TEXTS.length];
      sampleTextIndex++;
    }
  });

  clearTextBtn.addEventListener('click', () => {
    recipeTextInput.value = '';
    selectedFiles = [];
    renderFilePreviews();
  });

  // --- Recipe Extraction via Backend API ---
  const extractForm = document.getElementById('extract-form');
  const loadingBox = document.getElementById('loading-box');
  const extractSubmitBtn = document.getElementById('extract-submit-btn');
  const recipeEditorCard = document.getElementById('recipe-editor-card');

  extractForm.addEventListener('submit', async e => {
    e.preventDefault();

    const text = recipeTextInput.value.trim();
    if (!text && selectedFiles.length === 0) {
      alert('অনুগ্রহ করে রেসিপির ছবি যোগ করুন অথবা এলোমেলো লেখা পেস্ট করুন। (Please provide recipe text or upload photos).');
      return;
    }

    // UI Loading State
    loadingBox.style.display = 'block';
    recipeEditorCard.style.display = 'none';
    extractSubmitBtn.disabled = true;

    const formData = new FormData();
    if (text) formData.append('text', text);
    selectedFiles.forEach(file => {
      formData.append('images', file);
    });

    try {
      const response = await fetch('/api/extract', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to extract recipe.');
      }

      loadRecipeIntoEditor(data.recipe);
      recipeEditorCard.scrollIntoView({ behavior: 'smooth' });

      if (data.recipe._meta && data.recipe._meta.warning) {
        console.info('[Notice]', data.recipe._meta.warning);
      }
    } catch (err) {
      console.error('Extraction error:', err);
      alert('উদ্ধার ব্যর্থ হয়েছে: ' + err.message + '\n\nআপনি চাইলে নিজে ম্যানুয়ালি রেসিপি এডিট করতে পারেন।');
      // If error occurs, create blank editable template so user isn't blocked
      loadRecipeIntoEditor({
        title_bn: 'নতুন উদ্ধারকৃত রেসিপি',
        title_en: 'New Extracted Recipe',
        servings: 4,
        time_minutes: 30,
        ingredients: [
          { name_bn: 'উপকরণ ১', name_en: 'Ingredient 1', quantity: '1', unit: 'tbsp' }
        ],
        steps_bn: ['প্রথম ধাপ...'],
        steps_en: ['First step...'],
        notes: text,
        uncertain: ['মডেল ত্রুটি ঘটেছে; দয়া করে তথ্য মিলিয়ে নিন']
      });
      recipeEditorCard.scrollIntoView({ behavior: 'smooth' });
    } finally {
      loadingBox.style.display = 'none';
      extractSubmitBtn.disabled = false;
    }
  });

  // --- Recipe Editor Logic ---
  const titleBnInput = document.getElementById('recipe-title-bn');
  const titleEnInput = document.getElementById('recipe-title-en');
  const timeMinutesInput = document.getElementById('recipe-time-minutes');
  const metaServingsDisplay = document.getElementById('meta-servings-display');
  const scalerValue = document.getElementById('scaler-value');
  const scalerMinusBtn = document.getElementById('scaler-minus-btn');
  const scalerPlusBtn = document.getElementById('scaler-plus-btn');
  const ingredientsTbody = document.getElementById('ingredients-tbody');
  const addIngredientBtn = document.getElementById('add-ingredient-btn');
  const stepsList = document.getElementById('steps-list');
  const addStepBtn = document.getElementById('add-step-btn');
  const notesTextarea = document.getElementById('recipe-notes-input');
  const uncertainBanner = document.getElementById('uncertain-banner');
  const uncertainList = document.getElementById('uncertain-list');
  const editorArtImg = document.getElementById('editor-art-img');

  function matchRecipeSvg(title) {
    const t = (title || '').toLowerCase();
    if (t.includes('ilish') || t.includes('ইলিশ')) return '/assets/recipes/shorshe-ilish.svg';
    if (t.includes('posto') || t.includes('পোস্ত') || t.includes('aloo')) return '/assets/recipes/aloo-posto.svg';
    if (t.includes('khichuri') || t.includes('খিচুড়ি')) return '/assets/recipes/khichuri.svg';
    if (t.includes('chingri') || t.includes('মালাই') || t.includes('prawn')) return '/assets/recipes/chingri-malai.svg';
    if (t.includes('payesh') || t.includes('পায়েশ') || t.includes('kheer') || t.includes('গুড়')) return '/assets/recipes/payesh.svg';
    if (t.includes('begun') || t.includes('বেগুন') || t.includes('eggplant')) return '/assets/recipes/begun-bhaja.svg';
    return '/assets/logo.svg';
  }

  function loadRecipeIntoEditor(recipe) {
    activeRecipe = JSON.parse(JSON.stringify(recipe)); // Deep clone
    if (!activeRecipe.id) {
      activeRecipe.id = 'recipe_' + Date.now();
    }

    activeBaseServings = parseInt(activeRecipe.servings, 10) || 4;
    currentTargetServings = activeBaseServings;

    // Cache base quantities on ingredients for accurate scaling
    if (Array.isArray(activeRecipe.ingredients)) {
      activeRecipe.ingredients.forEach(ing => {
        if (ing._baseQty === undefined) {
          ing._baseQty = parseQuantity(ing.quantity);
        }
      });
    }

    // Set fields
    titleBnInput.value = activeRecipe.title_bn || '';
    titleEnInput.value = activeRecipe.title_en || '';
    timeMinutesInput.value = activeRecipe.time_minutes || 30;
    notesTextarea.value = activeRecipe.notes || '';

    scalerValue.textContent = currentTargetServings;
    metaServingsDisplay.textContent = currentTargetServings;

    editorArtImg.src = activeRecipe.image_url || matchRecipeSvg(activeRecipe.title_bn + ' ' + activeRecipe.title_en);

    renderUncertaintyBanner();
    renderIngredientsTable();
    renderStepsList();

    recipeEditorCard.style.display = 'block';
  }

  function renderUncertaintyBanner() {
    uncertainList.innerHTML = '';
    const items = activeRecipe.uncertain || [];

    if (items.length === 0) {
      uncertainBanner.style.display = 'none';
      return;
    }

    uncertainBanner.style.display = 'flex';
    items.forEach((item, index) => {
      const li = document.createElement('li');
      li.className = 'uncertain-item';

      const spanText = document.createElement('span');
      spanText.innerHTML = `⚠️ <strong>${escapeHtml(item)}</strong>`;

      const confirmBtn = document.createElement('button');
      confirmBtn.type = 'button';
      confirmBtn.className = 'btn btn-outline btn-sm';
      confirmBtn.style.padding = '0.2rem 0.5rem';
      confirmBtn.textContent = '✓ নিশ্চিত করলাম (Confirm)';
      confirmBtn.addEventListener('click', () => {
        activeRecipe.uncertain.splice(index, 1);
        renderUncertaintyBanner();
      });

      li.appendChild(spanText);
      li.appendChild(confirmBtn);
      uncertainList.appendChild(li);
    });
  }

  function renderIngredientsTable() {
    ingredientsTbody.innerHTML = '';
    const ingredients = activeRecipe.ingredients || [];

    ingredients.forEach((ing, index) => {
      const tr = document.createElement('tr');

      // Calculate scaled quantity
      let displayQty = ing.quantity || '';
      if (ing._baseQty !== null && ing._baseQty !== undefined) {
        const scaledVal = (ing._baseQty * currentTargetServings) / activeBaseServings;
        displayQty = formatQuantity(scaledVal);
      }

      // Check if this ingredient matches any uncertain keyword
      const isUncertain = (activeRecipe.uncertain || []).some(u => 
        u.includes(ing.name_bn) || (ing.name_en && u.includes(ing.name_en))
      );

      // Name Column (BN / EN)
      const tdName = document.createElement('td');
      tdName.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 2px;">
          <input type="text" class="ing-input ing-name-bn ${isUncertain ? 'uncertain-highlight' : ''}" value="${escapeHtml(ing.name_bn || '')}" placeholder="বাংলা নাম">
          <input type="text" class="ing-input ing-name-en" value="${escapeHtml(ing.name_en || '')}" placeholder="English name" style="font-size: 0.85rem; color: var(--ink-muted);">
        </div>
      `;

      // Quantity Column
      const tdQty = document.createElement('td');
      tdQty.innerHTML = `<input type="text" class="ing-input ing-qty ${isUncertain ? 'uncertain-highlight' : ''}" value="${escapeHtml(displayQty)}" placeholder="qty">`;

      // Unit Column
      const tdUnit = document.createElement('td');
      tdUnit.innerHTML = `<input type="text" class="ing-input ing-unit" value="${escapeHtml(ing.unit || '')}" placeholder="unit">`;

      // Delete Row Column
      const tdDel = document.createElement('td');
      tdDel.innerHTML = `<button type="button" class="del-row-btn" title="Remove">&times;</button>`;

      // Event listeners for inline editing
      const bnInput = tdName.querySelector('.ing-name-bn');
      const enInput = tdName.querySelector('.ing-name-en');
      const qtyInput = tdQty.querySelector('.ing-qty');
      const unitInput = tdUnit.querySelector('.ing-unit');
      const delBtn = tdDel.querySelector('.del-row-btn');

      bnInput.addEventListener('input', e => { ing.name_bn = e.target.value; });
      enInput.addEventListener('input', e => { ing.name_en = e.target.value; });
      qtyInput.addEventListener('input', e => {
        ing.quantity = e.target.value;
        const parsed = parseQuantity(e.target.value);
        if (parsed !== null) {
          ing._baseQty = (parsed * activeBaseServings) / currentTargetServings;
        }
      });
      unitInput.addEventListener('input', e => { ing.unit = e.target.value; });
      delBtn.addEventListener('click', () => {
        activeRecipe.ingredients.splice(index, 1);
        renderIngredientsTable();
      });

      tr.appendChild(tdName);
      tr.appendChild(tdQty);
      tr.appendChild(tdUnit);
      tr.appendChild(tdDel);
      ingredientsTbody.appendChild(tr);
    });

    applyLanguageModeToEditor();
  }

  function renderStepsList() {
    stepsList.innerHTML = '';
    const stepsBn = activeRecipe.steps_bn || [];
    const stepsEn = activeRecipe.steps_en || [];
    const maxSteps = Math.max(stepsBn.length, stepsEn.length, 1);

    for (let i = 0; i < maxSteps; i++) {
      const bnText = stepsBn[i] || '';
      const enText = stepsEn[i] || '';

      const li = document.createElement('li');
      li.className = 'step-card';

      li.innerHTML = `
        <div class="step-number">${i + 1}</div>
        <div class="step-content">
          <textarea class="step-textarea step-text-bn" placeholder="ধাপ (বাংলা)">${escapeHtml(bnText)}</textarea>
          <textarea class="step-textarea step-text-en" placeholder="Step instruction (English)" style="font-size: 0.88rem; color: var(--ink-muted); margin-top: 4px;">${escapeHtml(enText)}</textarea>
        </div>
        <button type="button" class="del-row-btn" title="Remove step">&times;</button>
      `;

      const bnTextarea = li.querySelector('.step-text-bn');
      const enTextarea = li.querySelector('.step-text-en');
      const delBtn = li.querySelector('.del-row-btn');

      bnTextarea.addEventListener('input', e => {
        if (!activeRecipe.steps_bn) activeRecipe.steps_bn = [];
        activeRecipe.steps_bn[i] = e.target.value;
      });
      enTextarea.addEventListener('input', e => {
        if (!activeRecipe.steps_en) activeRecipe.steps_en = [];
        activeRecipe.steps_en[i] = e.target.value;
      });
      delBtn.addEventListener('click', () => {
        if (activeRecipe.steps_bn) activeRecipe.steps_bn.splice(i, 1);
        if (activeRecipe.steps_en) activeRecipe.steps_en.splice(i, 1);
        renderStepsList();
      });

      stepsList.appendChild(li);
    }

    applyLanguageModeToEditor();
  }

  addIngredientBtn.addEventListener('click', () => {
    if (!activeRecipe.ingredients) activeRecipe.ingredients = [];
    activeRecipe.ingredients.push({ name_bn: '', name_en: '', quantity: '1', unit: '', _baseQty: 1 });
    renderIngredientsTable();
  });

  addStepBtn.addEventListener('click', () => {
    if (!activeRecipe.steps_bn) activeRecipe.steps_bn = [];
    if (!activeRecipe.steps_en) activeRecipe.steps_en = [];
    activeRecipe.steps_bn.push('');
    activeRecipe.steps_en.push('');
    renderStepsList();
  });

  // --- Serving Scaler Controls ---
  scalerMinusBtn.addEventListener('click', () => {
    if (currentTargetServings > 1) {
      currentTargetServings--;
      scalerValue.textContent = currentTargetServings;
      metaServingsDisplay.textContent = currentTargetServings;
      renderIngredientsTable();
    }
  });

  scalerPlusBtn.addEventListener('click', () => {
    if (currentTargetServings < 40) {
      currentTargetServings++;
      scalerValue.textContent = currentTargetServings;
      metaServingsDisplay.textContent = currentTargetServings;
      renderIngredientsTable();
    }
  });

  // --- Language Toggle Logic ---
  const langBtns = document.querySelectorAll('.lang-btn');
  langBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      langBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentLanguageMode = btn.dataset.lang;
      applyLanguageModeToEditor();
    });
  });

  function applyLanguageModeToEditor() {
    // Ingredients
    document.querySelectorAll('.ing-name-bn').forEach(el => {
      el.style.display = currentLanguageMode === 'en' ? 'none' : 'block';
    });
    document.querySelectorAll('.ing-name-en').forEach(el => {
      el.style.display = currentLanguageMode === 'bn' ? 'none' : 'block';
    });

    // Steps
    document.querySelectorAll('.step-text-bn').forEach(el => {
      el.style.display = currentLanguageMode === 'en' ? 'none' : 'block';
    });
    document.querySelectorAll('.step-text-en').forEach(el => {
      el.style.display = currentLanguageMode === 'bn' ? 'none' : 'block';
    });

    // Titles
    if (titleBnInput && titleEnInput) {
      titleBnInput.style.display = currentLanguageMode === 'en' ? 'none' : 'block';
      titleEnInput.style.display = currentLanguageMode === 'bn' ? 'none' : 'block';
    }
  }

  // --- Save to Cookbook ---
  const saveRecipeBtn = document.getElementById('save-recipe-btn');
  saveRecipeBtn.addEventListener('click', () => {
    if (!activeRecipe) return;

    activeRecipe.title_bn = titleBnInput.value.trim() || 'নামহীন রেসিপি';
    activeRecipe.title_en = titleEnInput.value.trim() || 'Untitled Recipe';
    activeRecipe.time_minutes = parseInt(timeMinutesInput.value, 10) || 30;
    activeRecipe.servings = currentTargetServings;
    activeRecipe.notes = notesTextarea.value.trim();
    activeRecipe.image_url = activeRecipe.image_url || matchRecipeSvg(activeRecipe.title_bn + ' ' + activeRecipe.title_en);

    // Commit scaled quantities as default if scaled
    if (currentTargetServings !== activeBaseServings && Array.isArray(activeRecipe.ingredients)) {
      activeRecipe.ingredients.forEach(ing => {
        if (ing._baseQty !== null && ing._baseQty !== undefined) {
          const scaledVal = (ing._baseQty * currentTargetServings) / activeBaseServings;
          ing.quantity = formatQuantity(scaledVal);
          ing._baseQty = scaledVal;
        }
      });
      activeBaseServings = currentTargetServings;
    }

    const cookbook = getSavedCookbook();
    const existingIndex = cookbook.findIndex(r => r.id === activeRecipe.id);
    if (existingIndex >= 0) {
      cookbook[existingIndex] = activeRecipe;
    } else {
      cookbook.unshift(activeRecipe);
    }

    saveCookbookToStorage(cookbook);
    alert(`✓ "${activeRecipe.title_bn}" রান্নার খাতায় সংরক্ষণ করা হয়েছে!`);
    switchTab('cookbook');
  });

  // --- Load Demo Cookbook ---
  const loadDemoBtn = document.getElementById('load-demo-btn');
  const emptyLoadDemoBtn = document.getElementById('empty-load-demo-btn');

  function loadDemoData() {
    if (!window.DEMO_RECIPES || window.DEMO_RECIPES.length === 0) return;
    saveCookbookToStorage(window.DEMO_RECIPES);
    alert(`✓ ৬টি সাবেক বাঙালি রেসিপি সফলভাবে লোড হয়েছে!`);
    switchTab('cookbook');
  }

  loadDemoBtn.addEventListener('click', loadDemoData);
  emptyLoadDemoBtn.addEventListener('click', loadDemoData);

  // --- Cookbook View: Rendering, Search, and Filtering ---
  const recipesGrid = document.getElementById('recipes-grid');
  const emptyState = document.getElementById('empty-state');
  const cookbookSearch = document.getElementById('cookbook-search');

  cookbookSearch.addEventListener('input', () => renderCookbookList());

  function renderCookbookList() {
    const list = getSavedCookbook();
    const query = cookbookSearch.value.trim().toLowerCase();

    updateBadgeCounts();

    if (list.length === 0) {
      recipesGrid.style.display = 'none';
      emptyState.style.display = 'block';
      return;
    }

    emptyState.style.display = 'none';
    recipesGrid.style.display = 'grid';
    recipesGrid.innerHTML = '';

    const filtered = list.filter(r => {
      if (!query) return true;
      const bn = (r.title_bn || '').toLowerCase();
      const en = (r.title_en || '').toLowerCase();
      const ings = (r.ingredients || []).map(i => (i.name_bn || '') + ' ' + (i.name_en || '')).join(' ').toLowerCase();
      return bn.includes(query) || en.includes(query) || ings.includes(query);
    });

    if (filtered.length === 0) {
      recipesGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem; color: var(--ink-muted);">
          🔍 কোনো রেসিপি পাওয়া যায়নি "${escapeHtml(query)}" দিয়ে।
        </div>
      `;
      return;
    }

    filtered.forEach(recipe => {
      const card = document.createElement('div');
      card.className = 'recipe-book-item';

      const artSrc = recipe.image_url || matchRecipeSvg(recipe.title_bn + ' ' + recipe.title_en);
      const ingsPreview = (recipe.ingredients || [])
        .slice(0, 4)
        .map(i => i.name_bn || i.name_en)
        .filter(Boolean)
        .join(', ');

      const hasUncertain = Array.isArray(recipe.uncertain) && recipe.uncertain.length > 0;

      card.innerHTML = `
        <div class="card-top-art">
          <img src="${artSrc}" alt="${escapeHtml(recipe.title_en || recipe.title_bn)}">
          ${hasUncertain ? '<span class="badge-pill" style="position: absolute; top: 10px; right: 10px; background: #FEF08A; color: #854D0E; border: 1px solid #EAB308;">⚠️ যাচাই বাকি</span>' : ''}
        </div>
        <div class="card-body">
          <h3 class="card-title-bn">${escapeHtml(recipe.title_bn || 'নামহীন')}</h3>
          <div class="card-title-en">${escapeHtml(recipe.title_en || '')}</div>
          <div class="card-preview-info">
            <span>⏱️ ${recipe.time_minutes || 30} মিনিট</span>
            <span>🍽️ ${recipe.servings || 4} জন</span>
          </div>
          <div class="card-ingredients-snippet">
            <strong>উপকরণ:</strong> ${escapeHtml(ingsPreview)}${recipe.ingredients && recipe.ingredients.length > 4 ? '...' : ''}
          </div>
          <div class="card-actions-row">
            <button type="button" class="btn btn-outline btn-sm edit-card-btn">✏️ দেখুন ও এডিট</button>
            <div style="display: flex; gap: 0.35rem;">
              <button type="button" class="btn btn-secondary btn-sm print-card-btn" title="Print this recipe">🖨️</button>
              <button type="button" class="btn btn-secondary btn-sm del-card-btn" title="Delete recipe" style="color: var(--chili-700);">&times;</button>
            </div>
          </div>
        </div>
      `;

      card.querySelector('.edit-card-btn').addEventListener('click', () => {
        loadRecipeIntoEditor(recipe);
        switchTab('extract');
        recipeEditorCard.scrollIntoView({ behavior: 'smooth' });
      });

      card.querySelector('.print-card-btn').addEventListener('click', () => {
        printSingleRecipe(recipe);
      });

      card.querySelector('.del-card-btn').addEventListener('click', () => {
        if (confirm(`আপনি কি "${recipe.title_bn}" মুছে ফেলতে চান?`)) {
          const updated = getSavedCookbook().filter(r => r.id !== recipe.id);
          saveCookbookToStorage(updated);
          renderCookbookList();
        }
      });

      recipesGrid.appendChild(card);
    });
  }

  // --- Export and Import JSON ---
  const exportBtn = document.getElementById('export-cookbook-btn');
  const importBtn = document.getElementById('import-cookbook-btn');
  const importFileInput = document.getElementById('import-file-input');
  const clearAllBtn = document.getElementById('clear-all-btn');

  exportBtn.addEventListener('click', () => {
    const list = getSavedCookbook();
    if (list.length === 0) {
      alert('এক্সপোর্ট করার মতো কোনো রেসিপি নেই।');
      return;
    }
    const jsonStr = JSON.stringify(list, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dadur-ranna-cookbook-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  });

  importBtn.addEventListener('click', () => importFileInput.click());

  importFileInput.addEventListener('change', e => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const imported = JSON.parse(ev.target.result);
        if (!Array.isArray(imported)) {
          throw new Error('Imported JSON must be an array of recipes.');
        }

        const current = getSavedCookbook();
        // Merge without duplicate IDs
        const existingMap = new Map(current.map(r => [r.id, r]));
        imported.forEach(r => {
          if (!r.id) r.id = 'recipe_' + Math.random().toString(36).substr(2, 9);
          existingMap.set(r.id, r);
        });

        const merged = Array.from(existingMap.values());
        saveCookbookToStorage(merged);
        alert(`✓ সফলভাবে ${imported.length}টি রেসিপি ইমপোর্ট করা হয়েছে!`);
        renderCookbookList();
      } catch (err) {
        alert('ইমপোর্ট ব্যর্থ: ' + err.message);
      } finally {
        importFileInput.value = '';
      }
    };
    reader.readAsText(file);
  });

  clearAllBtn.addEventListener('click', () => {
    if (confirm('আপনি কি নিশ্চিত যে সংরক্ষিত সব রেসিপি মুছে ফেলবেন?')) {
      saveCookbookToStorage([]);
      renderCookbookList();
    }
  });

  // --- Print View & Keepsake PDF Generation ---
  const printModal = document.getElementById('dedication-modal');
  const openPrintModalBtn = document.getElementById('open-print-modal-btn');
  const printAllRecipesBtn = document.getElementById('print-all-recipes-btn');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalCancelBtn = document.getElementById('modal-cancel-btn');
  const triggerFinalPrintBtn = document.getElementById('trigger-final-print-btn');
  const printDedicationInput = document.getElementById('print-dedication-input');
  const printContainer = document.getElementById('print-container');
  const printSingleRecipeBtn = document.getElementById('print-single-recipe-btn');

  function openPrintModal() {
    printModal.style.display = 'flex';
  }
  function closePrintModal() {
    printModal.style.display = 'none';
  }

  openPrintModalBtn.addEventListener('click', openPrintModal);
  printAllRecipesBtn.addEventListener('click', openPrintModal);
  modalCloseBtn.addEventListener('click', closePrintModal);
  modalCancelBtn.addEventListener('click', closePrintModal);

  triggerFinalPrintBtn.addEventListener('click', () => {
    const dedication = printDedicationInput.value.trim() || 'দাদুর জন্য, অফুরন্ত ভালোবাসা ও কৃতজ্ঞতায়';
    buildFullPrintCookbook(dedication);
    closePrintModal();
    window.print();
  });

  printSingleRecipeBtn.addEventListener('click', () => {
    if (activeRecipe) {
      printSingleRecipe(activeRecipe);
    }
  });

  function printSingleRecipe(recipe) {
    printContainer.innerHTML = '';
    const page = createRecipePrintPage(recipe, 1);
    printContainer.appendChild(page);
    window.print();
  }

  function buildFullPrintCookbook(dedicationText) {
    const list = getSavedCookbook();
    printContainer.innerHTML = '';

    if (list.length === 0) {
      alert('প্রিন্ট করার জন্য কোনো রেসিপি নেই। আগে কিছু রেসিপি যোগ বা লোড করুন।');
      return;
    }

    // 1. Cover Page
    const coverPage = document.createElement('div');
    coverPage.className = 'print-page cover-page';
    coverPage.innerHTML = `
      <div class="print-alpana-frame"></div>
      <img src="/assets/logo.svg" alt="Dadur Ranna" class="cover-pot-logo">
      <h1 class="cover-main-title">দাদুর রান্না</h1>
      <div class="cover-subtitle">Dadur Ranna · The Family Heirloom Cookbook</div>
      <div class="cover-dedication-box">
        <p class="cover-dedication-text">"${escapeHtml(dedicationText)}"</p>
      </div>
      <div class="cover-meta">
        সংকলিত ও সংরক্ষিত: ${new Date().toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' })}<br>
        Preserved with love using open-weight Gemma
      </div>
    `;
    printContainer.appendChild(coverPage);

    // 2. Table of Contents Page
    const tocPage = document.createElement('div');
    tocPage.className = 'print-page toc-page';
    let tocListHtml = '';
    list.forEach((recipe, idx) => {
      const pageNum = idx + 3; // Cover = 1, TOC = 2, Recipe starts at 3
      tocListHtml += `
        <li class="toc-item">
          <div>
            <strong>${idx + 1}. ${escapeHtml(recipe.title_bn)}</strong>
            <span style="color: #78350F; font-size: 0.9em; margin-left: 0.5rem;">(${escapeHtml(recipe.title_en || '')})</span>
          </div>
          <span style="font-weight: bold; color: #991B1B;">পৃষ্ঠা ${pageNum}</span>
        </li>
      `;
    });

    tocPage.innerHTML = `
      <div class="print-alpana-frame"></div>
      <h2>সূচিপত্র (Table of Contents)</h2>
      <ul class="toc-list">${tocListHtml}</ul>
    `;
    printContainer.appendChild(tocPage);

    // 3. One Recipe Per Page
    list.forEach((recipe, idx) => {
      const page = createRecipePrintPage(recipe, idx + 3);
      printContainer.appendChild(page);
    });
  }

  function createRecipePrintPage(recipe, pageNum) {
    const page = document.createElement('div');
    page.className = 'print-page recipe-print-page';

    const ingsListHtml = (recipe.ingredients || []).map(i => {
      const name = currentLanguageMode === 'en' 
        ? (i.name_en || i.name_bn) 
        : (currentLanguageMode === 'bn' ? (i.name_bn || i.name_en) : `${i.name_bn} ${i.name_en ? `(${i.name_en})` : ''}`);
      return `<li><strong>${escapeHtml(i.quantity || '')} ${escapeHtml(i.unit || '')}</strong> — ${escapeHtml(name)}</li>`;
    }).join('');

    const stepsBn = recipe.steps_bn || [];
    const stepsEn = recipe.steps_en || [];
    const maxSteps = Math.max(stepsBn.length, stepsEn.length);
    let stepsListHtml = '';

    for (let s = 0; s < maxSteps; s++) {
      let stepText = '';
      if (currentLanguageMode === 'bn') {
        stepText = stepsBn[s] || stepsEn[s] || '';
      } else if (currentLanguageMode === 'en') {
        stepText = stepsEn[s] || stepsBn[s] || '';
      } else {
        stepText = `${stepsBn[s] || ''}${stepsEn[s] ? `<br><span style="font-size: 0.9em; color: #555;">${stepsEn[s]}</span>` : ''}`;
      }
      stepsListHtml += `<li>${stepText}</li>`;
    }

    const uncertainNotice = (recipe.uncertain && recipe.uncertain.length > 0)
      ? `<div class="print-uncertain-notice">⚠️ <strong>যাচাই নোট:</strong> ${escapeHtml(recipe.uncertain.join('; '))}</div>`
      : '';

    page.innerHTML = `
      <div class="print-alpana-frame"></div>
      <div class="recipe-print-header">
        <div>
          <h2 class="recipe-print-title-bn">${escapeHtml(recipe.title_bn)}</h2>
          <div class="recipe-print-title-en">${escapeHtml(recipe.title_en || '')}</div>
          <div class="recipe-print-meta">
            ⏱️ সময়: ${recipe.time_minutes || 30} মিনিট &nbsp;|&nbsp; 🍽️ পরিবেশন: ${recipe.servings || 4} জন
          </div>
        </div>
        <div style="font-size: 9pt; color: #78350F; font-weight: bold; text-align: right;">
          দাদুর রান্না<br>পৃষ্ঠা ${pageNum}
        </div>
      </div>

      <div class="recipe-print-columns">
        <div>
          <h3 class="recipe-print-section-title">উপকরণ তালিকা (Ingredients)</h3>
          <ul class="print-ingredients-list">${ingsListHtml}</ul>
        </div>

        <div>
          <h3 class="recipe-print-section-title">প্রণালী (Cooking Method)</h3>
          <ol class="print-steps-list">${stepsListHtml}</ol>

          ${recipe.notes ? `
            <div class="print-grandma-notes">
              <strong>👵🏼 দাদুর নিজস্ব টিপস:</strong> "${escapeHtml(recipe.notes)}"
            </div>
          ` : ''}

          ${uncertainNotice}
        </div>
      </div>
    `;

    return page;
  }

  // --- Fetch Config for Footer Status ---
  async function loadConfig() {
    try {
      const res = await fetch('/api/config');
      if (res.ok) {
        const conf = await res.json();
        const badge = document.getElementById('footer-model-badge');
        if (badge && conf.label) {
          badge.textContent = `⚡ ${conf.label}`;
        }
      }
    } catch (e) {
      console.warn('Could not fetch /api/config', e);
    }
  }

  // --- HTML Escaping Helper ---
  function escapeHtml(str) {
    if (typeof str !== 'string') return str;
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // --- Initialization ---
  document.addEventListener('DOMContentLoaded', () => {
    updateBadgeCounts();
    loadConfig();

    // If local storage is completely empty, optionally load demo or show first demo in editor
    const current = getSavedCookbook();
    if (current.length === 0 && window.DEMO_RECIPES && window.DEMO_RECIPES.length > 0) {
      // Preload first demo into editor for immediate preview satisfaction
      loadRecipeIntoEditor(window.DEMO_RECIPES[0]);
    } else if (current.length > 0) {
      loadRecipeIntoEditor(current[0]);
    }
  });

})();
