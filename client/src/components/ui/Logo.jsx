import logoFull from '../../assets/medcare-logo.png';
import logoIcon from '../../assets/medcare-icon.png';

// Official MedCare brand logo. Rendered from the supplied artwork only —
// never recoloured, cropped or stretched (aspect ratio is preserved).
export default function Logo({ compact = false, className = '' }) {
  return (
    <span className={`medcare-logo inline-flex items-center ${className}`}>
      {compact ? (
        <img
          src={logoIcon}
          alt="MedCare Hospital Management"
          width={40}
          height={40}
          decoding="async"
          className="h-9 w-9 shrink-0 object-contain sm:h-10 sm:w-10"
        />
      ) : (
        <img
          src={logoFull}
          alt="MedCare Hospital Management"
          width={218}
          height={60}
          decoding="async"
          className="h-10 w-auto shrink-0 object-contain sm:h-12"
        />
      )}

    </span>
  );
}
