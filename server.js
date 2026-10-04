require('dotenv').config();
const express = require('express');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const multer = require('multer');
const { extractRecipe } = require('./src/llm');

const app = express();
const PORT = process.env.PORT || 3000;

// Trust proxy for Render and cloud reverse proxies
app.set('trust proxy', 1);

// Security Headers with CSP allowing Google Fonts and internal assets
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'],
        imgSrc: ["'self'", 'data:', 'blob:'],
        connectSrc: ["'self'"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: []
      }
    },
    crossOriginEmbedderPolicy: false
  })
);

// CORS configuration (same-origin / local dev)
app.use(cors());

// Parse JSON bodies (max 2MB for messy text or import)
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// Multer memory storage with 8MB file size limit and strict mime types
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 8 * 1024 * 1024, // 8MB per file
    files: 4
  },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowed.includes(file.mimetype.toLowerCase())) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and WebP images are supported.'));
    }
  }
});

// Rate limiting: 20 req/minute on /api
const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many extraction requests from this IP. Please wait a minute and try again.'
  }
});

app.use('/api/', apiLimiter);

// Health check endpoint for Render
app.get('/healthz', (req, res) => {
  res.status(200).send('ok');
});

// Config endpoint for client footer and status
app.get('/api/config', (req, res) => {
  const provider = (process.env.LLM_PROVIDER || 'gemma').toLowerCase();
  const model = provider === 'openai_compat'
    ? (process.env.LLM_MODEL || 'gemma:27b')
    : (process.env.GEMMA_MODEL || 'gemma-3-27b-it');
  const hasKey = provider === 'openai_compat' ? true : Boolean(process.env.GEMMA_API_KEY);

  res.json({
    provider,
    model,
    hasKey,
    label: provider === 'openai_compat'
      ? `Powered by open-weight ${model} (Local/Compatible)`
      : `Powered by open-weight Gemma (${model})`
  });
});

// Recipe extraction endpoint
app.post('/api/extract', upload.array('images', 4), async (req, res) => {
  try {
    const text = (req.body.text || '').trim();
    const images = req.files || [];

    if (!text && images.length === 0) {
      return res.status(400).json({
        error: 'Please provide either recipe text or upload at least one handwritten recipe photo.'
      });
    }

    // Call LLM abstraction without logging raw text or image buffers
    console.log(`[API] Extract request received: ${images.length} images, text length: ${text.length}`);

    const recipe = await extractRecipe({ text, images });
    return res.json({ success: true, recipe });
  } catch (err) {
    console.error('[API] Extraction failure:', err.message);
    return res.status(500).json({
      error: err.message || 'Failed to extract recipe from input',
      details: 'You can retry the extraction or enter the details manually.'
    });
  }
});

// Serve static frontend files from /public
app.use(express.static(path.join(__dirname, 'public')));

// Global Multer and application error handling
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'Image size exceeds 8MB limit. Please upload a smaller image.' });
    }
    return res.status(400).json({ error: `Upload error: ${err.message}` });
  }
  if (err) {
    console.error('[Server Error]:', err.message);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
  next();
});

let server;
if (require.main === module) {
  server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Dadur Ranna server running at http://0.0.0.0:${PORT}`);
  });
  server.setTimeout(60000);
}

module.exports = app;

