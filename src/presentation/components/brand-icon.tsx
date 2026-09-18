import Image from "next/image";
import type { CSSProperties } from "react";
import icon from "@/presentation/assets/icon.png";

export function BrandIcon({ size = 36, style }: { size?: number; style?: CSSProperties }) {
  return <Image src={icon} alt="" aria-hidden="true" width={size} height={size} style={{ flexShrink: 0, objectFit: "contain", ...style }} />;
}
