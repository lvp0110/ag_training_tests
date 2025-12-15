import React, { useState, useRef, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { API_ENDPOINTS } from "../config/api";
import quest1 from "../assets/quest1.png";
import quest2 from "../assets/quest2.png";
import quest3 from "../assets/quest3.png";
import quest4 from "../assets/quest4.png";
import quest5 from "../assets/quest5.png";

export default function Article() {
  const [searchParams] = useSearchParams();
  const articleCode = searchParams.get("code") || "";
  const articleId = searchParams.get("id") || "";
  const textContainerRef = useRef(null);
  const navigate = useNavigate();
  const [articleText, setArticleText] = useState("");
  const [articleTitle, setArticleTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Массив изображений для отображения
  const images = [quest1, quest2, quest3, quest4, quest5];

  // Загрузка статьи по code из API
  useEffect(() => {
    const fetchArticle = async () => {
      if (!articleCode) {
        setError("Код статьи не указан");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await fetch(API_ENDPOINTS.THEMA(articleCode), {
          method: 'GET',
          headers: {
            'accept': 'text/plain',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const text = await response.text();
        setArticleText(text);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching article:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [articleCode]);

  // Загрузка названия статьи из списка тем
  useEffect(() => {
    const fetchArticleTitle = async () => {
      if (!articleCode) return;

      try {
        const response = await fetch(API_ENDPOINTS.THEMAS, {
          method: 'GET',
          headers: {
            'accept': 'application/json',
          },
        });

        if (!response.ok) return;

        const data = await response.json();
        let articlesData = [];
        if (Array.isArray(data)) {
          articlesData = data;
        } else if (data && typeof data === "object") {
          articlesData = data.themas || data.data || data.items || data.articles || [];
        }

        const article = articlesData.find(
          (a) => (a.Code || a.code) === articleCode
        );

        if (article) {
          setArticleTitle(article.Name || article.name || article.title || article.Title || "");
        }
      } catch (err) {
        console.error('Error fetching article title:', err);
      }
    };

    fetchArticleTitle();
  }, [articleCode]);

  // Предотвращение скролла страницы при скролле внутри блока с текстом
  useEffect(() => {
    const textContainer = textContainerRef.current;
    if (!textContainer) return;

    const handleWheel = (e) => {
      const { scrollTop, scrollHeight, clientHeight } = textContainer;
      const isAtTop = scrollTop === 0;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;

      // Если скроллим вверх и уже на верху, или скроллим вниз и уже внизу - предотвращаем всплытие
      if ((e.deltaY < 0 && isAtTop) || (e.deltaY > 0 && isAtBottom)) {
        e.preventDefault();
      }
    };

    textContainer.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      textContainer.removeEventListener('wheel', handleWheel);
    };
  }, [articleText, loading, error]);


  // Функция для перехода к тестам
  const handleGoToTests = () => {
    if (articleCode) {
      navigate(`/tests?articleId=${articleCode}`);
    } else if (articleId) {
      navigate(`/tests?articleId=${articleId}`);
    }
  };

  return (
    <main style={{ position: "relative", minHeight: "100vh", display: "flex", justifyContent: "center" }}>
      <div style={{ margin: "0 auto", width: "100%" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 600, marginBottom: "2rem", color: "white" }}>
          {articleTitle || "Загрузка..."}
        </h1>

        <div
          style={{
            display: "flex",
            gap: "2rem",
            alignItems: "flex-start",
          }}
        >
          {/* Секция с текстом */}
          <div
            ref={textContainerRef}
            style={{
              flex: 1,
              borderRadius: "16px",
              padding: "2rem",
              borderWidth: 1,
              borderStyle: "solid",
              borderColor: "#e5e7eb",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              maxHeight: "70vh",
              overflowY: "auto",
              lineHeight: "1.8",
              fontSize: "1rem",
              color: "white",
              scrollBehavior: "smooth",
            }}
          >
            {loading && (
              <div style={{ textAlign: "center", padding: "2rem" }}>
                Загрузка статьи...
              </div>
            )}
            {error && (
              <div style={{ color: "#ef4444", textAlign: "center", padding: "2rem" }}>
                Ошибка загрузки статьи: {error}
              </div>
            )}
            {!loading && !error && (
              <>
                <div
                  style={{
                    whiteSpace: "pre-wrap",
                    wordWrap: "break-word",
                    textAlign: "justify",
                  }}
                >
                  {articleText}
                </div>
                <div
                  style={{
                    marginTop: "2rem",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <button
                    onClick={handleGoToTests}
                    style={{
                      padding: "0.75rem 2rem",
                      fontSize: "1rem",
                      fontWeight: 600,
                      color: "white",
                      background: "#6366f1",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#4f46e5";
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.3)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#6366f1";
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.2)";
                    }}
                  >
                    Перейти к тестам
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Секция с изображениями */}
          <div
            style={{
              width: "350px",
              flexShrink: 0,
              background: "#ffffff",
              borderRadius: "16px",
              padding: "2rem",
              borderWidth: 1,
              borderStyle: "solid",
              borderColor: "#e5e7eb",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              maxHeight: "70vh",
              overflowY: "auto", background: "none"
            }}
          >
            {/* <h2
              style={{
                fontSize: "1.25rem",
                fontWeight: 600,
                marginBottom: "1rem",
                color: "#111827",
              }}
            >
              Изображения
            </h2> */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
              }}
            >
              {images.map((image, index) => (
                <div
                  key={index}
                  style={{
                    borderRadius: "8px",
                    overflow: "hidden",
                    borderWidth: 1,
                    borderStyle: "solid",
                    borderColor: "#e5e7eb",
                  }}
                >
                  <img
                    src={image}
                    alt={`Изображение ${index + 1}`}
                    style={{
                      width: "100%",
                      height: "auto",
                      display: "block",
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

