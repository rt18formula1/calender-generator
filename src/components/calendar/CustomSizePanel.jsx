import React, { useState } from "react";

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

/**
 * CustomSizePanel
 * Emits: onChange({ aspectW, aspectH, unit: "mm"|"px", width, height })
 */
export default function CustomSizePanel({ value, onChange }) {
  const [unit, setUnit] = useState(value?.unit || "mm");
  const [w, setW] = useState(value?.width || (unit === "mm" ? 210 : 1920));
  const [h, setH] = useState(value?.height || (unit === "mm" ? 297 : 1080));

  const handleUnitChange = (u) => {
    setUnit(u);
    // デフォルトサイズをリセット
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
      {/* 用途タブ */}
      <div style={{ display: "flex", gap: 0, marginBottom: 10 }}>
        <button style={tabBtn(unit === "mm")} onClick={() => handleUnitChange("mm")}>
          印刷用 (mm)
        </button>
        <button style={tabBtn(unit === "px")} onClick={() => handleUnitChange("px")}>
          画面用 (px)
        </button>
      </div>

      {/* サイズ入力 */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ fontSize: 10, color: "#888" }}>W</span>
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
          <span style={{ fontSize: 10, color: "#888" }}>H</span>
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

      {/* プリセット */}
      <div style={{ marginTop: 8, display: "flex", gap: 4, flexWrap: "wrap" }}>
        {unit === "mm" ? (
          <>
            {[["A4 縦", 210, 297], ["A4 横", 297, 210], ["A3 縦", 297, 420], ["正方形", 200, 200]].map(([l, pw, ph]) => (
              <button key={l} onClick={() => { setW(pw); setH(ph); emit(unit, pw, ph); }}
                style={{ fontSize: 10, padding: "3px 7px", border: "1px solid #ddd", background: "#fafafa", cursor: "pointer", borderRadius: 3 }}>
                {l}
              </button>
            ))}
          </>
        ) : (
          <>
            {[["FHD", 1920, 1080], ["4K", 3840, 2160], ["スマホ", 1170, 2532], ["iPad", 2048, 2732]].map(([l, pw, ph]) => (
              <button key={l} onClick={() => { setW(pw); setH(ph); emit(unit, pw, ph); }}
                style={{ fontSize: 10, padding: "3px 7px", border: "1px solid #ddd", background: "#fafafa", cursor: "pointer", borderRadius: 3 }}>
                {l}
              </button>
            ))}
          </>
        )}
      </div>

      <div style={{ marginTop: 8, fontSize: 10, color: "#aaa" }}>
        アスペクト比: {w} : {h}
        {unit === "mm" && <span style={{ marginLeft: 8 }}>（印刷用・CMYK推奨）</span>}
        {unit === "px" && <span style={{ marginLeft: 8 }}>（画面用・RGB）</span>}
      </div>
    </div>
  );
}