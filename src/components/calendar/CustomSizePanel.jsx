import React, { useState } from "react";
import { useI18n } from "@/lib/i18n";

const tabBtn = (active) => ({
  padding: "5px 14px",
  border: "1px solid",
  borderColor: active ? "#333" : "#ccc",
  background: active ? "#333" : "#fff",
  color: active ? "#fff" : "#555",
  cursor: "pointer",
  fontSize: 11,
  letterSpacing: "0.1em",
});

const numInput = {
  width: "70px",
  padding: "4px 6px",
  border: "1px solid #ccc",
  borderRadius: 3,
  fontSize: 12,
  textAlign: "right",
};

export default function CustomSizePanel({ value, onChange }) {
  const { t } = useI18n();
  const [unit, setUnit] = useState(value?.unit || "mm");
  const [w, setW] = useState(value?.width || (unit === "mm" ? 210 : 1920));
  const [h, setH] = useState(value?.height || (unit === "mm" ? 297 : 1080));

  const handleUnitChange = (u) => {
    setUnit(u);
    const dw = u === "mm" ? 210 : 1920;
    const dh = u === "mm" ? 297 : 1080;
    setW(dw);
    setH(dh);
    emit(u, dw, dh);
  };

  const emit = (u, ww, hh) => {
    const nw = Number(ww) || 1;
    const nh = Number(hh) || 1;
    onChange({ unit: u, width: nw, height: nh, aspectW: nw, aspectH: nh });
  };

  const handleW = (v) => { setW(v); emit(unit, v, h); };
  const handleH = (v) => { setH(v); emit(unit, w, v); };

  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ display: "flex", gap: 0, marginBottom: 10 }}>
        <button style={tabBtn(unit === "mm")} onClick={() => handleUnitChange("mm")}>
          {t('printUse')}
        </button>
        <button style={tabBtn(unit === "px")} onClick={() => handleUnitChange("px")}>
          {t('screenUse')}
        </button>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ fontSize: 10, color: "#888" }}>{t('width')}</span>
          <input
            type="number"
            min={1}
            value={w}
            onChange={(e) => handleW(e.target.value)}
            style={numInput}
          />
        </div>
        <span style={{ fontSize: 12, color: "#aaa" }}>×</span>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ fontSize: 10, color: "#888" }}>{t('height')}</span>
          <input
            type="number"
            min={1}
            value={h}
            onChange={(e) => handleH(e.target.value)}
            style={numInput}
          />
        </div>
        <span style={{ fontSize: 10, color: "#aaa" }}>{unit}</span>
      </div>

      <div style={{ marginTop: 8, display: "flex", gap: 4, flexWrap: "wrap" }}>
        {unit === "mm" ? (
          <>
            {[[t('a4Portrait'), 210, 297], [t('a4Landscape'), 297, 210], [t('a3Portrait'), 297, 420], [t('square'), 200, 200]].map(([l, pw, ph]) => (
              <button key={l} onClick={() => { setW(pw); setH(ph); emit(unit, pw, ph); }}
                style={{ fontSize: 10, padding: "3px 7px", border: "1px solid #ddd", background: "#fafafa", cursor: "pointer", borderRadius: 3 }}>
                {l}
              </button>
            ))}
          </>
        ) : (
          <>
            {[[t('fhd'), 1920, 1080], [t('k4'), 3840, 2160], [t('mobile'), 1170, 2532], [t('ipad'), 2048, 2732]].map(([l, pw, ph]) => (
              <button key={l} onClick={() => { setW(pw); setH(ph); emit(unit, pw, ph); }}
                style={{ fontSize: 10, padding: "3px 7px", border: "1px solid #ddd", background: "#fafafa", cursor: "pointer", borderRadius: 3 }}>
                {l}
              </button>
            ))}
          </>
        )}
      </div>

      <div style={{ marginTop: 8, fontSize: 10, color: "#aaa" }}>
        {t('aspectRatio')}: {w} : {h}
        {unit === "mm" && <span style={{ marginLeft: 8 }}>{t('cmykNotice')}</span>}
        {unit === "px" && <span style={{ marginLeft: 8 }}>{t('rgbNotice')}</span>}
      </div>
    </div>
  );
}
