// Real client-side PDF generation for lab reports.
//
// The exact same DOM that the on-screen A4 preview renders is rasterised with
// html2canvas and placed on an A4 jsPDF page, so the downloaded file is
// pixel-identical to the preview. Works in Chrome, Firefox, Edge, Safari and
// mobile browsers (no popup / print dialog involved).
import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import LabReportDocument from '../components/lab/LabReportDocument.jsx';

const slug = (value) =>
  String(value || 'Patient').trim().replace(/\s+/g, '_').replace(/[^A-Za-z0-9_-]/g, '') || 'Patient';

export const labReportFileName = (test = {}, patient = {}) => {
  const name = slug(test.patientName || patient.name);
  const id = slug(test.reportNo || test.id || 'REPORT').replace(/\//g, '-');
  return `Lab_Report_${name}_${id}.pdf`;
};

/** Renders a node to an A4 PDF and triggers a real file download. */
async function nodeToPdf(node, fileName) {
  const root = document.documentElement;
  const wasDark = root.classList.contains('dark');
  if (wasDark) root.classList.remove('dark');
  let canvas;
  try {
    canvas = await html2canvas(node, {
      scale: 2,
      backgroundColor: '#ffffff',
      useCORS: true,
      logging: false,
    });
  } finally {
    if (wasDark) root.classList.add('dark');
  }
  const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  const imgH = (canvas.height * pageW) / canvas.width;
  const data = canvas.toDataURL('image/jpeg', 0.95);

  if (imgH <= pageH) {
    pdf.addImage(data, 'JPEG', 0, 0, pageW, imgH);
  } else if (imgH <= pageH * 1.18) {
    // A hair over one page — shrink to fit so a single A4 sheet is produced.
    const w = (pageW * pageH) / imgH;
    pdf.addImage(data, 'JPEG', (pageW - w) / 2, 0, w, pageH);
  } else {
    // Slice tall reports across multiple A4 pages.
    let offset = 0;
    while (offset < imgH) {
      if (offset > 0) pdf.addPage();
      pdf.addImage(data, 'JPEG', 0, -offset, pageW, imgH);
      offset += pageH;
    }
  }

  pdf.save(fileName);
}

/**
 * Downloads the lab report as a PDF. Pass an existing preview element when the
 * modal is open (guarantees preview === download), otherwise the document is
 * rendered off-screen first.
 */
export async function downloadLabReportPdf({ test = {}, patient = {}, verifiedBy, element } = {}) {
  const fileName = labReportFileName(test, patient);
  if (element) {
    await nodeToPdf(element, fileName);
    return fileName;
  }

  const host = document.createElement('div');
  host.setAttribute('aria-hidden', 'true');
  host.style.cssText = 'position:fixed;left:-10000px;top:0;width:210mm;background:#fff;z-index:-1;';
  document.body.appendChild(host);
  const root = createRoot(host);
  root.render(createElement(LabReportDocument, { test, patient, verifiedBy }));
  try {
    // Let React paint and the logo image decode before rasterising.
    await new Promise((r) => setTimeout(r, 350));
    await Promise.all(
      Array.from(host.querySelectorAll('img')).map(
        (img) => img.complete || new Promise((r) => { img.onload = r; img.onerror = r; }),
      ),
    );
    const node = host.querySelector('.lab-report') || host;
    await nodeToPdf(node, fileName);
  } finally {
    root.unmount();
    host.remove();
  }
  return fileName;
}

export default downloadLabReportPdf;
