import React, { useState, useRef, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { API_ENDPOINTS } from "../config/api";
import "./Article.css";
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
  const [isNarrowScreen, setIsNarrowScreen] = useState(false);
  const [isMobileScreen, setIsMobileScreen] = useState(false);
  const [imagesOpen, setImagesOpen] = useState(false);

  // Массив изображений для отображения
  const images = [quest1, quest2, quest3, quest4, quest5];

  // Перенаправление на список статей, если код не указан
  useEffect(() => {
    if (!articleCode && !articleId) {
      navigate("/articles", { replace: true });
      return;
    }
  }, [articleCode, articleId, navigate]);

  // Адаптив: на экранах < 1440px блок изображений скрыт, но можно открыть кнопкой
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;

    const mqNarrow = window.matchMedia("(max-width: 1440px)");
    const mqMobile = window.matchMedia("(max-width: 1023px)");

    const apply = () => {
      const narrow = mqNarrow.matches;
      const mobile = mqMobile.matches;
      setIsNarrowScreen(narrow);
      setIsMobileScreen(mobile);
      setImagesOpen(!narrow); // на широких всегда показываем, на узких по умолчанию скрываем
    };

    apply();

    const cleanup = [];
    const add = (mq) => {
      if (typeof mq.addEventListener === "function") {
        mq.addEventListener("change", apply);
        cleanup.push(() => mq.removeEventListener("change", apply));
      } else {
        // Safari fallback
        mq.addListener(apply);
        cleanup.push(() => mq.removeListener(apply));
      }
    };

    add(mqNarrow);
    add(mqMobile);

    return () => cleanup.forEach((fn) => fn());
  }, []);

  // Управление из глобального header (App.jsx)
  useEffect(() => {
    const onToggle = () => {
      if (!isNarrowScreen) return;
      setImagesOpen((v) => !v);
    };

    window.addEventListener("articleImagesToggle", onToggle);
    return () => window.removeEventListener("articleImagesToggle", onToggle);
  }, [isNarrowScreen]);

  // Сообщаем header текущее состояние (для иконки)
  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("articleImagesState", { detail: { open: imagesOpen } })
    );
  }, [imagesOpen]);

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
    <main className="article-main-container">
      <div className="article-wrapper">
        <h1 className="article-title">
          {articleTitle || "Загрузка..."}
        </h1>

        <div
          className={isNarrowScreen && !imagesOpen ? "article-layout article-layout--no-gap" : "article-layout"}
        >
          {/* Секция с текстом */}
          {(!isMobileScreen || !imagesOpen) && (
            <div
              ref={textContainerRef}
              className="article-text-container"
            >
              {loading && (
                <div className="article-loading">
                  Загрузка статьи...
                </div>
              )}
              {error && (
                <div className="article-error">
                  Ошибка загрузки статьи: {error}
                </div>
              )}
              {!loading && !error && (
                <>
                  <div className="article-back-button-container">
                    <button
                      onClick={() => navigate("/articles")}
                      className="article-back-button"
                    >
                      ← Вернуться к списку статей
                    </button>
                  </div>
                  <div className="article-content">
                    {articleText}
                  </div>
                  <div className="article-tests-button-container">
                    <button
                      onClick={handleGoToTests}
                      className="article-tests-button"
                    >
                      Перейти к тестам
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Секция с изображениями */}
          <div
            id="article-images-panel"
            className={`article-images${isNarrowScreen && imagesOpen ? " is-open" : ""}`}
          >
            <div className="article-images-container">
              {images.map((image, index) => (
                <div
                  key={index}
                  className="article-image-wrapper"
                >
                  <img
                    src={image}
                    alt={`Изображение ${index + 1}`}
                    className="article-image"
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

