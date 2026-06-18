import React, { forwardRef } from "react";

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
      ref={ref}
      style={{ ...containerStyle, ...shadow, backgroundColor: "#fff", overflow: "hidden" }}
    >
      {isPortraitArt ? (
        <PortraitLayout imageUrl={imageUrl} month={month} weeks={weeks} />
      ) : (
        <LandscapeLayout imageUrl={imageUrl} month={month} weeks={weeks} />
      )}
    </div>
  );
});

function PortraitLayout({ imageUrl, month, weeks }) {
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
          <DateGrid weeks={weeks} />
        </div>
      </div>
    </div>
  );
}

function LandscapeLayout({ imageUrl, month, weeks }) {
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
          <DateGrid weeks={weeks} />
        </div>
      </div>
    </div>
  );
}

function DateGrid({ weeks }) {
  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Weekday labels */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", marginBottom: "3%" }}>
        {["SUN","MON","TUE","WED","THU","FRI","SAT"].map((w, i) => (
          <div key={w} style={{
            textAlign: "center",
            fontSize: "0.42rem",
            fontWeight: 300,
            letterSpacing: "0.05em",
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
                fontSize: "0.55rem",
                fontWeight: 300,
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