import React, { forwardRef, useState, useRef, useCallback } from "react";
import CalendarOverlay from "./CalendarOverlay";
import { ZoomIn, ZoomOut } from "lucide-react";

const arrowBtn = {
  padding: "4px 10px", border: "1px solid #ccc", background: "#fff",
  cursor: "pointer", borderRadius: 4, fontSize: 12,
};

const WallpaperPreview = forwardRef(function WallpaperPreview(
  { imageUrl, orientation, year, month, aspectW, aspectH, templateId },
  ref
) {
  const isSmartphone = templateId === "smartphone";
  const isIpad = templateId === "ipad";
  const isPc = templateId === "pc";

  const [scale, setScale] = useState(1);
  // pos: background-position の % 値 (0〜100)
  const [pos, setPos] = useState({ x: 50, y: 50 });
  // calPos: カレンダーオーバーレイの bottom/right オフセット (%)
  const [calPos, setCalPos] = useState({ bottom: 2.5, right: 2.5 });
  // calScale: カレンダーサイズ倍率
  const [calScale, setCalScale] = useState(1);
  // dragMode: "image" | "calendar"
  const [dragMode, setDragMode] = useState("image");
  const dragModeRef = useRef("image");
  dragModeRef.current = dragMode;
  const calPosRef = useRef({ bottom: 2.5, right: 2.5 });
  calPosRef.current = calPos;

  const dragging = useRef(false);
  const lastMouse = useRef(null);
  const containerRef = useRef(null);
  const scaleRef = useRef(1);
  const posRef = useRef({ x: 50, y: 50 });
  scaleRef.current = scale;
  posRef.current = pos;

  // background-position の % は特殊な意味を持つため px ベースで管理する方が確実。
  // ここでは background-size = scale*100% (cover相当) として、
  // background-position を % で指定する。
  // ただし黒空白を防ぐため 0〜100% にclampするだけでOK。
  const clampPos = (x, y) => ({
    x: Math.max(0, Math.min(100, x)),
    y: Math.max(0, Math.min(100, y)),
  });

  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    dragging.current = true;
    lastMouse.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!dragging.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const rawDx = (e.clientX - lastMouse.current.x) / rect.width * 100;
    const rawDy = (e.clientY - lastMouse.current.y) / rect.height * 100;
    lastMouse.current = { x: e.clientX, y: e.clientY };

    if (dragModeRef.current === "calendar") {
      // カレンダーは right/bottom なので符号を逆に
      setCalPos(p => ({
        right: Math.max(-50, Math.min(80, p.right - rawDx)),
        bottom: Math.max(-50, Math.min(80, p.bottom - rawDy)),
      }));
    } else {
      const factor = 100 / scaleRef.current;
      const dx = rawDx * factor / 100 * 100;
      const dy = rawDy * factor / 100 * 100;
      setPos(prev => clampPos(prev.x + dx, prev.y + dy));
    }
  }, []);

  const handleMouseUp = useCallback(() => { dragging.current = false; }, []);

  const handleWheel = useCallback((e) => {
    e.preventDefault();
    setScale(prev => Math.max(1, Math.min(4, prev - e.deltaY * 0.001)));
  }, []);

  const STEP = 3;
  const move = useCallback((dx, dy) => {
    const factor = 100 / scaleRef.current;
    setPos(p => clampPos(p.x + dx * factor / 10, p.y + dy * factor / 10));
  }, []);

  const CAL_STEP = 1;
  const moveCalendar = useCallback((dx, dy) => {
    setCalPos(p => ({
      right: Math.max(-50, Math.min(80, p.right - dx * CAL_STEP)),
      bottom: Math.max(-50, Math.min(80, p.bottom - dy * CAL_STEP)),
    }));
  }, []);

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <div
        ref={(el) => {
          containerRef.current = el;
          if (typeof ref === "function") ref(el);
          else if (ref) ref.current = el;
        }}
        style={{
          aspectRatio: `${aspectW} / ${aspectH}`,
          width: "100%",
          position: "relative",
          overflow: "hidden",
          backgroundColor: "#1a1a1a",
          cursor: imageUrl ? (dragMode === "calendar" ? "crosshair" : "grab") : "default",
          userSelect: "none",
          backgroundImage: imageUrl ? `url(${imageUrl})` : "none",
          backgroundSize: scale === 1 ? "cover" : `${scale * 100}%`,
          backgroundPosition: `${pos.x}% ${pos.y}%`,
          backgroundRepeat: "no-repeat",
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        {!imageUrl && <div style={{ position: "absolute", inset: 0, background: "#2a2a2a" }} />}

        {isSmartphone && <CalendarOverlay year={year} month={month} mode="smartphone" calPos={calPos} calScale={calScale} />}
        {isIpad && <CalendarOverlay year={year} month={month} mode="wide" widthPct={40} heightPct={42} calPos={calPos} calScale={calScale} />}
        {isPc && <CalendarOverlay year={year} month={month} mode="wide" widthPct={24} heightPct={33} calPos={calPos} calScale={calScale} />}
      </div>

      {imageUrl && (
        <>
          {/* ドラッグモード切替 */}
          <div style={{ display: "flex", gap: 6, marginTop: 8, marginBottom: 4 }}>
            <button
              onClick={() => setDragMode("image")}
              style={{ ...arrowBtn, background: dragMode === "image" ? "#333" : "#fff", color: dragMode === "image" ? "#fff" : "#333", fontSize: 11 }}>
              画像ドラッグ
            </button>
            <button
              onClick={() => setDragMode("calendar")}
              style={{ ...arrowBtn, background: dragMode === "calendar" ? "#333" : "#fff", color: dragMode === "calendar" ? "#fff" : "#333", fontSize: 11 }}>
              カレンダードラッグ
            </button>
          </div>

          {/* 画像ズーム */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 10, color: "#888", minWidth: 44 }}>画像</span>
            <button onClick={() => setScale(s => Math.max(1, +(s - 0.1).toFixed(2)))}
              style={{ padding: "4px 8px", border: "1px solid #ccc", background: "#fff", cursor: "pointer", borderRadius: 4 }}>
              <ZoomOut size={14} />
            </button>
            <input type="range" min={1} max={4} step={0.01} value={scale}
              onChange={e => setScale(Number(e.target.value))}
              style={{ flex: 1 }} />
            <button onClick={() => setScale(s => Math.min(4, +(s + 0.1).toFixed(2)))}
              style={{ padding: "4px 8px", border: "1px solid #ccc", background: "#fff", cursor: "pointer", borderRadius: 4 }}>
              <ZoomIn size={14} />
            </button>
            <span style={{ fontSize: 11, color: "#888", minWidth: 36 }}>{Math.round(scale * 100)}%</span>
            <button onClick={() => { setScale(1); setPos({ x: 50, y: 50 }); }}
              style={{ padding: "4px 8px", border: "1px solid #ccc", background: "#fff", cursor: "pointer", borderRadius: 4, fontSize: 11 }}>
              Reset
            </button>
          </div>

          {/* カレンダーズーム */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
            <span style={{ fontSize: 10, color: "#888", minWidth: 44 }}>カレンダー</span>
            <button onClick={() => setCalScale(s => Math.max(0.3, +(s - 0.05).toFixed(2)))}
              style={{ padding: "4px 8px", border: "1px solid #ccc", background: "#fff", cursor: "pointer", borderRadius: 4 }}>
              <ZoomOut size={14} />
            </button>
            <input type="range" min={0.3} max={2.5} step={0.01} value={calScale}
              onChange={e => setCalScale(Number(e.target.value))}
              style={{ flex: 1 }} />
            <button onClick={() => setCalScale(s => Math.min(2.5, +(s + 0.05).toFixed(2)))}
              style={{ padding: "4px 8px", border: "1px solid #ccc", background: "#fff", cursor: "pointer", borderRadius: 4 }}>
              <ZoomIn size={14} />
            </button>
            <span style={{ fontSize: 11, color: "#888", minWidth: 36 }}>{Math.round(calScale * 100)}%</span>
            <button onClick={() => { setCalScale(1); setCalPos({ bottom: 2.5, right: 2.5 }); }}
              style={{ padding: "4px 8px", border: "1px solid #ccc", background: "#fff", cursor: "pointer", borderRadius: 4, fontSize: 11 }}>
              Reset
            </button>
          </div>

          <div style={{ display: "flex", gap: 24, marginTop: 6, justifyContent: "center" }}>
            {/* 画像移動 */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
              <div style={{ fontSize: 10, color: "#888", marginBottom: 2, letterSpacing: "0.1em" }}>画像</div>
              <button onClick={() => move(0, -STEP)} style={arrowBtn}>▲</button>
              <div style={{ display: "flex", gap: 2 }}>
                <button onClick={() => move(-STEP, 0)} style={arrowBtn}>◀</button>
                <div style={{ width: 28 }} />
                <button onClick={() => move(STEP, 0)} style={arrowBtn}>▶</button>
              </div>
              <button onClick={() => move(0, STEP)} style={arrowBtn}>▼</button>
            </div>

            {/* カレンダー移動 */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
              <div style={{ fontSize: 10, color: "#888", marginBottom: 2, letterSpacing: "0.1em" }}>カレンダー</div>
              <button onClick={() => moveCalendar(0, -CAL_STEP)} style={arrowBtn}>▲</button>
              <div style={{ display: "flex", gap: 2 }}>
                <button onClick={() => moveCalendar(-CAL_STEP, 0)} style={arrowBtn}>◀</button>
                <button onClick={() => setCalPos({ bottom: 2.5, right: 2.5 })} style={{ ...arrowBtn, fontSize: 10, padding: "4px 6px" }}>⌂</button>
                <button onClick={() => moveCalendar(CAL_STEP, 0)} style={arrowBtn}>▶</button>
              </div>
              <button onClick={() => moveCalendar(0, CAL_STEP)} style={arrowBtn}>▼</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
});

export default WallpaperPreview;