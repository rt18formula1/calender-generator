import React, { forwardRef } from "react";
import CalendarPreview from "./CalenderPreview";

const CalendarLayout = forwardRef(function CalendarLayout(
  { calendarRef, imageUrl, orientation, year, month },
  ref
) {
  const isPortraitArt = orientation === "portrait";

  // A4比率 (landscape A4 = 297:210, portrait A4 = 210:297)
  const a4W = isPortraitArt ? 297 : 210;
  const a4H = isPortraitArt ? 210 : 297;

  // 外枠比率 (縦長アート→250:200, 横長→200:250)
  const outerW = isPortraitArt ? 250 : 200;
  const outerH = isPortraitArt ? 200 : 250;

  // カレンダー枠比率 (縦長→170:119.5, 横長→119.5:170)
  const calW = isPortraitArt ? 170 : 119.5;
  const calH = isPortraitArt ? 119.5 : 170;

  return (
    <div
      ref={ref}
      className="relative bg-white"
      style={{
        aspectRatio: `${a4W} / ${a4H}`,
        width: "100%",
      }}
    >
      {/* A4枠（外周ボーダー） */}
      <div className="absolute inset-0 border border-neutral-300 pointer-events-none" />

      {/* 外枠（中央配置） */}
      <div
        className="absolute border border-neutral-300"
        style={{
          left: `${((a4W - outerW) / 2 / a4W) * 100}%`,
          top: `${((a4H - outerH) / 2 / a4H) * 100}%`,
          width: `${(outerW / a4W) * 100}%`,
          height: `${(outerH / a4H) * 100}%`,
        }}
      >
        {/* カレンダー枠（外枠内中央配置） */}
        <div
          className="absolute border border-neutral-200"
          style={{
            left: `${((outerW - calW) / 2 / outerW) * 100}%`,
            top: `${((outerH - calH) / 2 / outerH) * 100}%`,
            width: `${(calW / outerW) * 100}%`,
            height: `${(calH / outerH) * 100}%`,
          }}
        >
          {/* カレンダー本体 */}
          <CalendarPreview
            ref={calendarRef}
            imageUrl={imageUrl}
            orientation={orientation}
            year={year}
            month={month}
            // CalendarPreview自身のborderやshadowは内部で持つが、ここではサイズを外から制御
            fullFit
          />
        </div>
      </div>
    </div>
  );
});

export default CalendarLayout;
