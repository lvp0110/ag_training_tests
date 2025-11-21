import React from "react";
import { useNavigate } from "react-router-dom";

export default function ArticlesList() {
  const navigate = useNavigate();

  // Пример списка статей
  const articles = [
    { id: 1, title: "Первая статья", description: "Описание первой статьи" },
    { id: 2, title: "Вторая статья", description: "Описание второй статьи" },
    { id: 3, title: "Третья статья", description: "Описание третьей статьи" },
    { id: 4, title: "Четвертая статья", description: "Описание четвертой статьи" },
    { id: 5, title: "Пятая статья", description: "Описание пятой статьи" },
  ];

  const handleArticleClick = (articleId) => {
    navigate(`/article?id=${articleId}`);
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
            onClick={() => handleArticleClick(article.id)}
            style={{
              background: "#ffffff",
              borderRadius: "12px",
              padding: "1.5rem",
              borderWidth: 1,
              borderStyle: "solid",
              borderColor: "#e5e7eb",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#3b82f6";
              e.currentTarget.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#e5e7eb";
              e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <h2
              style={{
                fontSize: "1.25rem",
                fontWeight: 600,
                marginBottom: "0.5rem",
                color: "#111827",
              }}
            >
              {article.title}
            </h2>
            <p
              style={{
                fontSize: "0.875rem",
                color: "#6b7280",
                margin: 0,
              }}
            >
              {article.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

