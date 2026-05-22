import Image from "next/image";

export type IconName = 
  | "money"
  | "tax-doc"
  | "bank"
  | "upload"
  | "approved"
  | "shield"
  | "house"
  | "car";

const ICON_PATHS: Record<IconName, string> = {
  money: "/icons/money.png",
  "tax-doc": "/icons/tax-doc.png",
  bank: "/icons/bank.png",
  upload: "/icons/upload.png",
  approved: "/icons/approved.png",
  shield: "/icons/shield.png",
  house: "/icons/house.png",
  car: "/icons/car.png",
};

const ICON_ALT: Record<IconName, string> = {
  money: "Εικονίδιο χρημάτων",
  "tax-doc": "Εικονίδιο φορολογικού εγγράφου",
  bank: "Εικονίδιο τράπεζας",
  upload: "Εικονίδιο μεταφόρτωσης",
  approved: "Εικονίδιο έγκρισης",
  shield: "Εικονίδιο ασφάλειας",
  house: "Εικονίδιο σπιτιού",
  car: "Εικονίδιο αυτοκινήτου",
};

interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
  alt?: string;
}

export function Icon({ name, size = 64, className = "", alt }: IconProps) {
  return (
    <Image
      src={ICON_PATHS[name]}
      alt={alt || ICON_ALT[name]}
      width={size}
      height={size}
      className={className}
      style={{ width: size, height: "auto", objectFit: "contain" }}
    />
  );
}
