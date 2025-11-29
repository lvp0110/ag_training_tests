import React from "react";
import { useNavigate } from "react-router-dom";

export default function ArticlesList() {
  const navigate = useNavigate();

  // Список статей - только первые две активны
  const articles = [
    { id: 1, title: "Первая статья", description: "Описание первой статьи", active: true },
    { id: 2, title: "Вторая статья", description: "Описание второй статьи", active: true },
    { id: 3, title: "Третья статья", description: "Описание третьей статьи", active: false },
    { id: 4, title: "Четвертая статья", description: "Описание четвертой статьи", active: false },
    { id: 5, title: "Пятая статья", description: "Описание пятой статьи", active: false },
  ];

  const handleArticleClick = (articleId, isActive) => {
    if (isActive) {
      navigate(`/article?id=${articleId}`);
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

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        {articles.map((article) => (
          <div
            key={article.id}
            onClick={() => handleArticleClick(article.id, article.active)}
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
              {article.title}
            </h2>
            <p
              style={{
                fontSize: "0.875rem",
                color: article.active ? "#6b7280" : "#9ca3af",
                margin: 0,
              }}
            >
              {article.description}
              {!article.active && " (недоступно)"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}


