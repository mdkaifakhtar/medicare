// Real client-side PDF generation for hospital documents (invoices,
// prescriptions and other printable records). The header always carries the
// official MedCare logo artwork, matching the on-screen branding.
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import logoFull from '../assets/medcare-logo.png';

const HOSPITAL = {
  name: 'MedCare Multispecialty Hospital',
  address: '124 Wellness Avenue, Sector 21, Bengaluru, Karnataka 560103',
  contact: 'Tel +91 80 4567 8900 · care@medcare.health · www.medcare.health',
};

const esc = (value) =>
  String(value ?? '—').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const slug = (value, fallback = 'Document') =>
  String(value || fallback).trim().replace(/\s+/g, '_').replace(/[^A-Za-z0-9_-]/g, '') || fallback;

export const documentFileName = (prefix, name, id) =>
  `${prefix}_${slug(name, 'Patient')}_${slug(id, 'RECORD')}.pdf`;

/**
 * Renders a branded A4 document off-screen and downloads it as a real PDF file.
 * `meta` is a list of [label, value] pairs, `rows` a list of table rows and
 * `columns` the matching header labels.
 */
export async function downloadDocumentPdf({
  title = 'Hospital Document',
  reference = '',
  meta = [],
  columns = [],
  rows = [],
  totals = [],
  note = '',
  signature = 'Authorised Signatory',
  fileName = 'MedCare_Document.pdf',
} = {}) {
  const host = document.createElement('div');
  host.setAttribute('aria-hidden', 'true');
  host.style.cssText = 'position:fixed;left:-10000px;top:0;width:210mm;background:#fff;z-index:-1;';
  host.innerHTML = `
    <div style="width:210mm;min-height:297mm;padding:14mm;box-sizing:border-box;font-family:Inter,Arial,sans-serif;color:#0F241C;background:#fff;">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;border-bottom:2px solid #12603F;padding-bottom:10px;">
        <div>
          <img src="${logoFull}" alt="MedCare Hospital Management" style="height:44px;width:auto;display:block;" />
          <p style="margin:8px 0 0;font-size:10.5px;color:#25382F;">${esc(HOSPITAL.address)}</p>
          <p style="margin:2px 0 0;font-size:10.5px;color:#25382F;">${esc(HOSPITAL.contact)}</p>
        </div>
        <div style="text-align:right;font-size:10.5px;color:#25382F;">
          <p style="margin:0;font-weight:700;color:#12603F;">${esc(HOSPITAL.name)}</p>
          ${reference ? `<p style="margin:4px 0 0;">Ref: <b>${esc(reference)}</b></p>` : ''}
          <p style="margin:2px 0 0;">${esc(new Date().toLocaleString('en-IN'))}</p>
        </div>
      </div>

      <div style="margin-top:14px;background:#12603F;color:#fff;padding:8px 12px;border-radius:6px;font-size:12px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;">
        ${esc(title)}
      </div>

      <table style="width:100%;margin-top:16px;border-collapse:collapse;font-size:12px;">
        ${meta
          .map(
            ([label, value]) =>
              `<tr><td style="padding:6px 0;width:34%;color:#20342B;text-transform:uppercase;font-size:10px;font-weight:700;letter-spacing:.04em;">${esc(label)}</td><td style="padding:6px 0;font-weight:700;font-size:12.5px;color:#0F241C;">${esc(value)}</td></tr>`,
          )
          .join('')}
      </table>

      ${columns.length
        ? `<table style="width:100%;margin-top:18px;border-collapse:collapse;font-size:12px;">
            <thead><tr>${columns
              .map(
                (c) =>
                  `<th style="text-align:left;background:#DDEDE3;color:#0F241C;padding:8px 9px;border:1px solid #B9D3C4;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;">${esc(c)}</th>`,
              )
              .join('')}</tr></thead>
            <tbody>${rows
              .map(
                (r) =>
                  `<tr>${r
                    .map((cell) => `<td style="padding:8px 9px;border:1px solid #CFE0D6;color:#0F241C;font-weight:600;">${esc(cell)}</td>`)
                    .join('')}</tr>`,
              )
              .join('')}</tbody>
          </table>`
        : ''}

      ${totals.length
        ? `<table style="margin-top:12px;margin-left:auto;font-size:12px;border-collapse:collapse;">${totals
            .map(
              ([label, value]) =>
                `<tr><td style="padding:5px 14px 5px 0;color:#20342B;font-weight:600;">${esc(label)}</td><td style="padding:5px 0;font-weight:700;text-align:right;color:#0F241C;">${esc(value)}</td></tr>`,
            )
            .join('')}</table>`
        : ''}

      ${note ? `<p style="margin-top:18px;font-size:11px;color:#20342B;line-height:1.6;">${esc(note)}</p>` : ''}

      <div style="margin-top:38px;display:flex;justify-content:flex-end;">
        <div style="text-align:center;">
          <div style="width:170px;border-top:1px solid #0F241C;padding-top:6px;font-size:11.5px;font-weight:700;color:#0F241C;">${esc(signature)}</div>
        </div>
      </div>

      <p style="margin-top:26px;text-align:center;font-size:10px;color:#3B4F45;">
        This document is computer generated. · ${esc(HOSPITAL.name)}
      </p>
    </div>`;
  document.body.appendChild(host);

  // Documents are always printed on white paper: temporarily leave dark mode so
  // the theme's dark-mode text colours never leak into the rasterised PDF.
  const root = document.documentElement;
  const wasDark = root.classList.contains('dark');
  if (wasDark) root.classList.remove('dark');

  try {
    await Promise.all(
      Array.from(host.querySelectorAll('img')).map(
        (img) => img.complete || new Promise((r) => { img.onload = r; img.onerror = r; }),
      ),
    );
    const canvas = await html2canvas(host.firstElementChild, {
      scale: 2,
      backgroundColor: '#ffffff',
      useCORS: true,
      logging: false,
    });
    const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();
    const imgH = (canvas.height * pageW) / canvas.width;
    const data = canvas.toDataURL('image/jpeg', 0.95);
    if (imgH <= pageH * 1.02) {
      pdf.addImage(data, 'JPEG', 0, 0, pageW, Math.min(imgH, pageH));
    } else {
      let offset = 0;
      while (offset < imgH) {
        if (offset > 0) pdf.addPage();
        pdf.addImage(data, 'JPEG', 0, -offset, pageW, imgH);
        offset += pageH;
      }
    }
    pdf.save(fileName);
  } finally {
    if (wasDark) root.classList.add('dark');
    host.remove();
  }
  return fileName;
}

export default downloadDocumentPdf;
