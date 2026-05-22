import { ReactNode } from "react";
import { CallStateProvider, ShieldOverlay } from "@/app/components/shield";

export default function BankLayout({ children }: { children: ReactNode }) {
  return (
    <CallStateProvider pollInterval={500}>
      <ShieldOverlay />
      <div className="min-h-screen bg-background pt-0">
        {children}
      </div>
    </CallStateProvider>
  );
}
