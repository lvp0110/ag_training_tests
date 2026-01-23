import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import StarfieldBackground from "./components/StarfieldBackground";


export default function App() {
  const location = useLocation();
  const currentPath = location.pathname;
  const [isNarrowScreen, setIsNarrowScreen] = useState(false);
  const [articleImagesOpen, setArticleImagesOpen] = useState(false);
  const [isFlashActive, setIsFlashActive] = useState(false);

  const getLinkStyle = (path) => {
    const isActive = currentPath === path;
    return {
      fontSize: "1.1rem",
      fontWeight: isActive ? "600" : "400",
      color: isActive ? "#1f2937" : "#6b7280",
      cursor: "default",
      textDecoration: "none",
      padding: "8px 0",
      transition: "color 0.2s ease",
    };
  };

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(max-width: 1440px)");
    const apply = () => setIsNarrowScreen(mq.matches);
    apply();

    if (typeof mq.addEventListener === "function") {
      mq.addEventListener("change", apply);
      return () => mq.removeEventListener("change", apply);
    }
    mq.addListener(apply);
    return () => mq.removeListener(apply);
  }, []);

  useEffect(() => {
    const onState = (e) => {
      setArticleImagesOpen(Boolean(e?.detail?.open));
    };
    window.addEventListener("articleImagesState", onState);
    return () => window.removeEventListener("articleImagesState", onState);
  }, []);

  const showImagesButton = isNarrowScreen && currentPath === "/article";

  const toggleImages = () => {
    window.dispatchEvent(new Event("articleImagesToggle"));
    // Анимация смены иконки на 0.3 секунды
    setIsFlashActive(true);
    setTimeout(() => {
      setIsFlashActive(false);
    }, 300);
  };

  return (     
    <>
      <StarfieldBackground />
      <div
        style={{
          margin: "0px auto",
          fontFamily: "sans-serif",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          zIndex: 1,
        }}
      >
      <header
        style={{
          width: "100%",
          maxWidth: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 24,
          padding: "20px 16px",
          position: "sticky",
          top: 0,
          zIndex: 10,
          borderBottom: "1px solid #eee",
          backgroundColor: "#fffe",
          boxSizing: "border-box",
          overflowX: "hidden",
        }}
      >
        <div style={{ display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap", minWidth: 0 }}>
          <span style={getLinkStyle("/articles")}>
            Список статей
          </span>
          <span style={getLinkStyle("/article")}>
            Статья
          </span>
          <span style={getLinkStyle("/tests")}>
            Тест
          </span>
        </div>

        {showImagesButton && (
          <button
            type="button"
            className="article-images-toggle"
            onClick={toggleImages}
            aria-label={articleImagesOpen ? "Скрыть изображения" : "Показать изображения"}
            title={articleImagesOpen ? "Скрыть изображения" : "Показать изображения"}
          >
            {isFlashActive ? "📸" : "📷"}
          </button>
        )}
      </header>

      <main
        style={{
          flex: 1,
          alignItems: "start",
          justifyContent: "start",
          padding: "24px 16px",
        }}
      >
        <Outlet />
      </main>

      <footer
        style={{
          marginTop: "auto",
          opacity: 0.7,
          padding: "12px 16px",
          borderTop: "1px solid #eee",
        }}
      >
        <small>
          AN Game Card ©
          {new Date()
            .toLocaleDateString("ru-RU", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })
            .replace(" г.", " г.")
            .replace(/^./, (c) => c.toUpperCase())}
        </small>
      </footer>
    </div>
    </>
  );
}
