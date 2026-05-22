import { ReactNode } from "react";
import Link from "next/link";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-surface-elevated">
      <header className="bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold">Epirus Shield</h1>
              <p className="text-primary-foreground/70 text-sm">Πίνακας Διαχείρισης</p>
            </div>
            <nav className="flex gap-4">
              <Link
                href="/admin"
                className="text-sm font-medium text-primary-foreground/80 hover:text-primary-foreground transition-colors"
              >
                Επαληθευμένα
              </Link>
              <Link
                href="/admin/reports"
                className="text-sm font-medium text-primary-foreground/80 hover:text-primary-foreground transition-colors"
              >
                Αναφορές
              </Link>
              <Link
                href="/"
                className="text-sm font-medium text-primary-foreground/80 hover:text-primary-foreground transition-colors"
              >
                PWA Demo
              </Link>
            </nav>
          </div>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
}
