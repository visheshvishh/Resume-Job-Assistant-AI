# ResumeAI — ATS Analyzer

A web-based tool to analyze your resume against job descriptions and get an ATS (Applicant Tracking System) match score with actionable feedback.

## 📁 Project Structure

```
.
├── index.html          # Main HTML structure
├── styles.css          # All styling and design
├── script.js           # JavaScript functionality
└── README.md           # This file
```

## 📄 File Breakdown

### `index.html`
- **Purpose**: Contains the semantic HTML structure
- **Sections**:
  - Navigation bar with logo and status
  - Three main tabs: Analyze, Results, Job Links
  - Upload zone for resume files (PDF, DOCX, TXT)
  - Textarea inputs for resume and job description
  - Results display area with scoring and feedback
  - Job listings section

### `styles.css`
- **Purpose**: Complete styling with CSS custom properties (variables)
- **Key Sections**:
  - **Color Variables**: Dark theme with accent colors (`--bg`, `--accent`, `--success`, etc.)
  - **Navigation**: Logo, badges, status indicators
  - **Upload Zone**: Drag-and-drop file upload styling
  - **Buttons**: Primary and ghost variants with hover effects
  - **Score Display**: Circular progress ring and metrics breakdown
  - **Cards & Grids**: Responsive layout components
  - **Feedback Items**: Error, warning, success, and info icons
  - **Job Listings**: Job portal logos and links
  - **Animations**: Spinner and smooth transitions

### `script.js`
- **Purpose**: All interactive functionality
- **Key Functions**:
  - **File Handling**:
    - `handleFile()` - Process uploaded files
    - `extractPDF()` - Extract text from PDF files
    - `extractDOCX()` - Extract text from DOCX files
    - `clearFile()` - Reset upload state
  - **Data Extraction**:
    - `extractKw()` - Extract tech keywords from resume/JD
    - `extractName()` - Parse candidate name
    - `extractEmail()` - Parse email address
    - `extractYears()` - Calculate years of experience
    - `extractEdu()` - Extract education level
    - `extractRole()` - Extract job role from JD
  - **Analysis**:
    - `computeScores()` - Calculate keyword, experience, format, and education match scores
    - `gradeScore()` - Assign letter grade based on total score
    - `buildFeedback()` - Generate actionable feedback items
    - `buildJobs()` - Generate job search links (LinkedIn, Naukri, Indeed, etc.)
  - **UI**:
    - `runAnalysis()` - Main analysis orchestration
    - `goTab()` - Switch between tabs
    - `animNum()` - Animate number counter
    - `exportReport()` - Download analysis as text file

## 🚀 Features

### Resume Upload & Processing
- Support for PDF, DOCX, and TXT files (up to 10 MB)
- Drag-and-drop upload zone
- Progress bar during file reading
- Preview of extracted text

### Smart Analysis
- **Keyword Matching**: Compares 50+ tech skills between resume and JD
- **Experience Detection**: Identifies years of experience and relevant keywords
- **Format Quality**: Checks for proper resume structure
- **Education Parsing**: Recognizes education level
- **Overall Score**: Composite score from 0-100

### Scoring Breakdown
- Keyword match (45% weight)
- Experience relevance (25% weight)
- Format quality (15% weight)
- Education match (15% weight)

### Feedback & Recommendations
- Error alerts for missing key skills
- Warning suggestions to improve keyword match
- Tips for better resume formatting
- Recognition of strong skill coverage
- ATS optimization best practices

### Live Job Links
- **LinkedIn**: Searches by role and skills
- **Naukri**: India-focused job listings
- **Google for Jobs**: Aggregated job search
- **Indeed India**: Fresh listings sorted by date
- **Internshala**: Internship opportunities
- **Wellfound**: Startup and scale-up positions

### Export Report
- Download analysis as text file
- Includes all scores, feedback, matched/missing keywords
- Extracted profile information
- Generated job search links

## 🎨 Color Scheme

The app uses a dark theme with purple and green accents:
- **Background**: `#0a0a0f` (very dark)
- **Accent**: `#6c63ff` (purple)
- **Success**: `#22d3a0` (green)
- **Warning**: `#f59e0b` (orange)
- **Danger**: `#f43f5e` (red)

## 🔧 Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **PDF Processing**: PDF.js library
- **No Backend**: All processing happens client-side
- **No External APIs**: Zero dependencies for analysis

## 📝 Usage

1. Open `index.html` in a web browser
2. Upload your resume (PDF, DOCX, or TXT)
3. Paste the job description
4. Click "Analyze match"
5. Review the results, feedback, and job recommendations
6. Optionally export the report as a text file

## 🔐 Privacy

All analysis happens locally in your browser. No data is sent to any server.

## 📈 How Scoring Works

### Keyword Match (45%)
- Compares 50+ tech skills from predefined list
- Calculates percentage of JD keywords found in resume

### Experience Relevance (25%)
- Detects experience-related words (years, senior, lead, delivered, built, etc.)
- Bonus points for quantified achievements

### Format Quality (15%)
- Checks for standard section headers (Skills, Experience, Education)
- Looks for formatting indicators (bullet points, links, structure)

### Education Match (15%)
- Recognizes degree types (Bachelor, Master, B.E., M.Tech, etc.)
- Returns 80% if found, 45% if not specified

## 🎯 Grading Scale

- **80-100**: Excellent match ✓
- **65-79**: Strong match ✓
- **50-64**: Good match
- **35-49**: Fair match
- **0-34**: Weak match

## 📚 Supported Resume Formats

- **PDF**: Extracts text using PDF.js
- **DOCX**: Parses XML structure
- **TXT**: Plain text upload
- **Maximum Size**: 10 MB

## 💡 Tips for Best Results

- Use standard section headers (Skills, Experience, Education, Contact)
- Include actual years and dates in your experience section
- List your email address and GitHub/LinkedIn links
- Use consistent terminology with the job description
- Quantify your achievements where possible
- Avoid tables, images, and complex formatting in uploads

---

**ResumeAI** — Optimize your resume for ATS success 🚀
