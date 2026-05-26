import puppeteer from 'puppeteer';
import type { GeneratedPaper } from '@vedaai/shared-types';

export async function generatePDF(paper: GeneratedPaper): Promise<Buffer> {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  const html = buildPaperHTML(paper);

  await page.setContent(html, { waitUntil: 'networkidle0' });

  const pdf = await page.pdf({
    format: 'A4',
    margin: { top: '20mm', right: '15mm', bottom: '20mm', left: '15mm' },
    printBackground: true,
  });

  await browser.close();
  return Buffer.from(pdf);
}

function buildPaperHTML(paper: GeneratedPaper): string {
  return `<!DOCTYPE html>
<html>
<head>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
  body { font-family: 'Inter', 'Times New Roman', serif; font-size: 12pt; margin: 0; padding: 20px; color: #1a1a1a; }
  .header { text-align: center; margin-bottom: 20px; }
  .school-name { font-size: 18pt; font-weight: 700; margin-bottom: 4px; }
  .subject-line { font-size: 13pt; margin-bottom: 2px; }
  .meta-row { display: flex; justify-content: space-between; font-size: 11pt; margin: 12px 0; padding: 8px 0; border-top: 1px solid #ddd; border-bottom: 1px solid #ddd; }
  .general-instruction { font-size: 10pt; margin-bottom: 12px; color: #444; }
  .student-info { border: 1px solid #333; padding: 10px 14px; margin: 16px 0; }
  .info-line { margin: 6px 0; font-size: 11pt; }
  .info-line span { border-bottom: 1px solid #333; display: inline-block; min-width: 160px; margin-left: 4px; }
  .section-title { font-size: 14pt; font-weight: 700; text-align: center; text-decoration: underline; margin: 28px 0 8px; }
  .section-subtitle { font-size: 12pt; font-weight: 600; margin-bottom: 4px; }
  .instruction { font-style: italic; font-size: 10pt; color: #555; margin-bottom: 14px; }
  .question { margin-bottom: 12px; display: flex; gap: 8px; page-break-inside: avoid; }
  .q-num { min-width: 28px; font-weight: 600; }
  .q-text { flex: 1; line-height: 1.6; }
  .q-meta { font-size: 9pt; color: #666; white-space: nowrap; }
  .difficulty-easy { color: #16a34a; }
  .difficulty-moderate { color: #d97706; }
  .difficulty-hard { color: #dc2626; }
  .section-end { text-align: center; font-size: 10pt; margin: 16px 0; font-weight: 500; }
  .answer-key { page-break-before: always; }
  .answer-key .question { margin-bottom: 8px; }
  hr { border: none; border-top: 1px solid #ccc; margin: 16px 0; }
</style>
</head>
<body>
  <div class="header">
    <div class="school-name">${escapeHtml(paper.schoolName)}</div>
    <div class="subject-line">Subject: ${escapeHtml(paper.subject)} &nbsp;|&nbsp; Class: ${escapeHtml(paper.className)}</div>
  </div>
  <div class="meta-row">
    <span>Time Allowed: ${paper.timeAllowed} minutes</span>
    <span>Maximum Marks: ${paper.totalMarks}</span>
  </div>
  <div class="general-instruction">All questions are compulsory unless stated otherwise.</div>
  <div class="student-info">
    <div class="info-line">Name: <span></span></div>
    <div class="info-line">Roll Number: <span></span></div>
    <div class="info-line">Class: <span style="min-width:80px"></span> &nbsp; Section: <span style="min-width:80px"></span></div>
  </div>
  ${paper.sections
    .map(
      (section) => `
    <div class="section-title">Section ${escapeHtml(section.label)}</div>
    <div class="section-subtitle">${escapeHtml(section.title)}</div>
    <div class="instruction">${escapeHtml(section.instruction)}</div>
    ${section.questions
      .map(
        (q, i) => `
      <div class="question">
        <span class="q-num">${i + 1}.</span>
        <span class="q-text">${escapeHtml(q.text)}</span>
        <span class="q-meta difficulty-${q.difficulty}">[${capitalize(q.difficulty)}] [${q.marks} Mark${q.marks > 1 ? 's' : ''}]</span>
      </div>
    `
      )
      .join('')}
    <div class="section-end">*** End of Section ${escapeHtml(section.label)} ***</div>
  `
    )
    .join('')}
  <div class="answer-key">
    <div class="section-title">Answer Key</div>
    <hr/>
    ${paper.answerKey
      .map(
        (a, i) => `
      <div class="question">
        <span class="q-num">${a.questionId}.</span>
        <span class="q-text">${escapeHtml(a.answer)}</span>
      </div>
    `
      )
      .join('')}
  </div>
</body>
</html>`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
