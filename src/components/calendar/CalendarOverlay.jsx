import React, { useRef, useEffect, useState } from "react";

const weekdays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function buildWeeks(year, month) {
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);
  const startWeekday = firstDay.getDay();
  const daysInMonth = lastDay.getDate();
  const weeks = [];
  let current = 1 - startWeekday;
  while (current <= daysInMonth) {
    const week = [];
    for (let i = 0; i < 7; i++) {
      week.push(current >= 1 && current <= daysInMonth ? current : null);
      current++;
    }
    weeks.push(week);
  }
  return weeks;
}

/**
 * 共通カレンダーオーバーレイ
 * 
 * mode="smartphone" : 横幅100%・底部固定バー
 * mode="wide"       : 右下に浮かぶボックス（iPad / PC）
 *   widthPct, heightPct : wide モード時のボックスサイズ (%)
 */
export default function CalendarOverlay({
  year, month,
  mode = "wide",
  widthPct = 40,
  heightPct = 42,
  calPos,
  calScale = 1,
}) {
  const weeks = buildWeeks(year, month);
  const containerRef = useRef(null);
  const [boxW, setBoxW] = useState(200);

  useEffect(() => {
    const el = mode === "smartphone"
      ? containerRef.current?.parentElement
      : containerRef.current;
    if (!el) return;
    const update = () => setBoxW(el.offsetWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [mode]);

  const bottom = calPos?.bottom ?? (mode === "smartphone" ? 0 : 2.5);
  const right  = calPos?.right  ?? (mode === "smartphone" ? 0 : 2.5);

  const monthFs  = boxW * (mode === "smartphone" ? 0.045 : 0.05);
  const headerFs = boxW * (mode === "smartphone" ? 0.022 : 0.028);
  const dateFs   = boxW * (mode === "smartphone" ? 0.030 : 0.038);

  const containerStyle = mode === "smartphone"
    ? {
        position: "absolute",
        bottom: `${bottom}%`,
        right: `${right}%`,
        width: "50%",
        transform: `scale(${calScale})`,
        transformOrigin: "bottom right",
        background: "rgba(0,0,0,0.4)",
        padding: "4%",
        color: "#fff",
        boxSizing: "border-box",
      }
    : {
        position: "absolute",
        bottom: `${bottom}%`,
        right: `${right}%`,
        width: `${widthPct * calScale}%`,
        height: `${heightPct * calScale}%`,
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        padding: "3%",
        boxSizing: "border-box",
        overflow: "hidden",
      };

  return (
    <div ref={containerRef} style={containerStyle}>
      <div style={{ width: "100%" }}>
        {/* 月・年 */}
        <div style={{
          display: "flex", alignItems: "baseline", justifyContent: "center",
          gap: "0.3em", marginBottom: mode === "smartphone" ? "3%" : "4%",
          fontSize: `${monthFs}px`,
        }}>
          <span style={{ fontFamily: "Georgia, serif", fontSize: "1em", letterSpacing: "0.05em", lineHeight: 1 }}>
            {MONTH_NAMES[month - 1]}
          </span>
          <span style={{ fontSize: mode === "smartphone" ? "0.65em" : "0.6em", letterSpacing: "0.15em", opacity: 1 }}>
            {year}
          </span>
        </div>

        {/* 曜日ヘッダー */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", marginBottom: "2%", fontSize: `${headerFs}px` }}>
          {weekdays.map((w, i) => (
            <div key={w} style={{
              textAlign: "center", fontWeight: 400, letterSpacing: "0.02em", opacity: 1,
              color: i === 0 ? "#f04040" : i === 6 ? "#3366dd" : "#f5f5f5",
            }}>
              {w}
            </div>
          ))}
        </div>

        {/* 日付グリッド */}
        <div style={{ display: "flex", flexDirection: "column", gap: `${boxW * (mode === "smartphone" ? 0.012 : 0.015)}px` }}>
          {weeks.map((week, wi) => (
            <div key={wi} style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", fontSize: `${dateFs}px` }}>
              {week.map((d, di) => (
                <div key={di} style={{
                  textAlign: "center", fontWeight: 300,
                  color: d === null ? "transparent"
                    : di === 0 ? "#f04040"
                    : di === 6 ? "#3366dd"
                    : "#f5f5f5",
                }}>
                  {d ?? "0"}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}