import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import html2canvas from "html2canvas";

export default function ExportButton({ layoutRef, orientation }) {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    if (!layoutRef?.current) return;
    setLoading(true);

    // A4全体のDOMをそのままキャプチャ → PNG出力
    const canvas = await html2canvas(layoutRef.current, {
      scale: 4,
      useCORS: true,
      backgroundColor: "#ffffff",
    });

    const link = document.createElement("a");
    link.download = "calendar.png";
    link.href = canvas.toDataURL("image/png");
    link.click();

    setLoading(false);
  };

  return (
    <Button
      onClick={handleExport}
      disabled={loading}
      variant="outline"
      className="rounded-none border-neutral-300 h-11 tracking-[0.15em] uppercase text-xs"
    >
      <Download className="w-4 h-4 mr-2" strokeWidth={1.4} />
      {loading ? "出力中..." : "PNG 出力"}
    </Button>
  );
}