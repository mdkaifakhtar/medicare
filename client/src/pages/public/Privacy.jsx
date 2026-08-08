import PageHero from '../../components/public/PageHero.jsx';

export default function Privacy() {
  return (
    <div>
      <PageHero title="Privacy Policy" subtitle="Your privacy is sacred. Here's how we protect and handle your personal health information." />
      <section className="section py-16">
        <div className="mx-auto max-w-3xl space-y-8 text-neutral-600">
          {[
            { h: 'Information We Collect', p: 'We collect personal and health information you provide during registration, appointments, and treatment. This includes name, contact details, medical history, insurance information, and diagnostic reports.' },
            { h: 'How We Use Your Information', p: 'Your information is used to provide medical care, process billing and insurance claims, send appointment reminders, and improve our services. We never sell your data to third parties.' },
            { h: 'Data Security', p: 'All patient data is encrypted at rest and in transit. Access is restricted to authorized healthcare providers involved in your care. We comply with the Digital Personal Data Protection Act and international healthcare data standards.' },
            { h: 'Your Rights', p: 'You have the right to access, correct, or request deletion of your personal data. You can also withdraw consent for data processing at any time, subject to legal record-keeping requirements.' },
            { h: 'Cookies & Tracking', p: 'Our website uses essential cookies for functionality and anonymous analytics to improve user experience. We do not use tracking cookies for advertising.' },
            { h: 'Contact', p: 'For privacy concerns, contact our Data Protection Officer at privacy@medcare.health or call +91 80 4000 8000.' },
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
