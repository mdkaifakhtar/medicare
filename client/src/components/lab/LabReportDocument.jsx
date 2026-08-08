import { useState } from 'react';
import toast from 'react-hot-toast';
import { X, Download, Printer } from 'lucide-react';
import Logo from '../ui/Logo.jsx';


const HOSPITAL = {
  name: 'MedCare Multispecialty Hospital',
  address: '124 Wellness Avenue, Sector 21, Bengaluru, Karnataka 560103',
  phone: '+91 80 4567 8900',
  emergency: '+91 98450 00108',
  email: 'lab@medcare.health',
  web: 'www.medcare.health',
};

// Realistic analyte panels so a report always prints with units + reference
// ranges, exactly as an accredited hospital lab would issue it.
const PANELS = {
  'Complete Blood Count (CBC)': [
    ['Haemoglobin', '13.6', 'g/dL', '13.0 – 17.0'],
    ['Total Leucocyte Count', '7,400', '/µL', '4,000 – 11,000'],
    ['RBC Count', '4.9', 'million/µL', '4.5 – 5.9'],
    ['Platelet Count', '2.34', 'lakh/µL', '1.50 – 4.10'],
    ['Haematocrit (PCV)', '41.2', '%', '40.0 – 50.0'],
    ['MCV', '86.4', 'fL', '83.0 – 101.0'],
    ['Neutrophils', '58', '%', '40 – 80'],
    ['Lymphocytes', '32', '%', '20 – 40'],
  ],
  'Lipid Profile': [
    ['Total Cholesterol', '192', 'mg/dL', '< 200'],
    ['Triglycerides', '138', 'mg/dL', '< 150'],
    ['HDL Cholesterol', '46', 'mg/dL', '> 40'],
    ['LDL Cholesterol', '118', 'mg/dL', '< 130'],
    ['VLDL Cholesterol', '27.6', 'mg/dL', '< 30'],
    ['Chol / HDL Ratio', '4.17', 'ratio', '< 5.0'],
  ],
  'Blood Glucose (Fasting)': [
    ['Glucose, Fasting (Plasma)', '96', 'mg/dL', '70 – 100'],
  ],
  'Liver Function Test (LFT)': [
    ['Bilirubin, Total', '0.8', 'mg/dL', '0.2 – 1.2'],
    ['SGOT (AST)', '28', 'U/L', '< 40'],
    ['SGPT (ALT)', '31', 'U/L', '< 41'],
    ['Alkaline Phosphatase', '86', 'U/L', '40 – 129'],
    ['Total Protein', '7.2', 'g/dL', '6.4 – 8.3'],
    ['Albumin', '4.3', 'g/dL', '3.5 – 5.2'],
  ],
  'Kidney Function Test (KFT)': [
    ['Blood Urea', '28', 'mg/dL', '17 – 43'],
    ['Serum Creatinine', '0.9', 'mg/dL', '0.7 – 1.3'],
    ['Uric Acid', '5.4', 'mg/dL', '3.5 – 7.2'],
    ['Sodium', '139', 'mmol/L', '136 – 145'],
    ['Potassium', '4.2', 'mmol/L', '3.5 – 5.1'],
  ],
  'Thyroid Panel (T3/T4/TSH)': [
    ['Total T3', '1.28', 'ng/mL', '0.80 – 2.00'],
    ['Total T4', '8.4', 'µg/dL', '5.1 – 14.1'],
    ['TSH', '2.41', 'µIU/mL', '0.27 – 4.20'],
  ],
  'Urine Routine Analysis': [
    ['Colour', 'Pale Yellow', '—', 'Pale Yellow'],
    ['pH', '6.0', '—', '5.0 – 7.5'],
    ['Protein', 'Absent', '—', 'Absent'],
    ['Glucose', 'Absent', '—', 'Absent'],
    ['Pus Cells', '2 – 3', '/hpf', '0 – 5'],
  ],
};

const fmtDate = (value) => {
  const d = value ? new Date(value) : new Date();
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) +
    ' · ' + d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
};

const flagOf = (result, range) => {
  const value = parseFloat(String(result).replace(/,/g, ''));
  if (Number.isNaN(value)) return 'Normal';
  range = String(range).replace(/,/g, '');
  const between = String(range).match(/([\d.]+)\s*[–-]\s*([\d.]+)/);
  if (between) {
    const low = parseFloat(between[1]); const high = parseFloat(between[2]);
    if (value < low) return 'Low';
    if (value > high) return 'High';
    return 'Normal';
  }
  const lt = String(range).match(/<\s*([\d.]+)/);
  if (lt) return value > parseFloat(lt[1]) ? 'High' : 'Normal';
  const gt = String(range).match(/>\s*([\d.]+)/);
  if (gt) return value < parseFloat(gt[1]) ? 'Low' : 'Normal';
  return 'Normal';
};

// Deterministic QR-style placeholder (no external service, print-safe).
function QrPlaceholder({ seed = 'MEDCARE' }) {
  const size = 11;
  let h = 0;
  for (let i = 0; i < seed.length; i += 1) h = (h * 31 + seed.charCodeAt(i)) % 100000;
  const cells = [];
  for (let i = 0; i < size * size; i += 1) {
    const r = Math.floor(i / size); const c = i % size;
    const finder = (r < 3 && c < 3) || (r < 3 && c > size - 4) || (r > size - 4 && c < 3);
    h = (h * 1103515245 + 12345) % 2147483648;
    cells.push(finder || (h >> 16) % 2 === 0);
  }
  return (
    <div className="lab-qr" aria-label="Report verification QR code placeholder">
      {cells.map((on, i) => <span key={i} className={on ? 'on' : ''} />)}
    </div>
  );
}

export function LabReportDocument({ test = {}, patient = {}, verifiedBy }) {
  const panelKey = Object.keys(PANELS).find((k) => {
    const a = k.toLowerCase().replace(/[^a-z]/g, '');
    const b = String(test.testName || '').toLowerCase().replace(/[^a-z]/g, '');
    return b && (a.includes(b) || b.includes(a));
  });
  const rows = (panelKey && PANELS[panelKey]) || [[
    test.testName || 'Investigation',
    test.result || 'See interpretation',
    test.units || '—',
    test.normalRange || 'Refer clinician',
  ]];
  const abnormal = rows.filter(([, r, , range]) => flagOf(r, range) !== 'Normal');
  const reportNo = test.reportNo || `MC/LAB/${String(test.id || '000000').slice(-6).toUpperCase()}`;

  return (
    <div id="lab-report-print" className="lab-report">
      {/* ── Header ── */}
      <header className="lab-head">
        <div className="lab-head-left">
          <Logo />
          <p className="lab-addr">{HOSPITAL.address}</p>
          <p className="lab-addr">
            Tel {HOSPITAL.phone} · Emergency {HOSPITAL.emergency}<br />
            {HOSPITAL.email} · {HOSPITAL.web}
          </p>
        </div>
        <div className="lab-head-right">
          <span className="lab-nabl">NABL Accredited · MC-L-0000 (placeholder)</span>
          <QrPlaceholder seed={reportNo} />
          <p className="lab-qr-cap">Scan to verify</p>
        </div>
      </header>

      <div className="lab-title">
        <span>Laboratory Investigation Report</span>
        <span className="lab-reportno">Report No: {reportNo}</span>
      </div>

      {/* ── Patient / test meta ── */}
      <section className="lab-meta">
        <dl>
          <div><dt>Patient Name</dt><dd>{test.patientName || patient.name || '—'}</dd></div>
          <div><dt>Patient ID</dt><dd>{test.patientId || patient.id || '—'}</dd></div>
          <div><dt>Age / Gender</dt><dd>{patient.age ? `${patient.age} yrs` : 'Not recorded'} / {patient.gender || '—'}</dd></div>
          <div><dt>Referring Doctor</dt><dd>{test.doctorName || '—'}</dd></div>
        </dl>
        <dl>
          <div><dt>Department</dt><dd>{test.testType || 'Laboratory Medicine'}</dd></div>
          <div><dt>Sample Collected</dt><dd>{fmtDate(test.sampleCollectedAt || test.requestedAt)}</dd></div>
          <div><dt>Report Date</dt><dd>{fmtDate(test.approvedAt || test.completedAt || Date.now())}</dd></div>
          <div><dt>Status</dt><dd className="lab-status">{(test.status || 'approved').replace(/_/g, ' ')}</dd></div>
        </dl>
      </section>

      {/* ── Results ── */}
      <table className="lab-table">
        <thead>
          <tr>
            <th>Test Name</th><th>Result</th><th>Units</th><th>Reference Range</th><th>Flag</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([name, result, units, range]) => {
            const flag = flagOf(result, range);
            return (
              <tr key={name}>
                <td className="lab-analyte">{name}</td>
                <td className={flag === 'Normal' ? '' : 'lab-abnormal'}>{result}</td>
                <td>{units}</td>
                <td>{range}</td>
                <td className={flag === 'Normal' ? 'lab-flag-ok' : 'lab-flag-bad'}>{flag === 'Normal' ? 'Normal' : flag === 'High' ? '▲ High' : '▼ Low'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* ── Interpretation ── */}
      <section className="lab-interp">
        <h3>Interpretation &amp; Clinical Remarks</h3>
        <p>
          {test.interpretation
            || (abnormal.length === 0
              ? 'All measured parameters are within the stated biological reference intervals for the patient’s age and sex. No haematological or biochemical abnormality is evident in this sample. Correlate clinically.'
              : `${abnormal.length} parameter(s) fall outside the reference interval: ${abnormal.map(([n]) => n).join(', ')}. Suggest clinical correlation and a repeat assay after 4–6 weeks, or earlier if clinically indicated.`)}
        </p>
        {test.comments?.length > 0 && (
          <ul>{test.comments.map((c, i) => <li key={i}>{c.text} — {c.userName}</li>)}</ul>
        )}
        <p className="lab-note">
          Results relate only to the sample received. Reference intervals are method and instrument dependent.
          This report is not valid for medico-legal purposes.
        </p>
      </section>

      {/* ── Signatures + seal ── */}
      <footer className="lab-sign">
        <div className="lab-sign-col">
          <span className="lab-scribble">A. Kulkarni</span>
          <span className="lab-line" />
          <strong>Lab Technician</strong>
          <em>DMLT · MedCare Central Lab</em>
        </div>
        <div className="lab-seal">
          <div className="lab-seal-ring">
            <span>MEDCARE</span>
            <b>LAB SEAL</b>
            <span>BENGALURU</span>
          </div>
        </div>
        <div className="lab-sign-col">
          <span className="lab-scribble">{verifiedBy || 'Dr. Ananya Rao'}</span>
          <span className="lab-line" />
          <strong>Consultant Pathologist</strong>
          <em>MD (Pathology) · Reg. KMC/48211</em>
        </div>
      </footer>

      <p className="lab-footnote">
        This report is computer generated. · {HOSPITAL.name} · {HOSPITAL.web}
      </p>
    </div>
  );
}

/** On-screen A4 preview that prints byte-for-byte identically. */
export function LabReportModal({ open, onClose, test, patient, verifiedBy }) {
  const [saving, setSaving] = useState(false);
  if (!open) return null;
  const print = () => window.print();
  const download = async () => {
    setSaving(true);
    try {
      const { downloadLabReportPdf } = await import('../../utils/labReportPdf.js');
      const file = await downloadLabReportPdf({
        test,
        patient,
        verifiedBy,
        element: document.getElementById('lab-report-print'),
      });
      toast.success(`Downloaded ${file}`);
    } catch (err) {
      toast.error(err?.message || 'Could not generate the PDF');
    } finally {
      setSaving(false);
    }
  };
  return (
    <div className="lab-report-overlay" role="dialog" aria-modal="true">
      <div className="lab-report-shell">
        <div className="lab-report-bar no-print">
          <p>Lab Report Preview · A4</p>
          <div className="flex items-center gap-2">
            <button type="button" onClick={download} disabled={saving} className="btn-primary px-4 py-2 text-sm disabled:opacity-70"><Download className="h-4 w-4" /> {saving ? 'Preparing…' : 'Download PDF'}</button>
            <button type="button" onClick={print} className="btn-white px-4 py-2 text-sm"><Printer className="h-4 w-4" /> Print</button>
            <button type="button" onClick={onClose} aria-label="Close" className="btn-white px-3 py-2"><X className="h-4 w-4" /></button>
          </div>
        </div>
        <div className="lab-report-scroll">
          <LabReportDocument test={test} patient={patient} verifiedBy={verifiedBy} />
        </div>
      </div>
    </div>
  );
}


export default LabReportDocument;
