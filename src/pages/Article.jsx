import React, { useState, useRef, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import quest1 from "../assets/quest1.png";
import quest2 from "../assets/quest2.png";
import quest3 from "../assets/quest3.png";
import quest4 from "../assets/quest4.png";
import quest5 from "../assets/quest5.png";

export default function Article() {
  const [searchParams] = useSearchParams();
  const articleId = parseInt(searchParams.get("id") || "1", 10);
  const [showButton, setShowButton] = useState(false);
  const textContainerRef = useRef(null);
  const navigate = useNavigate();

  // Массив статей с текстом
  const articles = [
    {
      id: 1,
      title: "Первая статья",
      text: `Введение в основы программирования

Программирование — это искусство создания инструкций для компьютера. Каждая программа состоит из последовательности команд, которые компьютер выполняет для решения определенной задачи.

Основные концепции программирования включают переменные, которые хранят данные, функции, которые выполняют определенные действия, и структуры данных, которые организуют информацию эффективным образом.

Языки программирования служат мостом между человеком и компьютером. Они позволяют нам писать код на понятном нам языке, который затем преобразуется в машинный код, понятный компьютеру.

Современные языки программирования предлагают множество возможностей: от простых скриптов до сложных приложений. Выбор языка зависит от задачи, которую нужно решить, и от предпочтений разработчика.

Изучение программирования требует практики и терпения. Начните с простых задач и постепенно переходите к более сложным проектам. Помните, что каждый программист когда-то был новичком.`,
    },
    {
      id: 2,
      title: "Вторая статья",
      text: `Продвинутые техники разработки

После освоения основ программирования важно изучить продвинутые техники, которые помогут создавать более эффективные и масштабируемые приложения.

Архитектура программного обеспечения играет ключевую роль в создании больших систем. Правильная архитектура позволяет легко добавлять новые функции, поддерживать код и масштабировать приложение.

Тестирование кода — неотъемлемая часть разработки. Написание тестов помогает убедиться, что код работает правильно и не ломается при внесении изменений. Существуют различные виды тестов: unit-тесты, интеграционные тесты и end-to-end тесты.

Оптимизация производительности — важный аспект разработки. Необходимо понимать, как работает код на низком уровне, чтобы находить узкие места и улучшать производительность приложения.

Работа в команде требует знания систем контроля версий, таких как Git. Умение эффективно использовать Git позволяет работать над проектом совместно с другими разработчиками без конфликтов.

Изучение новых технологий и фреймворков — постоянный процесс в карьере разработчика. Важно следить за трендами в индустрии и быть готовым к обучению новым инструментам.`,
    },
  ];

  // Находим статью по id
  const currentArticle = articles.find((article) => article.id === articleId) || articles[0];

  // Массив изображений для отображения
  const images = [quest1, quest2, quest3, quest4, quest5];

  // Отслеживание прокрутки до конца текста
  useEffect(() => {
    const textContainer = textContainerRef.current;
    if (!textContainer) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = textContainer;
      // Проверяем, достигнут ли конец прокрутки (с небольшим допуском в 5px)
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 5;
      setShowButton(isAtBottom);
    };

    // Проверяем сразу при загрузке, если контент уже помещается
    handleScroll();

    textContainer.addEventListener("scroll", handleScroll);
    // Также проверяем при изменении размера окна
    window.addEventListener("resize", handleScroll);

    return () => {
      textContainer.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [currentArticle]);

  // Функция для перехода к тестам
  const handleGoToTests = () => {
    navigate(`/tests?articleId=${articleId}`);
  };

  return (
    <main style={{ position: "relative", minHeight: "100vh", display: "flex", justifyContent: "center" }}>
      <div style={{ margin: "0 auto", width: "100%" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 600, marginBottom: "2rem", color: "white" }}>
          {currentArticle.title}
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
              // background: "#ffffff",
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
            }}
          >
            <div
              style={{
                whiteSpace: "pre-wrap",
                wordWrap: "break-word",
                textAlign: "justify",
              }}
            >
              {currentArticle.text}
            </div>
            {showButton && (
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

