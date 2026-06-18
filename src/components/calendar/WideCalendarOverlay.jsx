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

/**
 * iPad: 右下 50% × 50% の領域 → widthPct=50, heightPct=50
 * PC:   右下 30% × 40% の領域 → widthPct=30, heightPct=40
 */
export default function WideCalendarOverlay({ year, month, widthPct, heightPct, calPos }) {
  const bottom = calPos ? calPos.bottom : 2.5;
  const right = calPos ? calPos.right : 2.5;
  const weeks = buildWeeks(year, month);
  const containerRef = useRef(null);
  const [boxW, setBoxW] = useState(300);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => setBoxW(el.offsetWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const monthFs = boxW * 0.05;
  const headerFs = boxW * 0.028;
  const dateFs = boxW * 0.038;

  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        bottom: `${bottom}%`,
        right: `${right}%`,
        width: `${widthPct}%`,
        height: `${heightPct}%`,
        background: "radial-gradient(ellipse at bottom right, rgba(0,0,0,0.30) 0%, rgba(0,0,0,0.20) 30%, rgba(0,0,0,0.10) 60%, rgba(0,0,0,0.03) 80%, rgba(0,0,0,0) 100%)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        padding: "3%",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      <div style={{ width: "100%" }}>
        {/* 月・年 */}
        <div style={{
          display: "flex", alignItems: "baseline", justifyContent: "center",
          gap: "0.3em", marginBottom: "4%", fontSize: `${monthFs}px`,
        }}>
          <span style={{ fontFamily: "Georgia, serif", fontSize: "1em", letterSpacing: "0.05em", lineHeight: 1 }}>
            {MONTH_NAMES[month - 1]}
          </span>
          <span style={{ fontSize: "0.6em", letterSpacing: "0.15em", opacity: 0.7 }}>
            {year}
          </span>
        </div>

        {/* 曜日ヘッダー */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(7, 1fr)",
          marginBottom: "2%", fontSize: `${headerFs}px`,
        }}>
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
        <div style={{ display: "flex", flexDirection: "column", gap: `${boxW * 0.015}px` }}>
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
    </div>
  );
}