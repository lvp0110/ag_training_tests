import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_ENDPOINTS } from "../config/api";

export default function ArticlesList() {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(API_ENDPOINTS.THEMAS, {
          method: 'GET',
          headers: {
            'accept': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Проверяем структуру данных
        let articlesData = [];
        if (Array.isArray(data)) {
          articlesData = data;
        } else if (data && typeof data === "object") {
          // Пытаемся найти массив статей в объекте
          articlesData = data.themas || data.data || data.items || data.articles || [];
        }
        // Делаем все статьи активными при получении из API
        const articlesWithActive = articlesData.map(article => ({
          ...article,
          active: true
        }));
        setArticles(articlesWithActive);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching articles:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const handleArticleClick = (articleCode, isActive) => {
    // Все статьи активны после загрузки из API, поэтому просто проверяем наличие code
    if (articleCode) {
      navigate(`/article?code=${articleCode}`);
    }
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 800,
        margin: "0 auto",
      }}
    >
      <h1
        style={{
          fontSize: "2rem",
          fontWeight: 600,
          marginBottom: "2rem",
          color: "white",
        }}
      >
        Список статей
      </h1>

      {loading && (
        <div style={{ color: "white", textAlign: "center", padding: "2rem" }}>
          Загрузка статей...
        </div>
      )}

      {error && (
        <div style={{ color: "#ef4444", textAlign: "center", padding: "2rem" }}>
          Ошибка загрузки статей: {error}
        </div>
      )}

      {!loading && !error && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          {articles.map((article, index) => (
          <div
            key={article.Code || article.code || article.id || article._id || index}
            onClick={() => handleArticleClick(article.Code || article.code, article.active)}
            style={{
              borderRadius: "12px",
              padding: "1.5rem",
              borderWidth: 1,
              borderStyle: "solid",
              borderColor: article.active ? "#e5e7eb" : "#9ca3af",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              cursor: article.active ? "pointer" : "not-allowed",
              transition: "all 0.2s ease",
              opacity: article.active ? 1 : 0.5,
            }}
            onMouseEnter={(e) => {
              if (article.active) {
                e.currentTarget.style.borderColor = "#3b82f6";
                e.currentTarget.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }
            }}
            onMouseLeave={(e) => {
              if (article.active) {
                e.currentTarget.style.borderColor = "#e5e7eb";
                e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
                e.currentTarget.style.transform = "translateY(0)";
              }
            }}
          >
            <h2
              style={{
                fontSize: "1.25rem",
                fontWeight: 600,
                marginBottom: "0.5rem",
              }}
            >
              {article.Name || article.name || article.title || article.Title || "Без названия"}
            </h2>
            <p
              style={{
                fontSize: "0.875rem",
                color: article.active ? "#6b7280" : "#9ca3af",
                margin: 0,
              }}
            >
              {article.description || article.desc || article.Description || ""}
              {!article.active && " (недоступно)"}
            </p>
          </div>
          ))}
        </div>
      )}
    </div>
  );
}


