import { useEffect, useLayoutEffect, useRef, useState } from "react";
import img1 from "../assets/plan1.png";
import img2 from "../assets/plan2.png";
import img3 from "../assets/plan3.png";

// API для загрузки списка
const API_URL = "/api/v1/AllIsolationConstr";

// ============================
// ХУК: useDraggableOverlay
// ============================
function useDraggableOverlay({ containerRef, initial = { x: 12, y: 12 } }) {
  const overlayRef = useRef(null);
  const [pos, _setPos] = useState(initial);

  const sizesRef = useRef({ containerW: 0, containerH: 0, overlayW: 0, overlayH: 0 });

  const clamp = (x, y) => {
    const { containerW, containerH, overlayW, overlayH } = sizesRef.current;
    const maxX = Math.max(0, containerW - overlayW);
    const maxY = Math.max(0, containerH - overlayH);
    return { x: Math.min(Math.max(0, x), maxX), y: Math.min(Math.max(0, y), maxY) };
  };

  const setPosition = (x, y) => {
    _setPos(() => clamp(x, y));
  };

  const measure = () => {
    const cont = containerRef.current;
    const ov = overlayRef.current;
    if (!cont || !ov) return;
    const contRect = cont.getBoundingClientRect();
    const ovRect = ov.getBoundingClientRect();
    sizesRef.current = {
      containerW: contRect.width,
      containerH: contRect.height,
      overlayW: ovRect.width,
      overlayH: ovRect.height,
    };
    _setPos((p) => clamp(p.x, p.y));
  };

  useLayoutEffect(() => {
    measure();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const cont = containerRef.current;
    const ov = overlayRef.current;
    if (!cont || !ov) return;
    const roCont = new ResizeObserver(measure);
    const roOv = new ResizeObserver(measure);
    roCont.observe(cont);
    roOv.observe(ov);
    window.addEventListener("resize", measure);
    return () => {
      roCont.disconnect();
      roOv.disconnect();
      window.removeEventListener("resize", measure);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startDrag = (downEvent) => {
    const target = downEvent.target;
    if (target && target.closest && target.closest("button")) return;

    const cont = containerRef.current;
    if (!cont) return;

    const isTouch = downEvent.type === "touchstart";
    const getPoint = (e) =>
      isTouch
        ? { x: e.touches[0].clientX, y: e.touches[0].clientY }
        : { x: e.clientX, y: e.clientY };

    const contRect = cont.getBoundingClientRect();
    const p0 = getPoint(downEvent);
    const offsetX = p0.x - contRect.left - pos.x;
    const offsetY = p0.y - contRect.top - pos.y;

    const onMove = (e) => {
      const { x, y } = getPoint(e);
      const contNow = containerRef.current?.getBoundingClientRect();
      if (!contNow) return;
      const nx = x - contNow.left - offsetX;
      const ny = y - contNow.top - offsetY;
      _setPos(clamp(nx, ny));
      e.preventDefault?.();
    };

    const stop = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", stop);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", stop);
      window.removeEventListener("touchcancel", stop);
      document.body.style.userSelect = "";
    };

    document.body.style.userSelect = "none";
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", stop);
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("touchend", stop);
    window.addEventListener("touchcancel", stop);
  };

  const bind = {
    onMouseDown: (e) => startDrag(e),
    onTouchStart: (e) => startDrag(e),
  };

  return { pos, setPosition, overlayRef, bind };
}

// ============================
// КОМПОНЕНТ: Solution
// ============================
const images = [
  { src: img1, alt: "- стена монолитная 200 мм, стены пеноблок 200 мм, перекрытие монолитная ж/б плита 200 мм " },
  { src: img2, alt: "- несущая кирпичная стена 380 мм, каркасная деревянная стена со штукатуркой на дранке, перекрытие монлитная ж/б плита по профнастилу и металлическим балкам 140 мм" },
  { src: img3, alt: "- фасадная ж/б панель 200 мм, стены ж/б панель 180 мм, перекрытие пустотная ж/б плита 220 мм" },
];

export default function Solution() {
  const [index, setIndex] = useState(0);
  const [imgWidth, setImgWidth] = useState(0);

  // Состояние для select
  const [names, setNames] = useState([]);        // массив строк
  const [selected, setSelected] = useState("");  // выбранное значение
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  const containerRef = useRef(null);
  const imgRef = useRef(null);

  const LINE_HEIGHT = 20;
  const LINES = 2;
  const PANEL_HEIGHT = LINE_HEIGHT * LINES;

  const next = () => setIndex((i) => (i + 1) % images.length);
  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);

  // Загрузка данных для select (используем Name, fallback: name)
  const fetchNames = async () => {
    try {
      if (abortRef.current) abortRef.current.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setLoading(true);
      setError(null);

      const res = await fetch(API_URL, { signal: controller.signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();

      let list = [];
      if (Array.isArray(json)) list = json;
      else if (Array.isArray(json?.data)) list = json.data;
      else if (Array.isArray(json?.items)) list = json.items;

      const newNames = list
        .map((it) => (typeof it === "string" ? it : (it?.Name ?? it?.name)))
        .filter(Boolean);

      setNames(newNames);
      setSelected((prev) => (prev && newNames.includes(prev) ? prev : ""));
    } catch (e) {
      if (e?.name !== "AbortError") {
        setError(e?.message || "Ошибка загрузки");
        setNames([]);
        setSelected("");
      }
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const handleMove = (dir) => {
    console.log("move:", dir);
    fetchNames(); // по кликам на кнопки подгружаем данные для select
  };

  useEffect(() => {
    if (!imgRef.current) return;
    const update = () => setImgWidth(imgRef.current?.clientWidth || 0);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(imgRef.current);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  // Хук для блока-джойстика (4 направления)
  const { pos: b1Pos, overlayRef: block1Ref, bind: drag1 } = useDraggableOverlay({
    containerRef,
    initial: { x: 24, y: 555 },
  });

  // Хук для второго блока (вверх/вниз)
  const { pos: b2Pos, overlayRef: block2Ref, bind: drag2 } = useDraggableOverlay({
    containerRef,
    initial: { x: 900, y: 132 },
  });

  // Стили для общих панелей
  const panelBase = {
    position: "absolute",
    zIndex: 4,
    padding: 8,
    borderRadius: 8,
    background: "none",
    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
    backdropFilter: "blur(4px)",
  };

  // Размеры кнопок джойстика
  const BTN = 40; // px
  const GAP = 6; // px

  const joystickGrid = {
    display: "grid",
    gridTemplateColumns: `repeat(3, ${BTN}px)`,
    gridTemplateRows: `repeat(3, ${BTN}px)`,
    gap: GAP,
    alignItems: "center",
    justifyItems: "center",
    cursor: "default",
  };

  const btnStyle = { height: BTN, width: BTN, borderRadius: 6, cursor: "pointer" };
  const hatStyle = {
    height: BTN,
    width: BTN,
    borderRadius: 9999,
    background: "rgba(0,0,0,0.08)",
    border: "1px solid rgba(0,0,0,0.15)",
    boxShadow: "inset 0 2px 4px rgba(0,0,0,0.12)",
    cursor: "move",
  };

  return (
    <div style={{ display: "inline-block" }}>
      {/* Контейнер изображения с оверлеями */}
      <div ref={containerRef} style={{ position: "relative", display: "inline-block", lineHeight: 0 }}>
        {/* Заголовок поверх изображения */}
        <h2
          style={{
            position: "absolute",
            zIndex: 3,
            top: 12,
            left: 12,
            margin: 0,
            padding: "0.5rem 0.75rem",
            color: "#fff",
            textShadow: "0 2px 8px rgba(0,0,0,0.6)",
            fontWeight: 300,
            pointerEvents: "none",
          }}
        >
          Решение
        </h2>

        {/* Select сверху над всеми блоками */}
        <div
          style={{
            position: "absolute",
            zIndex: 6,
            top: 12,
            right: 12,
            maxWidth: "min(50vw, 420px)",
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "rgba(255,255,255,0.92)",
            padding: "8px 10px",
            borderRadius: 8,
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          }}
        >
          <label htmlFor="constr-select" style={{ whiteSpace: "nowrap", fontWeight: 600 }}>
            Конструкция:
          </label>
          <select
            id="constr-select"
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            disabled={loading || names.length === 0}
            style={{ minWidth: 240, maxWidth: 360 }}
            aria-live="polite"
          >
            <option value="" disabled>
              {loading ? "Загрузка…" : names.length ? "Выберите значение" : "Нет данных"}
            </option>
            {names.map((n, i) => (
              <option key={`${n}-${i}`} value={n}>
                {n}
              </option>
            ))}
          </select>
          {error && (
            <span role="alert" style={{ fontSize: 12, color: "#b00020" }}>
              {error}
            </span>
          )}
        </div>

        {/* Изображение */}
        <img
          ref={imgRef}
          src={images[index].src}
          alt={images[index].alt}
          width={1400}
          height={900}
          onLoad={() => setImgWidth(imgRef.current?.clientWidth || 0)}
          style={{ userSelect: "none", display: "block", maxWidth: "100%", height: "auto", cursor: "default", border: "1px solid white" }}
        />

        {/* Блок 1: Джойстик (4 направления) */}
        <div
          ref={block1Ref}
          role="group"
          aria-label="Джойстик: четыре направления"
          {...drag1}
          style={{ ...panelBase, left: b1Pos.x, top: b1Pos.y }}
        >
          <div style={joystickGrid}>
            <div />
            <button type="button" onClick={() => handleMove("up")} aria-label="Вверх" style={btnStyle}>
              ↑
            </button>
            <div />
            <button type="button" onClick={() => handleMove("left")} aria-label="Влево" style={btnStyle}>
              ←
            </button>
            <div aria-label="Перетаскивание панели" title="Перетащите панель" style={hatStyle} />
            <button type="button" onClick={() => handleMove("right")} aria-label="Вправо" style={btnStyle}>
              →
            </button>
            <div />
            <button type="button" onClick={() => handleMove("down")} aria-label="Вниз" style={btnStyle}>
              ↓
            </button>
            <div />
          </div>
        </div>

        {/* Блок 2: вверх/вниз */}
        <div
          ref={block2Ref}
          role="group"
          aria-label="Перемещение: вверх/вниз"
          {...drag2}
          style={{ ...panelBase, left: b2Pos.x, top: b2Pos.y, display: "flex", gap: 8 }}
        >
          <button type="button" onClick={() => handleMove("up")} aria-label="Вверх" style={{ ...btnStyle }}>
            ↑
          </button>
          <button type="button" onClick={() => handleMove("down")} aria-label="Вниз" style={{ ...btnStyle }}>
            ↓
          </button>
        </div>
      </div>

      {/* Панель под изображением */}
      <div style={{ marginTop: 8, width: imgWidth || undefined, display: "flex", alignItems: "center", overflow: "hidden" }}>
        <button type="button" onClick={prev} aria-label="Предыдущее изображение" style={{ display: "inline-block", transform: "scaleX(-1)", height: 40, borderRadius: "5px" }}>
          ▷▷
        </button>
        <button type="button" onClick={next} aria-label="Следующее изображение" style={{ marginLeft: 8, height: 40, borderRadius: "5px" }}>
          ▷▷
        </button>
        <div style={{ marginTop: 8, width: imgWidth || undefined, display: "flex", alignItems: "center", height: PANEL_HEIGHT, boxSizing: "border-box", overflow: "hidden" }}>
          <span
            aria-live="polite"
            title={images[index].alt}
            style={{ marginLeft: 12, flex: 1, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: LINES, WebkitBoxOrient: "vertical", lineHeight: `${LINE_HEIGHT}px`, maxHeight: PANEL_HEIGHT, fontFamily: "monospace", fontSize: "16px" }}
          >
            {images[index].alt}
          </span>
        </div>
      </div>
    </div>
  );
}
