import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload } from "lucide-react";
import CalendarLayout from "@/components/calendar/CalendarLayout";
import WallpaperPreview from "@/components/calendar/WallpaperPreview";
import ExportButton from "@/components/calendar/ExportButton";
import TemplateSelector, { TEMPLATES, CUSTOM_ID } from "@/components/calendar/TemplateSelector";
import CustomSizePanel from "@/components/calendar/CustomSizePanel";

export default function Home() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [imageUrl, setImageUrl] = useState(null);
  const [orientation, setOrientation] = useState("portrait");
  const [templateId, setTemplateId] = useState("ikea");
  const [customSize, setCustomSize] = useState({ unit: "mm", width: 210, height: 297, aspectW: 210, aspectH: 297 });
  const fileInputRef = useRef(null);
  const layoutRef = useRef(null);
  const calendarRef = useRef(null);

  const handleFile = (file) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      setOrientation(img.naturalHeight >= img.naturalWidth ? "portrait" : "landscape");
      setImageUrl(url);
    };
    img.src = url;
  };

  const onFileChange = (e) => handleFile(e.target.files?.[0]);

  const years = [];
  for (let y = now.getFullYear() - 2; y <= now.getFullYear() + 5; y++) years.push(y);

  const activeTemplate = TEMPLATES.find((t) => t.id === templateId);
  const isCustom = templateId === CUSTOM_ID;
  const isWallpaper = activeTemplate?.type === "wallpaper";
  const effectiveAspectW = isCustom ? customSize.aspectW : activeTemplate?.aspectW;
  const effectiveAspectH = isCustom ? customSize.aspectH : activeTemplate?.aspectH;

  return (
    <div className="min-h-screen bg-[#fafaf7]">
      {/* Header */}
      <header className="border-b border-neutral-200 bg-white/70 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-8 py-6 flex items-baseline justify-between">
          <div>
            <h1 className="text-2xl font-serif tracking-tight text-neutral-900">
              Calendar Generator
            </h1>
            <p className="text-xs tracking-[0.25em] text-neutral-500 mt-1 uppercase">
              Your artwork · Your month
            </p>
          </div>
          <div className="text-xs tracking-[0.2em] text-neutral-400 uppercase hidden sm:block">
            {String(year)} / {String(month).padStart(2, "0")}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 sm:px-8 py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-10 lg:gap-16">
          {/* Controls */}
          <aside className="space-y-8">
            {/* Template */}
            <section>
              <Label className="text-[11px] tracking-[0.25em] uppercase text-neutral-500 font-light">
                Template
              </Label>
              <div className="mt-3">
                <TemplateSelector value={templateId} onChange={setTemplateId} />
                {isCustom && (
                  <CustomSizePanel value={customSize} onChange={setCustomSize} />
                )}
              </div>
            </section>

            {/* Artwork */}
            <section>
              <Label className="text-[11px] tracking-[0.25em] uppercase text-neutral-500 font-light">
                Artwork
              </Label>
              <div className="mt-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={onFileChange}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="group w-full aspect-[4/3] border border-dashed border-neutral-300 hover:border-neutral-900 transition-colors bg-white flex flex-col items-center justify-center gap-2 text-neutral-500 hover:text-neutral-900"
                >
                  {imageUrl ? (
                    <img src={imageUrl} alt="preview" className="max-w-full max-h-full object-contain p-2" />
                  ) : (
                    <>
                      <Upload className="w-5 h-5" strokeWidth={1.2} />
                      <span className="text-xs tracking-[0.2em] uppercase">Choose Image</span>
                    </>
                  )}
                </button>
                {imageUrl && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-2 text-xs text-neutral-500 hover:text-neutral-900 tracking-wider uppercase"
                  >
                    Replace image
                  </button>
                )}
              </div>
              {imageUrl && (
                <p className="mt-3 text-[11px] tracking-[0.2em] uppercase text-neutral-500">
                  Detected: {orientation === "portrait" ? "Portrait 縦長" : "Landscape 横長"}
                </p>
              )}
            </section>

            {/* Month */}
            <section>
              <Label className="text-[11px] tracking-[0.25em] uppercase text-neutral-500 font-light">
                Month
              </Label>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <Select value={String(year)} onValueChange={(v) => setYear(Number(v))}>
                  <SelectTrigger className="h-11 rounded-none border-neutral-300 bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((y) => (
                      <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={String(month)} onValueChange={(v) => setMonth(Number(v))}>
                  <SelectTrigger className="h-11 rounded-none border-neutral-300 bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                      <SelectItem key={m} value={String(m)}>{String(m).padStart(2, "0")}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </section>

            {/* Info */}
            {!isWallpaper && (
              <section className="pt-4 border-t border-neutral-200">
                <p className="text-[11px] leading-relaxed text-neutral-500 tracking-wide">
                  縦長の絵 → 枠 170 × 119.5 mm（絵: 左 / カレンダー: 右）<br />
                  横長の絵 → 枠 119.5 × 170 mm（絵: 上 / カレンダー: 下）
                </p>
              </section>
            )}
          </aside>

          {/* Preview */}
          <section className="flex flex-col items-center gap-6 min-w-0">
            <div className={isWallpaper ? "w-full" : "w-full flex justify-center"}>
              {isWallpaper ? (
                <WallpaperPreview
                  ref={layoutRef}
                  imageUrl={imageUrl}
                  orientation={orientation}
                  year={year}
                  month={month}
                  aspectW={effectiveAspectW}
                  aspectH={effectiveAspectH}
                  templateId={templateId}
                />
              ) : (
                <CalendarLayout
                  ref={layoutRef}
                  calendarRef={calendarRef}
                  imageUrl={imageUrl}
                  orientation={orientation}
                  year={year}
                  month={month}
                />
              )}
            </div>
            <ExportButton layoutRef={layoutRef} orientation={orientation} />
          </section>
        </div>
      </main>

      <footer className="max-w-6xl mx-auto px-8 py-10 text-[11px] tracking-[0.2em] uppercase text-neutral-400">
        Calendar Generator
      </footer>
    </div>
  );
}