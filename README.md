# ResuMatch — Resume Skill Gap Analyser

Full-stack webapp (React + Vite + Tailwind CSS frontend · Flask backend)  
paired with `Resume_Job_Screening_fixed.ipynb`.

---

## Quick Start

### 1 · Backend

```bash
cd resumatch/backend
pip install -r requirements.txt

# default: mock mode (no model files needed)
MOCK_MODE=true python app.py        # → http://localhost:5000
```

### 2 · Frontend

```bash
cd resumatch/frontend
npm install
npm run dev                         # → http://localhost:5173
```

Vite proxies all `/api/*` requests to Flask automatically — no CORS config needed in dev.

---

## Switching to the real RF model

After running the notebook end-to-end in Colab, download:

| File | Colab path |
|---|---|
| `tfidf_vectorizer.pkl` | `tfidf_vectorizer.pkl` |
| `rf_model_95pct.pkl`   | `rf_model_95pct.pkl` |
| `Coursera.xlsx`        | `/content/Coursera.xlsx` |
| `naukri_data_science_jobs_india.xlsx` | `/content/naukri_data_science_jobs_india.xlsx` |

Place them in:

```
backend/
├── models/
│   ├── tfidf_vectorizer.pkl
│   └── rf_model_95pct.pkl
└── data/
    ├── Coursera.xlsx
    └── naukri_data_science_jobs_india.xlsx
```

Then restart Flask:

```bash
MOCK_MODE=false python app.py
```

`GET /api/health` returns `{ mock_mode, models_loaded, courses_loaded }` to confirm.

---

## File upload (PDF / DOCX)

The `/api/parse-resume` endpoint handles `.txt`, `.pdf`, and `.docx`.  
`PyMuPDF` and `python-docx` are already in `requirements.txt`.

---

## API reference

### `POST /api/analyze`
```json
{ "resume_text": "...", "job_desc": "..." }
```
Returns: `match_score`, `tfidf_similarity`, `skill_overlap_pct`, `skill_gap`,
`recommended_courses`, `explainability`, `mock_mode`.

### `GET /api/jobs?q=data+scientist&limit=25`
Returns job list from Naukri dataset (or 8 mock jobs if file absent).

### `GET /api/jobs/:id`
Single job by index.

### `POST /api/parse-resume`
Multipart file upload (`.txt`, `.pdf`, `.docx`).  
Returns `{ text, chars }`.

### `GET /api/health`
Returns `{ status, mock_mode, models_loaded, courses_loaded }`.

---

## Colour palette

| Token | Light | Dark |
|---|---|---|
| Background | `#F5F0E8` (warm cream) | `#161210` (warm near-black) |
| Card | `#FFFCF7` (ivory) | `#1E1A18` |
| Accent / Clay | `#C4501A` | `#E8693A` |
| Text | `#1A1714` | `#F0EBE3` |

Dark mode is toggled via the sun/moon button in the navbar and persisted to `localStorage`.

---

## Folder structure

```
resumatch/
├── backend/
│   ├── app.py                   Flask create_app factory
│   ├── config.py                env-var config
│   ├── requirements.txt
│   ├── models/                  ← drop .pkl files here
│   ├── data/                    ← drop .xlsx files here
│   ├── routes/
│   │   ├── analyze.py           POST /api/analyze
│   │   ├── jobs.py              GET  /api/jobs
│   │   ├── upload.py            POST /api/parse-resume
│   │   └── health.py            GET  /api/health
│   ├── ml/
│   │   ├── matcher.py           ResumeMatcherAPI singleton
│   │   ├── skill_extractor.py   51-skill taxonomy + compute_skill_gap()
│   │   ├── text_cleaner.py      clean_text()
│   │   └── course_recommender.py recommend_courses()
│   └── utils/
│       └── validators.py
│
└── frontend/
    ├── index.html
    ├── vite.config.js           /api proxy → :5000
    ├── tailwind.config.js       cream palette + Instrument Serif + DM Mono
    ├── postcss.config.js
    └── src/
        ├── App.jsx              ThemeCtx (dark mode) + routing
        ├── index.css            CSS variables light/dark + Tailwind
        ├── main.jsx
        ├── pages/
        │   ├── Home.jsx
        │   ├── Analyze.jsx
        │   └── Results.jsx
        ├── components/
        │   ├── Navbar.jsx       sticky · visible tabs · theme toggle
        │   ├── ScoreRing.jsx    SVG ring + count-up animation
        │   ├── SkillGapChart.jsx matched/missing/bonus tags + coverage bar
        │   ├── CourseCard.jsx   Coursera cards with real URLs + ratings
        │   ├── ExplainPanel.jsx decision factor bars + reasoning
        │   ├── JobSelector.jsx  debounced live-search dropdown
        │   └── UploadZone.jsx   drag-drop + browse + paste (.txt/.pdf/.docx)
        ├── hooks/
        │   ├── useAnalyze.js
        │   └── useJobs.js
        └── utils/
            ├── api.js
            └── formatters.js
```
