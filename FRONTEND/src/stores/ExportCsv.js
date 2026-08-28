// /composables/useCSV.js
export function useCSV() {
  function exportToCSV(dataArray, filename = "data.csv") {
    const csvContent = dataArray
      .map((row) =>
        row
          .map((cell) => {
            let text = String(cell).replace(/"/g, '""');
            return text.includes(",") || text.includes("\n")
              ? `"${text}"`
              : text;
          })
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return { exportToCSV };
}
