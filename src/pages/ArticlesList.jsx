import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_ENDPOINTS } from "../config/api";
import "./ArticlesList.css";

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
    <div className="articles-list-container">
      <h1 className="articles-list-title">
        Список статей
      </h1>

      {loading && (
        <div className="articles-list-loading">
          Загрузка статей...
        </div>
      )}

      {error && (
        <div className="articles-list-error">
          Ошибка загрузки статей: {error}
        </div>
      )}

      {!loading && !error && (
        <div className="articles-list-items">
          {articles.map((article, index) => (
          <div
            key={article.Code || article.code || article.id || article._id || index}
            onClick={() => handleArticleClick(article.Code || article.code, article.active)}
            className={`article-card ${!article.active ? "article-card--inactive" : ""}`}
          >
            <h2 className="article-card-title">
              {article.Name || article.name || article.title || article.Title || "Без названия"}
            </h2>
            <p className="article-card-description">
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


