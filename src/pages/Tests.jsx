import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Tests() {
  const navigate = useNavigate();

  const questions = [
    {
      id: 1,
      text: "В каком году началось производсво Шуманет БМ?",
      options: ["1999 год", "2000 год", "2005 год"],
      correctIndex: 1,
    },
    {
      id: 2,
      text: "Какие противопожарные свойства у Шуманет БМ?",
      options: ["КМ1", "НГ", "Н1"],
      correctIndex: 1,
    },
    {
      id: 3,
      text: "Чье сырье используется для производства Шуманет БМ?",
      options: ["Rockwool", "URSA", "ISOVER"],
      correctIndex: 0,
    },
    {
      id: 4,
      text: "Толщина пергородки на сдвоенном каркасе 100 мм?",
      options: ["268 мм", "158 мм", "168 мм"],
      correctIndex: 1,
    },
    {
      id: 5,
      text: "Максимальная высота облицовки с применением креплений Виброфлекс-КС?",
      options: ["6 м", "5,5 м", "10 м"],
      correctIndex: 2,
    },
  ];

  const [showTests, setShowTests] = useState(false);
  const [current, setCurrent] = useState(0);
  const [selectedByQuestion, setSelectedByQuestion] = useState({});
  const [checked, setChecked] = useState(false);

  const baseOptionStyle = {
    padding: "12px 14px",
    borderWidth: 2,
    borderStyle: "solid",
    borderColor: "#e5e7eb",
    borderRadius: "12px",
    cursor: "pointer",
    background: "none",
    transition:
      "background-color .15s ease, border-color .15s ease, box-shadow .15s ease, opacity .12s ease",
    boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
    userSelect: "none",
  };

  const getOptionStyle = (qIndex, oIndex, correctIndex) => {
    const isSelected = selectedByQuestion[qIndex] === oIndex;

    if (!checked) {
      return isSelected
        ? {
            ...baseOptionStyle,
            background: "#f3f4f624",
            borderColor: "#d1d5db",
            cursor: "pointer",
          }
        : { ...baseOptionStyle, cursor: "pointer" };
    }

    const isCorrect = oIndex === correctIndex;
    if (isCorrect) {
      return {
        ...baseOptionStyle,
        borderColor: "#10b981",
        boxShadow: "0 0 0 3px rgba(16,185,129,0.12)",
        cursor: "default",
      };
    }

    if (isSelected && !isCorrect) {
      return {
        ...baseOptionStyle,
        borderColor: "#ef4444",
        boxShadow: "0 0 0 3px rgba(239,68,68,0.12)",
        cursor: "default",
      };
    }

    return { ...baseOptionStyle, opacity: 0.75, cursor: "default" };
  };

  const onSelect = (oIndex) => {
    if (checked) return;
    setSelectedByQuestion((prev) => ({ ...prev, [current]: oIndex }));
    const delay = 300;
    const next = current + 1;

    setTimeout(() => {
      if (next < questions.length) {
        setCurrent(next);
      } else {
        setChecked(true);
      }
    }, delay);
  };

  const correctCount = questions.reduce((acc, q, qIndex) => {
    const selected = selectedByQuestion[qIndex];
    return acc + (selected === q.correctIndex ? 1 : 0);
  }, 0);

  const allCorrect = checked && correctCount === questions.length;

  const reset = () => {
    setSelectedByQuestion({});
    setChecked(false);
    setCurrent(0);
  };

  return (
    <main style={{ position: "relative", minHeight: "100vh", paddingTop: "4rem" }}>
      {showTests && (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "7.5rem",
            margin: "0px 30px",
          }}
        >
          <h2
            style={{
              zIndex: 3,
              margin: 0,
              color: "#fff",
              fontWeight: 300,
              fontSize: 30,
            }}
          >
            Тесты
          </h2>

          {checked ? (
            <div style={{ fontWeight: 600, color: "#f3f4f6" }}>
              Результат: {correctCount} из {questions.length}
            </div>
          ) : (
            <div style={{ fontWeight: 600, color: "#f3f4f6" }}>
              Вопрос {Math.min(current + 1, questions.length)} из {questions.length}
            </div>
          )}
        </div>
      )}

      <div style={{ padding: "2rem", maxWidth: 800, margin: "0 auto" }}>
        {/* Текстовый блок отдельно от тестов */}
        {!showTests && (
          <div
            style={{
              background: "none",
              borderRadius: "16px",
              padding: "1.5rem",
              marginBottom: "2rem",
              borderWidth: 1,
              borderStyle: "solid",
              borderColor: "#e5e7eb",
              lineHeight: 1.6,
            }}
          >
            <p style={{ margin: 0, fontSize: "1rem", marginBottom: "1.5rem" }}>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ipsum expedita non eaque voluptatum laudantium perferendis nihil, quod ratione dolore in. Error quia nobis sint! Quis nobis quibusdam blanditiis ab corrupti!
            </p>
            <button
              onClick={() => setShowTests(true)}
              style={{
                padding: "12px 24px",
                borderRadius: "10px",
                borderWidth: 2,
                borderStyle: "solid",
                borderColor: "#10b981",
                background: "#10b981",
                color: "#fff",
                cursor: "pointer",
                transition: "all .15s ease",
                fontWeight: 600,
                fontFamily: "sans-serif",
                fontSize: 18,
              }}
            >
              Начать тест
            </button>
          </div>
        )}

        {showTests && questions.map((q, qIndex) => {
          if (!checked && qIndex !== current) return null;

          return (
            <section
              key={q.id}
              style={{
                background: "none",
                borderRadius: "16px",
                padding: "1rem 1.25rem",
                marginBottom: "1rem",
                borderWidth: 1,
                borderStyle: "solid",
                borderColor: "#e5e7eb",
              }}
            >
              <h2
                style={{
                  margin: "0 0 0.75rem 0",
                  fontSize: "1.125rem",
                  fontWeight: 600,
                }}
              >
                {q.text}
              </h2>

              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "grid",
                  gap: "0.5rem",
                }}
              >
                {q.options.map((opt, oIndex) => (
                  <li
                    key={oIndex}
                    onClick={() => onSelect(oIndex)}
                    style={getOptionStyle(qIndex, oIndex, q.correctIndex)}
                  >
                    {opt}
                  </li>
                ))}
              </ul>
            </section>
          );
        })}

        {showTests && (
        <div
          style={{
            marginTop: "1.25rem",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "0.75rem",
          }}
        >
          {checked && (
            <>
              <button
                onClick={reset}
                style={{
                  padding: "10px 10px",
                  borderRadius: "10px",
                  borderWidth: 2,
                  borderStyle: "solid",
                  borderColor: "#e5e7eb",
                  background: "#fff",
                  color: "#111827",
                  cursor: "pointer",
                  transition: "all .15s ease",
                  fontWeight: 600,
                  fontFamily: "sans-serif",
                  fontSize: 18,
                }}
              >
                пройти снова
              </button>

              <button
                onClick={() => {
                  setShowTests(false);
                  setSelectedByQuestion({});
                  setChecked(false);
                  setCurrent(0);
                }}
                style={{
                  padding: "10px 10px",
                  borderRadius: "10px",
                  borderWidth: 2,
                  borderStyle: "solid",
                  borderColor: "#e5e7eb",
                  background: "#fff",
                  color: "#111827",
                  cursor: "pointer",
                  transition: "all .15s ease",
                  fontWeight: 600,
                  fontFamily: "sans-serif",
                  fontSize: 18,
                }}
              >
                ← Вернуться к тексту
              </button>

              {allCorrect && (
                <button
                  onClick={() => navigate("/card")}
                  style={{
                    padding: "10px 10px",
                    borderRadius: "10px",
                    borderWidth: 2,
                    borderStyle: "solid",
                    borderColor: "#10b981",
                    background: "#10b981",
                    color: "#fff",
                    cursor: "pointer",
                    transition: "all .15s ease",
                    fontWeight: 600,
                    fontFamily: "sans-serif",
                    fontSize: 18,
                  }}
                >
                  перейти к карточкам
                </button>
              )}
            </>
          )}
        </div>
        )}
      </div>
    </main>
  );
}