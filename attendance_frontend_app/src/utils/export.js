/**
 * Utilities for exporting CSV and PDF and downloading files.
 */

// PUBLIC_INTERFACE
export function downloadBlob(content, filename, contentType) {
  /** Trigger download of a blob content as a file. */
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  URL.revokeObjectURL(url);
  document.body.removeChild(a);
}

// PUBLIC_INTERFACE
export function toCSV(rows, columns) {
  /** Convert array of objects to CSV string given a set of column keys. */
  const header = columns.join(",");
  const body = rows
    .map((row) =>
      columns
        .map((key) => {
          const val = row[key] != null ? String(row[key]) : "";
          // escape quotes and commas
          const escaped = `"${val.replace(/"/g, '""')}"`;
          return escaped;
        })
        .join(",")
    )
    .join("\n");
  return `${header}\n${body}`;
}

// PUBLIC_INTERFACE
export function exportCSV(rows, columns, filename = "report.csv") {
  /** Export given rows/columns to CSV and trigger download. */
  const csv = toCSV(rows, columns);
  downloadBlob(csv, filename, "text/csv;charset=utf-8;");
}

// PUBLIC_INTERFACE
export function exportPDF(htmlContent, filename = "report.pdf") {
  /**
   * Basic PDF export by opening a printable window. In production, prefer backend-rendered PDFs.
   * This utility provides a quick client-only fallback.
   */
  const printWindow = window.open("", "_blank", "width=800,height=600");
  if (!printWindow) return;
  printWindow.document.open();
  printWindow.document.write(`
    <html>
      <head><title>${filename}</title></head>
      <body>${htmlContent}</body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
  printWindow.close();
}
