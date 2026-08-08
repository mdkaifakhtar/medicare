import PageHero from '../../components/public/PageHero.jsx';

export default function Terms() {
  return (
    <div>
      <PageHero title="Terms of Service" subtitle="The terms and conditions governing your use of MedCare Hospital services and platforms." />
      <section className="section py-16">
        <div className="mx-auto max-w-3xl space-y-8 text-neutral-600">
          {[
            { h: 'Acceptance of Terms', p: 'By accessing our website or using our services, you agree to these terms. If you do not agree, please discontinue use of our services.' },
            { h: 'Medical Disclaimer', p: 'Information provided on this website is for general health awareness only and is not a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider.' },
            { h: 'Appointments & Cancellations', p: 'Appointments can be rescheduled or cancelled up to 4 hours before the scheduled time. Late cancellations may incur a fee. Walk-in patients are accommodated based on availability.' },
            { h: 'Payment Terms', p: 'All fees are payable at the time of service unless covered by insurance. Approved insurance claims are settled directly with the provider. Co-pays and non-covered charges are payable by the patient.' },
            { h: 'Patient Responsibilities', p: 'Patients must provide accurate information, follow treatment plans, respect hospital staff and other patients, and adhere to hospital policies including visiting hours and no-smoking rules.' },
            { h: 'Limitation of Liability', p: 'MedCare is not liable for indirect or consequential damages arising from website use. Medical liability is governed by applicable healthcare laws and professional standards.' },
          ].map((s) => (
            <div key={s.h}>
              <h2 className="font-display text-xl font-bold text-neutral-900">{s.h}</h2>
              <p className="mt-2 text-sm leading-relaxed">{s.p}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
