# দাদুর রান্না (Dadur Ranna) — Family Cookbook Maker

![Dadur Ranna Cover](/public/assets/cover.png)

> **"Dadur Ranna" (দাদুর রান্না)** is an intimate culinary preservation web app built for one real person: my friend's grandmother, whose irreplaceable culinary legacy exists only as brittle handwritten diary pages, faded envelope scribbles, and rambling, colloquial notes in mixed Bangla and English.

Powered by Google's open-weight **Gemma** (`gemma-3-27b-it` or local Ollama), Dadur Ranna deciphers cursive handwriting and colloquial cooking jargon, extracts structured bilingual recipes, highlights uncertain or faded measurements in yellow for human confirmation, recalculates serving sizes with fractional math (½, ¼), and renders an archival, print-ready keepsake PDF book complete with traditional Alpana decorative borders and a custom family dedication.

---

## 🌟 Key Features

| Feature | Description |
| :--- | :--- |
| **📸 Photo & Messy Text Transcription** | Upload phone photos of handwritten cookbook pages or paste rambling voice notes / Banglish text. Compressed client-side using HTML5 Canvas before uploading. |
| **⚠️ Never Silently Guess (Uncertainty Badges)** | If handwriting is torn or measurements are vague (e.g. *"অন্দাজমতো"*, *"এক চিমটি"*), Gemma highlights them in yellow for a human cook to review and confirm. |
| **⚖️ Fraction-Aware Serving Scaler** | Scale servings up or down with instantaneous ingredient recalculation. Understands culinary fractions like `½`, `¼`, `¾`, `1½`, and decimals. |
| **🌐 Bilingual Bangla & English** | Toggle between **উভয় (Both)**, **বাংলা (Bangla)**, or **English** views for titles, ingredients, and instructions. |
| **📖 Keepsake Print-to-PDF Book** | Formats an archival PDF book with `@media print`: designed cover page with customizable family dedication (*"For Dadu, with love"*), Table of Contents, and one recipe per printed page. |
| **🔒 100% Client-Side Privacy** | Zero database required. Recipes live strictly in your browser's `localStorage`, with full JSON Export and Import capabilities. |
| **⚡ 100% Demoable Offline** | Includes a one-click *"Load Demo Cookbook"* with 6 authentic heirloom Bengali recipes and stylized SVG art (Shorshe Ilish, Aloo Posto, Bhoger Khichuri, Chingri Malai Curry, Notun Gurer Payesh, and Begun Bhaja). |

---

## 🖼️ Visual Tour & Assets

The app embraces a warm, kitchen-inspired aesthetic rooted in Bengali culinary heritage: turmeric yellow (`#F59E0B`), chili red (`#DC2626`), fresh banana-leaf green (`#16A34A`), and cream paper parchment textures (`#FFFDF8`).

- **Hero Illustration**: Traditional clay pot (*handi*), brass spoon (*khunti*), steaming aroma, fresh red and green chillies, and grandma's handwritten notebook.
- **Empty State**: An open blank journal with warm tea and quill, inviting the family to transcribe their memories.
- **Authentic Food Art**: Hand-crafted vector SVGs for Shorshe Ilish, Aloo Posto, Khichuri, Chingri Malai Curry, Payesh, and Begun Bhaja.
- **Alpana Borders**: Traditional folk floor-art motifs framing the printed keepsake cover and recipe cards.

---

## 🛠️ Architecture & Tech Stack

```
dadur-ranna/
├── public/                  # Static frontend (Vanilla HTML/CSS/JS, zero build step)
│   ├── assets/              # Hand-crafted SVGs, favicon, dev.to cover, OG image
│   │   ├── recipes/         # Food SVGs for 6 authentic Bengali dishes
│   │   ├── logo.svg
│   │   ├── hero.svg
│   │   ├── cover.png        # 1000x420 px Dev.to cover
│   │   └── og-image.png     # 1200x630 px OpenGraph preview
│   ├── css/style.css        # Warm kitchen theme, Alpana frames, @media print rules
│   ├── js/app.js            # Canvas compression, fraction scaler, editor, print
│   ├── js/demo-recipes.js   # 6 bilingual demo recipes & sample messy notes
│   └── index.html           # Accessible single-page web app
├── src/
│   ├── llm.js               # Provider abstraction (Gemma via AI Studio & OpenAI-compat)
│   ├── prompts.js           # Bilingual culinary prompt for Gemma (JSON output)
│   └── schema.js            # Zod validation & JSON repair/sanitization
├── scripts/
│   └── make-images.js       # Sharp script to generate PNG assets
├── test/                    # Node.js built-in test runner suite
│   ├── app.test.js          # Unit tests for schema and prompt generation
│   └── server.test.js       # Integration tests for /healthz, /api/config, /api/extract
├── server.js                # Express server with Helmet CSP, Rate Limiting, Multer
├── render.yaml              # Render Blueprint specification
└── package.json             # Pinned dependencies (Node >=20)
```

---

## 🚀 Quickstart & Local Run

### Prerequisites
- Node.js `>= 20.0.0`
- npm `>= 10.0.0`

### 1. Clone & Install
```bash
git clone https://github.com/SayemR0018/dadurRanna.git
cd dadurRanna
npm install
```

### 2. Configure Environment
Create a `.env` file from `.env.example`:
```bash
cp .env.example .env
```

Add your Google AI Studio API key (free at [aistudio.google.com](https://aistudio.google.com/)):
```env
LLM_PROVIDER=gemma
GEMMA_API_KEY=AIzaSy...your_google_ai_studio_api_key
GEMMA_MODEL=gemma-3-27b-it
PORT=3000
```
*(Note: If you run without an API key, Dadur Ranna still runs seamlessly with offline demo extractions and the full 6-recipe interactive cookbook!)*

### 3. Run Development Server
```bash
# Generate PNG assets (already committed, but rebuildable anytime)
npm run images

# Run test suite
npm test

# Start the server
npm start
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🦙 Running 100% Locally with Ollama (Zero Cost, Full Privacy)

Dadur Ranna includes a zero-code-change provider abstraction that works with local open-weight models running on Ollama, vLLM, or LM Studio.

1. **Pull Gemma on Ollama**:
   ```bash
   ollama run gemma:27b
   # Or for lighter machines:
   ollama run gemma:9b
   ```

2. **Update your `.env`**:
   ```env
   LLM_PROVIDER=openai_compat
   LLM_BASE_URL=http://localhost:11434/v1
   LLM_MODEL=gemma:27b
   ```

3. **Restart the server**:
   ```bash
   npm start
   ```
Now all handwritten extractions run entirely offline on your own machine. Your family recipe photos never leave your local network!

---

## ⚙️ Environment Variables

| Variable | Description | Default | Required? |
| :--- | :--- | :--- | :--- |
| `PORT` | HTTP port to listen on (0.0.0.0) | `3000` | No |
| `LLM_PROVIDER` | `gemma` or `openai_compat` | `gemma` | No |
| `GEMMA_API_KEY` | Google AI Studio API Key | `""` | Yes (for live cloud Gemma) |
| `GEMMA_MODEL` | Open-weight Gemma model identifier | `gemma-3-27b-it` | No |
| `LLM_BASE_URL` | Base URL for OpenAI-compatible endpoint | `http://localhost:11434/v1` | If `openai_compat` |
| `LLM_MODEL` | Model tag for OpenAI-compatible endpoint | `gemma:27b` | If `openai_compat` |
| `LLM_API_KEY` | Optional bearer token for OpenAI endpoint | `""` | No |

---

## ☁️ Deploying to Render

Dadur Ranna is pre-configured with a **Render Blueprint (`render.yaml`)** for one-click deployment:

1. Push your repository to GitHub (`SayemR0018/dadurRanna`).
2. Log in to [Render Dashboard](https://dashboard.render.com/).
3. Click **New +** > **Blueprint**.
4. Connect your repository `SayemR0018/dadurRanna`.
5. Render reads `render.yaml` automatically and configures:
   - **Service Name**: `dadur-ranna`
   - **Runtime**: `Node 20`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Health Check Path**: `/healthz`
6. Under **Environment Variables**, set:
   - `GEMMA_API_KEY`: Paste your key from Google AI Studio.
7. Click **Apply**. Within 2 minutes, your web app is live!

---

## 💡 Why Open Innovation Matters

*An excerpt from our submission reflection:*

When we think about preserving cultural heritage, we often picture ancient manuscripts locked in museum archives. But the most fragile heritage in the world lives on kitchen shelves—a grandmother's handwritten notebook with turmeric stains on the margins, loose sheets tucked into recipe books, and informal measurements like *"এক চিমটি"* (a pinch) or *"কাচের বাটি মেপে"* (measured with the glass tea bowl).

Building **Dadur Ranna** with open-weight **Gemma** crystallizes why open innovation is essential:

1. **Freedom from Walled Gardens**: Family recipes belong to families, not to proprietary cloud vendors who might deprecate an API, change pricing tiers, or lock data inside a subscription. Because Gemma is open-weight, this entire application can run on a laptop in an offline village home with Ollama.
2. **Privacy for Intimate Memories**: Handwritten notebooks often contain family names, telephone numbers written in the margins, and personal memories. With open-weight models, users are never forced to send photos of their grandmothers' handwriting to closed black-box servers.
3. **Deciphering Cultural Nuance without Censorship or Hallucination**: Closed models often silently "hallucinate" standard Western culinary measurements when they don't understand a Bengali colloquial term. Gemma allows us to enforce strict human-in-the-loop uncertainty flags: *if the ink is faded or the instruction is ambiguous, flag it in yellow and ask the human cook*.
4. **Zero-Cost Longevity**: Open innovation ensures that this digital cookbook archiver will still run 10, 20, or 50 years from now. As long as we have electricity and open software, Dadu's kitchen wisdom will never be lost.

---

## 📄 License

MIT License. Designed and crafted with love for family culinary heritage.
