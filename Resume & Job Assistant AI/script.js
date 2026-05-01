// Initialize PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

// Global state
let G = null;
let extractedText = '';

// ===== THEME TOGGLE =====
function initTheme() {
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);
  
  document.getElementById('themeToggle').addEventListener('click', toggleTheme);
}

function toggleTheme() {
  const html = document.documentElement;
  const currentTheme = html.getAttribute('data-theme') || 'dark';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  html.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
  const icon = document.querySelector('.theme-icon');
  icon.textContent = theme === 'dark' ? '☀️' : '🌙';
}

// Initialize theme on page load
document.addEventListener('DOMContentLoaded', initTheme);

// ===== TAB NAVIGATION =====
function goTab(name, btn) {
  ['analyze', 'results', 'jobs'].forEach(t => 
    document.getElementById('pane-' + t).style.display = 'none'
  );
  document.querySelectorAll('.tab').forEach(b => b.classList.remove('on'));
  document.getElementById('pane-' + name).style.display = 'block';
  btn.classList.add('on');
}

// ===== FILE HANDLING =====
function handleDrop(e) {
  e.preventDefault();
  document.getElementById('dropzone').classList.remove('drag');
  const f = e.dataTransfer.files[0];
  if (f) handleFile(f);
}

async function handleFile(file) {
  if (!file) return;
  
  const zone = document.getElementById('dropzone');
  const maxMB = 10;
  
  if (file.size > maxMB * 1024 * 1024) {
    showUploadErr('File too large. Max 10 MB.');
    return;
  }

  zone.classList.remove('done', 'err', 'drag');
  document.getElementById('uIcon').textContent = '⏳';
  document.getElementById('uTitle').textContent = 'Reading file...';
  document.getElementById('uSub').textContent = file.name;
  
  const pw = document.getElementById('progWrap');
  const pb = document.getElementById('progBar');
  pw.style.display = 'block';
  pb.style.width = '30%';

  try {
    let text = '';
    const name = file.name.toLowerCase();
    
    if (name.endsWith('.pdf')) {
      text = await extractPDF(file, w => { pb.style.width = w + '%'; });
    } else if (name.endsWith('.docx')) {
      text = await extractDOCX(file);
      pb.style.width = '90%';
    } else {
      text = await file.text();
      pb.style.width = '90%';
    }

    if (!text || text.trim().length < 30) {
      showUploadErr('Could not extract text. Try a different file or paste manually.');
      return;
    }

    pb.style.width = '100%';
    extractedText = text.trim();
    document.getElementById('resumeTxt').value = extractedText;

    setTimeout(() => {
      pw.style.display = 'none';
      pb.style.width = '0%';
      zone.classList.add('done');
      document.getElementById('uIcon').textContent = '✅';
      document.getElementById('uTitle').textContent = file.name;
      document.getElementById('uSub').textContent = Math.round(extractedText.split(/\s+/).length) + ' words extracted';

      const fi = document.getElementById('fileInfo');
      document.getElementById('fileBadge').textContent = file.name;
      fi.style.display = 'flex';

      const prev = document.getElementById('previewBox');
      document.getElementById('previewText').textContent = 
        extractedText.substring(0, 400) + (extractedText.length > 400 ? '\n\n[...]' : '');
      prev.style.display = 'block';
    }, 300);

  } catch (e) {
    showUploadErr('Error reading file: ' + e.message + '. Try pasting the text manually.');
  }
}

async function extractPDF(file, onProgress) {
  const buf = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
  let text = '';
  
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map(s => s.str).join(' ') + '\n';
    onProgress(Math.round(30 + (i / pdf.numPages) * 60));
  }
  return text.trim();
}

async function extractDOCX(file) {
  const buf = await file.arrayBuffer();
  const zip = await new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const bytes = new Uint8Array(e.target.result);
        let binary = '';
        for (let b of bytes) binary += String.fromCharCode(b);
        res(atob(btoa(binary)));
      } catch (err) {
        rej(err);
      }
    };
    reader.onerror = rej;
    reader.readAsArrayBuffer(file);
  });
  
  const text = await file.text().catch(() => '');
  const xmlMatch = text.match(/<w:t[^>]*>([^<]*)<\/w:t>/g) || [];
  return xmlMatch.map(m => m.replace(/<[^>]+>/g, '')).join(' ').trim() || 'Could not parse DOCX';
}

function showUploadErr(msg) {
  const zone = document.getElementById('dropzone');
  zone.classList.add('err');
  document.getElementById('uIcon').textContent = '❌';
  document.getElementById('uTitle').textContent = 'Upload failed';
  document.getElementById('uSub').textContent = msg;
  document.getElementById('progWrap').style.display = 'none';
}

function clearFile(e) {
  e.stopPropagation();
  extractedText = '';
  document.getElementById('resumeTxt').value = '';
  document.getElementById('fileInput').value = '';
  
  const zone = document.getElementById('dropzone');
  zone.classList.remove('done', 'err');
  document.getElementById('uIcon').textContent = '📄';
  document.getElementById('uTitle').textContent = 'Drop your resume here';
  document.getElementById('uSub').textContent = 'Click to browse files';
  document.getElementById('fileInfo').style.display = 'none';
  document.getElementById('previewBox').style.display = 'none';
  document.getElementById('progWrap').style.display = 'none';
}

// ===== SAMPLE DATA =====
function loadSample() {
  const sampleResume = `Vishesh Vishwakarma
Software Engineer| Mumbai, India
vishesh8828@gmail.com | github.com/visheshvishh

SKILLS
Languages: Python, JavaScript, TypeScript, SQL
Frameworks: React.js, Node.js, FastAPI, Django
Databases: PostgreSQL, MySQL, Redis
Cloud: AWS (EC2, S3, RDS), Docker
Tools: Git, Jira, Linux, Postman

EXPERIENCE
Software Developer — TechCorp India, Pune (2021–2024)
• Built REST APIs in Python/FastAPI serving 100k daily requests
• Developed React.js dashboards with real-time analytics
• Managed PostgreSQL databases and complex SQL queries
• Deployed microservices with Docker on AWS EC2
• Worked in Agile sprints with daily standups

Junior Developer — StartupXYZ (2020–2021)
• Developed CRUD apps in Django and MySQL
• Created responsive UIs with React and Tailwind CSS

EDUCATION
B.E. Computer Science — Pune University, 2020`;

  document.getElementById('resumeTxt').value = sampleResume;
  extractedText = sampleResume;

  document.getElementById('jdTxt').value = `Senior Full Stack Engineer — FinTech Platform

Requirements:
• 3+ years Python (FastAPI, Django)
• React.js, TypeScript, Next.js
• PostgreSQL, Redis, MongoDB
• AWS (EC2, S3, Lambda, RDS)
• Docker, Kubernetes
• REST API and GraphQL
• Agile / Scrum
• Strong communication skills

Nice to have: Machine learning, Kafka, Terraform, CI/CD`;
}

// ===== KEYWORD EXTRACTION =====
const TECH = [
  'python', 'javascript', 'typescript', 'react', 'node', 'nodejs',
  'fastapi', 'django', 'flask', 'express', 'next.js', 'nextjs',
  'vue', 'angular', 'svelte', 'java', 'golang', 'go', 'rust', 'c++',
  'scala', 'kotlin', 'swift', 'php', 'ruby', 'rails',
  'postgresql', 'mysql', 'mongodb', 'redis', 'sqlite', 'cassandra',
  'elasticsearch', 'dynamodb', 'aws', 'gcp', 'azure', 'docker',
  'kubernetes', 'k8s', 'terraform', 'ansible', 'jenkins',
  'github actions', 'ci/cd', 'linux', 'rest', 'graphql', 'grpc',
  'microservices', 'kafka', 'rabbitmq', 'machine learning',
  'deep learning', 'nlp', 'tensorflow', 'pytorch', 'scikit',
  'pandas', 'numpy', 'html', 'css', 'tailwind', 'sql', 'nosql',
  'jwt', 'oauth', 'git', 'agile', 'scrum', 'jira', 'lambda', 's3',
  'ec2', 'rds', 'nginx', 'system design', 'algorithms',
  'data structures', 'communication', 'leadership',
  'problem solving', 'typescript'
];

function extractKw(t) {
  const l = t.toLowerCase();
  return TECH.filter(k => l.includes(k));
}

function extractName(t) {
  const lines = t.trim().split('\n').map(l => l.trim()).filter(l => l);
  for (let l of lines.slice(0, 4)) {
    if (l.length > 2 && l.length < 50 && /^[A-Z][a-z]/.test(l) &&
        !l.includes('@') && !l.includes('http') && !l.includes(':'))
      return l;
  }
  return 'Candidate';
}

function extractEmail(t) {
  const m = t.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  return m ? m[0] : null;
}

function extractYears(t) {
  const ms = t.match(/(\d{4})\s*[–\-—]\s*(\d{4}|present|current)/gi) || [];
  let tot = 0;
  ms.forEach(m => {
    const p = m.match(/(\d{4})/g);
    if (p) {
      const e = p[1] ? parseInt(p[1]) : 2024;
      tot += e - parseInt(p[0]);
    }
  });
  return tot || null;
}

function extractEdu(t) {
  const m = t.match(/(b\.?e\.?|b\.?tech|b\.?sc|m\.?tech|m\.?sc|mba|phd|bachelor|master|degree)[^\n,]*/i);
  return m ? m[0].trim().substring(0, 60) : null;
}

function extractRole(jd) {
  const lines = jd.split('\n').map(l => l.trim()).filter(l => l.length > 4);
  for (let l of lines.slice(0, 6)) {
    if (/engineer|developer|analyst|designer|manager|lead|architect|scientist/i.test(l))
      return l.replace(/[^a-zA-Z\s\/]/g, '').trim().substring(0, 45);
  }
  return 'software engineer';
}

// ===== SCORING LOGIC =====
function computeScores(rKw, jKw, resume) {
  const matched = jKw.filter(k => rKw.includes(k));
  const missing = jKw.filter(k => !rKw.includes(k));
  const kw = jKw.length ? Math.round((matched.length / jKw.length) * 100) : 50;
  
  const low = resume.toLowerCase();
  const exp = Math.min(100, 40 + ['experience', 'years', 'senior', 'lead', 'architect', 'delivered', 'built', 'designed', 'managed']
    .filter(w => low.includes(w)).length * 8);
  
  const fmt = Math.min(100, ['skills', 'experience', 'education', '•', '-', '@', 'github', 'linkedin']
    .filter(w => low.includes(w)).length * 13);
  
  const edu = /university|college|b\.e|b\.tech|degree|bachelor|master/i.test(resume) ? 80 : 45;
  
  const total = Math.min(100, Math.round(kw * 0.45 + exp * 0.25 + fmt * 0.15 + edu * 0.15));
  
  return { total, kw, exp, fmt, edu, matched, missing };
}

function gradeScore(s) {
  if (s >= 80) return { g: 'Excellent match', c: '#22d3a0', ring: '#22d3a0' };
  if (s >= 65) return { g: 'Strong match', c: '#9d77ff', ring: '#6c63ff' };
  if (s >= 50) return { g: 'Good match', c: '#f59e0b', ring: '#f59e0b' };
  if (s >= 35) return { g: 'Fair match', c: '#f97316', ring: '#f97316' };
  return { g: 'Weak match', c: '#f43f5e', ring: '#f43f5e' };
}

function barCol(v) {
  return v >= 70 ? '#22d3a0' : v >= 50 ? '#f59e0b' : '#f43f5e';
}

function buildFeedback(d) {
  const items = [];
  
  if (d.missing.length > 3)
    items.push({ t: 'err', i: '✕', h: 'Missing key skills', m: `Add to resume if you have them: ${d.missing.slice(0, 5).join(', ')}.` });
  
  if (d.kw < 50)
    items.push({ t: 'warn', i: '!', h: 'Low keyword match', m: 'Mirror exact language from the JD — ATS scans for exact keyword matches.' });
  
  if (d.fmt < 50)
    items.push({ t: 'warn', i: '!', h: 'Improve resume format', m: 'Use clear section headers, bullet points, and include GitHub/LinkedIn links.' });
  
  if (d.exp < 60)
    items.push({ t: 'warn', i: '!', h: 'Quantify your impact', m: 'Add numbers: "increased performance by 40%", "led team of 5", "reduced deploy time by 60%".' });
  
  if (d.matched.length >= 5)
    items.push({ t: 'ok', i: '✓', h: 'Good skill coverage', m: `You match ${d.matched.length} key skills. Highlight these prominently.` });
  
  items.push({ t: 'info', i: 'i', h: 'ATS tip', m: 'Use standard section names. Avoid tables or graphics — plain structured text scans best.' });
  
  return items;
}

// ===== JOB SEARCH LINKS =====
function buildJobs(rKw, jKw, jd) {
  const role = extractRole(jd);
  const skills = [...new Set([...rKw, ...jKw])].slice(0, 4).join(' ');
  const rE = encodeURIComponent(role);
  const sE = encodeURIComponent(skills.substring(0, 35));
  const cE = encodeURIComponent((role + ' ' + skills).substring(0, 40));

  return [
    { logo: 'in', bg: '#0A66C2', portal: 'LinkedIn', title: `${role} — posted today`, loc: 'Worldwide', url: `https://www.linkedin.com/jobs/search/?keywords=${rE}&f_TPR=r86400&sortBy=DD` },
    { logo: 'in', bg: '#0A66C2', portal: 'LinkedIn', title: `${skills.substring(0, 30)} roles — this week`, loc: 'Worldwide', url: `https://www.linkedin.com/jobs/search/?keywords=${sE}&f_TPR=r604800` },
    { logo: 'N', bg: '#FF7555', portal: 'Naukri', title: `${role} — Naukri listings`, loc: 'India', url: `https://www.naukri.com/${role.replace(/\s+/g, '-').toLowerCase()}-jobs` },
    { logo: 'N', bg: '#FF7555', portal: 'Naukri', title: `${role} in Bangalore / Pune`, loc: 'India', url: `https://www.naukri.com/jobs-in-bangalore?keyword=${rE}` },
    { logo: 'G', bg: '#4285F4', portal: 'Google Jobs', title: `${role} — Google for Jobs`, loc: 'Worldwide', url: `https://www.google.com/search?q=${cE}+jobs+hiring+2025&ibp=htl;jobs` },
    { logo: 'G', bg: '#4285F4', portal: 'Google Jobs', title: `${skills.substring(0, 25)} developer jobs India`, loc: 'India', url: `https://www.google.com/search?q=${sE}+developer+jobs+india&ibp=htl;jobs` },
    { logo: 'id', bg: '#003A9B', portal: 'Indeed', title: `${role} — fresh listings`, loc: 'India', url: `https://in.indeed.com/jobs?q=${rE}&sort=date` },
    { logo: 'id', bg: '#003A9B', portal: 'Indeed', title: `${role} in Bengaluru`, loc: 'India', url: `https://in.indeed.com/jobs?q=${rE}&l=Bengaluru&sort=date` },
    { logo: 'IS', bg: '#00AEEF', portal: 'Internshala', title: `${role} — Internshala`, loc: 'India', url: `https://internshala.com/jobs/keyword-${role.replace(/\s+/g, '-').toLowerCase()}` },
    { logo: 'AL', bg: '#7F77DD', portal: 'Wellfound', title: `${role} — startup jobs`, loc: 'Global startups', url: `https://wellfound.com/jobs?q=${rE}` },
  ];
}

// ===== ANIMATIONS =====
function animNum(id, to, dur) {
  const el = document.getElementById(id);
  const s = performance.now();
  
  function f(t) {
    const p = Math.min((t - s) / dur, 1);
    const e = 1 - Math.pow(1 - p, 4);
    el.textContent = Math.round(to * e);
    if (p < 1) requestAnimationFrame(f);
  }
  
  requestAnimationFrame(f);
}

// ===== MAIN ANALYSIS =====
function runAnalysis() {
  const resume = document.getElementById('resumeTxt').value.trim();
  const jd = document.getElementById('jdTxt').value.trim();
  const err = document.getElementById('errBox');
  
  err.style.display = 'none';
  
  if (!resume || resume.length < 40) {
    err.textContent = 'Please upload or paste your resume first.';
    err.style.display = 'block';
    return;
  }
  
  if (!jd || jd.length < 20) {
    err.textContent = 'Please paste the job description.';
    err.style.display = 'block';
    return;
  }

  const btn = document.getElementById('analyzeBtn');
  btn.disabled = true;
  document.getElementById('btnIcon').innerHTML = '<div class="spinner"></div>';
  document.getElementById('btnTxt').textContent = 'Analyzing...';

  setTimeout(() => {
    const rKw = extractKw(resume);
    const jKw = extractKw(jd);
    const sc = computeScores(rKw, jKw, resume);
    const gd = gradeScore(sc.total);
    const fb = buildFeedback(sc);
    const jobs = buildJobs(rKw, jKw, jd);
    const name = extractName(resume);
    const email = extractEmail(resume);
    const yrs = extractYears(resume);
    const edu = extractEdu(resume);
    
    G = { sc, gd, fb, jobs, name, email, yrs, edu, rKw, jKw };

    // Update results UI
    document.getElementById('resEmpty').style.display = 'none';
    document.getElementById('resContent').style.display = 'block';
    
    document.getElementById('ringArc').style.stroke = gd.ring;
    setTimeout(() => {
      document.getElementById('ringArc').style.strokeDashoffset = 339.3 - (sc.total / 100) * 339.3;
    }, 80);
    
    animNum('ringNum', sc.total, 1300);
    
    const ge = document.getElementById('resGrade');
    ge.textContent = gd.g;
    ge.style.color = gd.c;
    
    const summs = [
      'Strong alignment with this role. Apply with confidence.',
      'Solid match — a few keyword additions could push you higher.',
      'Decent overlap but missing several key skills the JD emphasizes.',
      'Significant gaps between your resume and the job requirements.',
      'Resume needs substantial work before applying for this role.'
    ];
    document.getElementById('resSummary').textContent = 
      summs[sc.total >= 80 ? 0 : sc.total >= 65 ? 1 : sc.total >= 50 ? 2 : sc.total >= 35 ? 3 : 4];
    
    document.getElementById('resTags').innerHTML = [
      [sc.total >= 75, 'ATS Friendly'],
      [sc.kw >= 70, 'Strong keywords'],
      [sc.matched.length >= 6, 'Good skill match'],
      [sc.missing.length <= 3, 'Low gaps'],
      [sc.edu >= 70, 'Education match']
    ]
      .filter(([c]) => c)
      .map(([, l]) => `<span class="pill pill-p">${l}</span>`)
      .join('');

    // Score breakdown
    document.getElementById('breakdown').innerHTML = [
      ['Keyword match', sc.kw],
      ['Experience relevance', sc.exp],
      ['Format quality', sc.fmt],
      ['Education match', sc.edu]
    ]
      .map(([label, val]) => `
        <div class="sub-item">
          <div class="sub-row">
            <span class="sub-name">${label}</span>
            <span style="font-size:.78rem;color:${barCol(val)}">${val}%</span>
          </div>
          <div class="bar-bg">
            <div class="bar-fill" data-v="${val}" style="width:0%;background:${barCol(val)}"></div>
          </div>
        </div>
      `)
      .join('');
    
    setTimeout(() => {
      document.querySelectorAll('.bar-fill[data-v]').forEach(b => b.style.width = b.dataset.v + '%');
    }, 120);

    // Keywords
    document.getElementById('matchPills').innerHTML = sc.matched.length
      ? sc.matched.map(k => `<span class="pill pill-g">&#10003; ${k}</span>`).join('')
      : '<span style="font-size:.78rem;color:var(--text3)">None detected</span>';
    
    document.getElementById('missPills').innerHTML = sc.missing.slice(0, 10).length
      ? sc.missing.slice(0, 10).map(k => `<span class="pill pill-r">&#10005; ${k}</span>`).join('')
      : '<span style="font-size:.78rem;color:var(--success)">All covered!</span>';

    // Profile
    document.getElementById('profileBox').innerHTML = `
      <div style="display:grid;gap:10px;font-size:.83rem">
        <div>
          <span style="color:var(--text3);font-size:.65rem;text-transform:uppercase;letter-spacing:.06em">Name</span>
          <div style="font-weight:500;margin-top:2px">${name}</div>
        </div>
        <div>
          <span style="color:var(--text3);font-size:.65rem;text-transform:uppercase;letter-spacing:.06em">Email</span>
          <div style="margin-top:2px;color:var(--text2)">${email || 'Not found'}</div>
        </div>
        <div>
          <span style="color:var(--text3);font-size:.65rem;text-transform:uppercase;letter-spacing:.06em">Experience</span>
          <div style="margin-top:2px;color:var(--text2)">${yrs ? yrs + ' years detected' : 'Not detected'}</div>
        </div>
        <div>
          <span style="color:var(--text3);font-size:.65rem;text-transform:uppercase;letter-spacing:.06em">Education</span>
          <div style="margin-top:2px;color:var(--text2)">${edu || 'Not specified'}</div>
        </div>
        <div>
          <span style="color:var(--text3);font-size:.65rem;text-transform:uppercase;letter-spacing:.06em">Skills detected</span>
          <div style="margin-top:5px">${rKw.slice(0, 8).map(s => `<span class="chip"><span class="chip-dot" style="background:var(--accent2)"></span>${s}</span>`).join('')}</div>
        </div>
      </div>
    `;

    // Feedback
    const fiCls = { err: 'fi-err', warn: 'fi-warn', ok: 'fi-ok', info: 'fi-info' };
    document.getElementById('feedbackBox').innerHTML = fb.map(f => `
      <div class="fb-item">
        <div class="fi ${fiCls[f.t]}">${f.i}</div>
        <div>
          <div class="fb-title">${f.h}</div>
          <div class="fb-msg">${f.m}</div>
        </div>
      </div>
    `).join('');

    // Jobs
    document.getElementById('jobsEmpty').style.display = 'none';
    document.getElementById('jobsContent').style.display = 'block';
    document.getElementById('jobsSubline').textContent = 'Based on your skills: ' + rKw.slice(0, 4).join(', ');
    document.getElementById('jobsList').innerHTML = jobs.map((j, i) => `
      <div class="job-row">
        <div class="job-logo" style="background:${j.bg}22;color:${j.bg};border:1px solid ${j.bg}33">${j.logo}</div>
        <div style="flex:1;min-width:0">
          <a href="${j.url}" target="_blank" class="job-title">${i + 1}. ${j.title}</a>
          <div class="job-meta">
            <span class="jtag">${j.portal}</span>
            <span class="jtag">${j.loc}</span>
          </div>
        </div>
        <a href="${j.url}" target="_blank" class="open-btn">Open &#8599;</a>
      </div>
    `).join('');

    btn.disabled = false;
    document.getElementById('btnIcon').textContent = '⚡';
    document.getElementById('btnTxt').textContent = 'Analyze match';
    goTab('results', document.querySelectorAll('.tab')[1]);
  }, 700);
}

// ===== EXPORT =====
function exportReport() {
  if (!G) return;
  
  const r = `RESUMEAI — ATS ANALYSIS REPORT
Generated: ${new Date().toLocaleString()}

ATS SCORE: ${G.sc.total}/100 — ${G.gd.g}

SCORE BREAKDOWN
  Keyword match: ${G.sc.kw}%
  Experience: ${G.sc.exp}%
  Format quality: ${G.sc.fmt}%
  Education: ${G.sc.edu}%

MATCHED KEYWORDS
${G.sc.matched.join(', ') || 'None'}

MISSING KEYWORDS
${G.sc.missing.join(', ') || 'None'}

EXTRACTED PROFILE
  Name: ${G.name}
  Email: ${G.email || 'N/A'}
  Experience: ${G.yrs ? G.yrs + ' years' : 'N/A'}
  Education: ${G.edu || 'N/A'}
  Skills: ${G.rKw.join(', ')}

FEEDBACK
${G.fb.map(f => `[${f.t.toUpperCase()}] ${f.h}\n${f.m}`).join('\n\n')}

TOP JOB LINKS
${G.jobs.map((j, i) => `${i + 1}. ${j.title} (${j.portal})\n   ${j.url}`).join('\n')}`;

  const a = document.createElement('a');
  a.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(r);
  a.download = 'ATS_Report.txt';
  a.click();
}
