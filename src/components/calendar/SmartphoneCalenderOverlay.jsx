import React, { useRef, useEffect, useState } from "react";

const weekdays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

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

const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export default function SmartphoneCalendarOverlay({ year, month, calPos, calScale = 1 }) {
  const weeks = buildWeeks(year, month);
  const containerRef = useRef(null);
  const [w, setW] = useState(200);

  useEffect(() => {
    const el = containerRef.current?.parentElement;
    if (!el) return;
    const update = () => setW(el.offsetWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // コンテナ幅に比例したフォントサイズ
  const monthFs = w * 0.045;
  const headerFs = w * 0.022;
  const dateFs = w * 0.030;

  const bottom = calPos ? calPos.bottom : 0;
  const right = calPos ? calPos.right : 0;

  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        bottom: `${bottom}%`,
        right: `${right}%`,
        width: "100%",
        transform: `scale(${calScale})`,
        transformOrigin: "bottom right",
        background: "rgba(0,0,0,0.45)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        padding: "5% 6% 7%",
        color: "#fff",
        boxSizing: "border-box",
      }}
    >
      {/* 月・年 */}
      <div style={{
        display: "flex", alignItems: "baseline", justifyContent: "center",
        gap: "0.3em", marginBottom: "3%", fontSize: `${monthFs}px`,
      }}>
        <span style={{ fontFamily: "Georgia, serif", fontSize: "1em", letterSpacing: "0.05em", lineHeight: 1 }}>
          {MONTH_NAMES[month - 1]}
        </span>
        <span style={{ fontSize: "0.65em", letterSpacing: "0.15em", opacity: 0.7 }}>
          {year}
        </span>
      </div>

      {/* 曜日ヘッダー */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", marginBottom: "2%", fontSize: `${headerFs}px` }}>
        {weekdays.map((w, i) => (
          <div key={w} style={{
            textAlign: "center", fontWeight: 400, letterSpacing: "0.02em", opacity: 0.65,
            color: i === 0 ? "#fca5a5" : i === 6 ? "#93c5fd" : "#fff",
          }}>
            {w}
          </div>
        ))}
      </div>

      {/* 日付グリッド */}
      <div style={{ display: "flex", flexDirection: "column", gap: `${w * 0.012}px` }}>
        {weeks.map((week, wi) => (
          <div key={wi} style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", fontSize: `${dateFs}px` }}>
            {week.map((d, di) => (
              <div key={di} style={{
                textAlign: "center", fontWeight: 300,
                color: d === null ? "transparent"
                  : di === 0 ? "#fca5a5"
                  : di === 6 ? "#93c5fd"
                  : "#fff",
              }}>
                {d ?? "0"}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}