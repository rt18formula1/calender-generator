import React from "react";
import { useI18n } from "@/lib/i18n";

export const CUSTOM_ID = "custom";

export const getTemplates = (t) => [
  {
    id: "ikea",
    label: t('ikeaFrame'),
    sublabel: t('ikeaSub'),
    type: "ikea",
  },
  {
    id: "smartphone",
    label: t('smartphoneWallpaper'),
    sublabel: "9:19.5 (1170×2532px)",
    aspectW: 9,
    aspectH: 19.5,
    type: "wallpaper",
  },
  {
    id: "ipad",
    label: t('ipadWallpaper'),
    sublabel: "4:3 (2732×2048px)",
    aspectW: 4,
    aspectH: 3,
    type: "wallpaper",
  },
  {
    id: "pc",
    label: t('pcWallpaper'),
    sublabel: "16:9 (1920×1080px)",
    aspectW: 16,
    aspectH: 9,
    type: "wallpaper",
  },
  {
    id: "custom",
    label: t('customSize'),
    sublabel: t('customSub'),
    type: "wallpaper",
    aspectW: 1,
    aspectH: 1,
  },
];

// Re-export TEMPLATES for other components (using default Japanese for static export)
// Ideally components should use getTemplates(t) instead.
export const TEMPLATES = [
  { id: "ikea", label: "IKEAフォトフレーム", sublabel: "170×119.5 / 119.5×170 mm", type: "ikea" },
  { id: "smartphone", label: "スマホ壁紙", sublabel: "9:19.5 (1170×2532px)", aspectW: 9, aspectH: 19.5, type: "wallpaper" },
  { id: "ipad", label: "iPad壁紙", sublabel: "4:3 (2732×2048px)", aspectW: 4, aspectH: 3, type: "wallpaper" },
  { id: "pc", label: "PC壁紙", sublabel: "16:9 (1920×1080px)", aspectW: 16, aspectH: 9, type: "wallpaper" },
  { id: "custom", label: "カスタムサイズ", sublabel: "印刷用(mm) / 画面用(px) 自由設定", type: "wallpaper", aspectW: 1, aspectH: 1 },
];

export default function TemplateSelector({ value, onChange }) {
  const { t } = useI18n();
  const templates = getTemplates(t);

  return (
    <div className="space-y-2">
      {templates.map((t) => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          className={[
            "w-full text-left px-3 py-2.5 border transition-colors",
            value === t.id
              ? "border-neutral-900 bg-neutral-50"
              : "border-neutral-200 bg-white hover:border-neutral-400",
          ].join(" ")}
        >
          <div className="text-xs tracking-[0.15em] uppercase text-neutral-800">{t.label}</div>
          <div className="text-[10px] tracking-wider text-neutral-400 mt-0.5">{t.sublabel}</div>
        </button>
      ))}
    </div>
  );
}
