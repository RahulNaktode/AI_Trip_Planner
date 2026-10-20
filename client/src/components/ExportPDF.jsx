
import React, { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import toast from "react-hot-toast";
import { FileDown, Loader2 } from "lucide-react";

function ExportPDF({ tripData }) {
  const [isExporting, setIsExporting] = useState(false);

  const handleDownload = async () => {
    if (!tripData) {
      return toast.error("Trip data missing.");
    }

    setIsExporting(true);

    try {
      const doc = new jsPDF();
      const cityName =
        tripData.destination?.split(",")[0] || "Destination";

      const days = tripData.itinerary?.days || [];

      const total = days.reduce((acc, day) => {
        return (
          acc +
          (parseFloat(day.morning?.estimatedCost) || 0) +
          (parseFloat(day.afternoon?.estimatedCost) || 0) +
          (parseFloat(day.evening?.estimatedCost) || 0)
        );
      }, 0);

      // Header
      doc.setFillColor(37, 99, 235);
      doc.rect(0, 0, 210, 15, "F");

      doc.setTextColor(20, 20, 25);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(28);
      doc.text(cityName.toUpperCase(), 15, 35);

      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text("TRIP ITINERARY", 15, 43);

      // Trip summary
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(130, 22, 65, 30, 3, 3, "F");

      doc.setFontSize(8);
      doc.setTextColor(37, 99, 235);
      doc.text("ESTIMATED ACTIVITY COST", 135, 30);

      doc.setFontSize(14);
      doc.setTextColor(20, 20, 25);
      doc.text(`$${total.toLocaleString()}`, 135, 39);

      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(
        `${tripData.inputs?.numTravelers || 1} Travelers`,
        135,
        46
      );

      // Itinerary table
      const rows = [];

      days.forEach((day, index) => {
        rows.push([
          {
            content: `DAY ${index + 1}${day.theme ? ` - ${day.theme}` : ""}`,
            colSpan: 4,
            styles: {
              fillColor: [20, 20, 25],
              textColor: [255, 255, 255],
              fontStyle: "bold",
            },
          },
        ]);

        ["morning", "afternoon", "evening"].forEach((period) => {
          const activity = day[period];

          if (activity) {
            rows.push([
              period.charAt(0).toUpperCase() + period.slice(1),
              activity.title || activity.activity || "Activity",
              activity.description || activity.location || "-",
              `$${parseFloat(activity.estimatedCost) || 0}`,
            ]);
          }
        });
      });

      autoTable(doc, {
        startY: 60,
        head: [["Time", "Activity", "Details", "Est. Cost"]],
        body: rows,
        theme: "grid",
        styles: {
          fontSize: 8,
          cellPadding: 3,
          overflow: "linebreak",
        },
        headStyles: {
          fillColor: [37, 99, 235],
          textColor: [255, 255, 255],
        },
        columnStyles: {
          0: { cellWidth: 25 },
          1: { cellWidth: 42 },
          2: { cellWidth: 95 },
          3: { cellWidth: 25 },
        },
      });

      // Footer on every page
      const pageCount = doc.internal.getNumberOfPages();

      for (let page = 1; page <= pageCount; page++) {
        doc.setPage(page);
        doc.setFontSize(8);
        doc.setTextColor(120, 120, 120);
        doc.text(
          `Wander AI | Page ${page} of ${pageCount}`,
          15,
          290
        );
      }

      doc.save(`${cityName.replace(/\s+/g, "_")}_Trip.pdf`);
      toast.success("Trip PDF downloaded!");
    } catch (error) {
      console.error("PDF export error:", error);
      toast.error("Failed to generate PDF.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={isExporting || !tripData}
      className="bg-white/10 backdrop-blur-md hover:bg-blue-600 text-white px-6 py-4 rounded-2xl flex items-center gap-3 font-black 
      text-[10px] uppercase tracking-[0.2em] transition-all border border-white/10 shadow-xl group"
    >
      {isExporting ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        <FileDown size={16} className="text-blue-400 group-hover:text-white" />
      )}
      <span>{isExporting ? "Compiling..." : "Export PDF" }</span>
    </button>
  );
}

export default ExportPDF;
