import Image, { type StaticImageData } from "next/image";
// Foto logo lomba & institusi (aset lokal, bukan remote):
// - Salinan LOGO TCC.png, Salinan LOGO TRIPLE-C.png,
// - 001_UNIVERSITAS TRUNODJOYO MADURA (1).png
import tccLogo from "@/presentation/assets/Salinan LOGO TCC.png";
import tripleCLogo from "@/presentation/assets/Salinan LOGO TRIPLE-C.png";
import utmLogo from "@/presentation/assets/001_UNIVERSITAS TRUNODJOYO MADURA (1).png";

// Satu logo murni tanpa teks — tinggi dikunci via CSS, lebar mengikuti rasio asli.
function PureLogo({ src, label }: { src: StaticImageData; label: string }) {
  return (
    <Image
      src={src}
      alt={label}
      className="public-logo-img"
      sizes="48px"
    />
  );
}

// Cluster 3 logo (TCC + Triple-C + UTM) untuk navbar — murni logo, tanpa deskripsi teks.
export function CompetitionLogos() {
  return (
    <span className="public-logos-cluster" role="group" aria-label="Logo lomba TCC, Triple-C, dan Universitas Trunojoyo Madura">
      <PureLogo src={tccLogo} label="Logo TCC" />
      <PureLogo src={tripleCLogo} label="Logo Triple-C" />
      <PureLogo src={utmLogo} label="Logo Universitas Trunojoyo Madura" />
    </span>
  );
}
