"use client";

import { useState, useEffect, useCallback } from "react";
import { ScamReport } from "@/domain/verification";

export default function ReportsPage() {
  const [reports, setReports] = useState<ScamReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReports = useCallback(async () => {
    try {
      const res = await fetch("/api/reports");
      const data = await res.json();
      setReports(data.reports || []);
    } catch (error) {
      console.error("Failed to fetch reports:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
    const interval = setInterval(fetchReports, 3000);
    return () => clearInterval(interval);
  }, [fetchReports]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">
            Αναφορές Απάτης
          </h2>
          <p className="text-sm text-muted">
            Αναφορές από χρήστες σε πραγματικό χρόνο
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted">
          <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
          Live
        </div>
      </div>

      <div className="bg-background rounded-2xl border border-border">
        {reports.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-surface-elevated rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-8 h-8 text-muted"
              >
                <path
                  fillRule="evenodd"
                  d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08zm3.094 8.016a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <p className="text-muted">Δεν υπάρχουν αναφορές ακόμα</p>
            <p className="text-sm text-muted mt-1">
              Οι αναφορές θα εμφανιστούν εδώ σε πραγματικό χρόνο
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {reports.map((report) => (
              <div key={report.id} className="p-4 flex items-start gap-4">
                <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-5 h-5 text-secondary"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-semibold text-foreground">
                      Αναφορά κλήσης
                    </p>
                    <time className="text-xs text-muted">
                      {new Date(report.reportedAt).toLocaleString("el-GR")}
                    </time>
                  </div>
                  <p className="text-sm text-muted">
                    Αριθμός: <span className="text-foreground">{report.reportedNumber}</span>
                  </p>
                  {report.userNotes && (
                    <p className="text-sm text-muted mt-1">
                      Σημειώσεις: {report.userNotes}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
