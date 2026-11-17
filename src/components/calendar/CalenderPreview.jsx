import React, { forwardRef, useRef, useEffect, useState, useCallback } from "react";

const weekdayLabels = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

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

const CalendarPreview = forwardRef(function CalendarPreview(
  { imageUrl, orientation, year, month, fullFit },
  ref
) {
  const isPortraitArt = orientation === "portrait";
  const frameW = isPortraitArt ? 170 : 119.5;
  const frameH = isPortraitArt ? 119.5 : 170;
  const weeks = buildWeeks(year, month);

  // Issue #1 対応：スマホでIKEAカレンダーの数字がセルからはみ出す問題。
  // 従来は曜日 0.42rem / 日付 0.55rem の固定フォントサイズだったため、
  // 狭い画面でカレンダー枠が ~200px まで縮むと1セル ~14px に対して文字が大きすぎた。
  // CalendarOverlay / SmartphoneCalenderOverlay と同じ方式で、実測した本体幅から
  // フォントサイズを比例計算する。デスクトップ表示では従来サイズを上限として維持する。
  const [boxW, setBoxW] = useState(640);
  const containerRef = useRef(null);
  const setRefs = useCallback(
    (el) => {
      containerRef.current = el;
      if (typeof ref === "function") ref(el);
      else if (ref) ref.current = el;
    },
    [ref]
  );
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => setBoxW(el.offsetWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // 日付グリッドは本体幅の50%（縦長・横長どちらのレイアウトでも右半分）。
  // グリッド幅 320px のとき従来サイズ（曜日 6.72px = 0.42rem、日付 8.8px = 0.55rem）と一致する比率。
  const gridW = boxW * 0.5;
  const headerFs = Math.min(6.72, gridW * 0.021);
  const dateFs = Math.min(8.8, gridW * 0.0275);

  const containerStyle = fullFit
    ? { width: "100%", height: "100%" }
    : {
        aspectRatio: `${frameW} / ${frameH}`,
        width: "100%",
        maxWidth: isPortraitArt ? "900px" : "640px",
      };

  const shadow = fullFit ? {} : { boxShadow: "0 20px 60px -20px rgba(0,0,0,0.25)", border: "1px solid #e5e5e5" };

  return (
    <div
      ref={setRefs}
      style={{ ...containerStyle, ...shadow, backgroundColor: "#fff", overflow: "hidden" }}
    >
      {isPortraitArt ? (
        <PortraitLayout imageUrl={imageUrl} month={month} weeks={weeks} headerFs={headerFs} dateFs={dateFs} />
      ) : (
        <LandscapeLayout imageUrl={imageUrl} month={month} weeks={weeks} headerFs={headerFs} dateFs={dateFs} />
      )}
    </div>
  );
});

function PortraitLayout({ imageUrl, month, weeks, headerFs, dateFs }) {
  return (
    <div style={{ width: "100%", height: "100%", display: "flex" }}>
      {/* Left: artwork */}
      <div style={{ width: "50%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: "4%" }}>
        {imageUrl ? (
          <img src={imageUrl} alt="artwork" style={{ maxWidth: "100%", maxHeight: "100%", display: "block", objectFit: "scale-down" }} />
        ) : (
          <span style={{ color: "#a3a3a3", fontSize: "0.6rem", letterSpacing: "0.2em" }}>YOUR ARTWORK</span>
        )}
      </div>

      {/* Right: calendar */}
      <div style={{ width: "50%", height: "100%", display: "flex", flexDirection: "column" }}>
        {/* Upper: month number */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontFamily: "Georgia, serif", fontSize: "4.5vw", lineHeight: 1, color: "#171717" }}>
            {month}
          </span>
        </div>
        {/* Lower: date grid */}
        <div style={{ flex: 1, padding: "0 8% 6% 4%" }}>
          <DateGrid weeks={weeks} headerFs={headerFs} dateFs={dateFs} />
        </div>
      </div>
    </div>
  );
}

function LandscapeLayout({ imageUrl, month, weeks, headerFs, dateFs }) {
  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Top: artwork */}
      <div style={{ height: "50%", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: "4%" }}>
        {imageUrl ? (
          <img src={imageUrl} alt="artwork" style={{ maxWidth: "100%", maxHeight: "100%", display: "block", objectFit: "scale-down" }} />
        ) : (
          <span style={{ color: "#a3a3a3", fontSize: "0.6rem", letterSpacing: "0.2em" }}>YOUR ARTWORK</span>
        )}
      </div>

      {/* Bottom: calendar */}
      <div style={{ height: "50%", width: "100%", display: "flex" }}>
        {/* Left: month number */}
        <div style={{ width: "50%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontFamily: "Georgia, serif", fontSize: "5.5vw", lineHeight: 1, color: "#171717" }}>
            {month}
          </span>
        </div>
        {/* Right: date grid */}
        <div style={{ width: "50%", height: "100%", padding: "4% 6% 4% 2%" }}>
          <DateGrid weeks={weeks} headerFs={headerFs} dateFs={dateFs} />
        </div>
      </div>
    </div>
  );
}

function DateGrid({ weeks, headerFs, dateFs }) {
  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Weekday labels */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", marginBottom: "3%" }}>
        {["SUN","MON","TUE","WED","THU","FRI","SAT"].map((w, i) => (
          <div key={w} style={{
            textAlign: "center",
            fontSize: `${headerFs}px`,
            fontWeight: 300,
            letterSpacing: "0.05em",
            lineHeight: 1.2,
            whiteSpace: "nowrap",
            minWidth: 0,
            overflow: "hidden",
            color: i === 0 ? "#f43f5e" : i === 6 ? "#2563eb" : "#737373",
          }}>
            {w}
          </div>
        ))}
      </div>
      {/* Date rows */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-around" }}>
        {weeks.map((week, wi) => (
          <div key={wi} style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}>
            {week.map((d, di) => (
              <div key={di} style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: `${dateFs}px`,
                fontWeight: 300,
                lineHeight: 1.2,
                whiteSpace: "nowrap",
                minWidth: 0,
                overflow: "hidden",
                color: d === null ? "transparent" : di === 0 ? "#f43f5e" : di === 6 ? "#2563eb" : "#262626",
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

export default CalendarPreview;
