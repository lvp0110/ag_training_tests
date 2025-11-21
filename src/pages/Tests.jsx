import React, { useState, useEffect } from "react";
import { API_ENDPOINTS } from "../config/api";

export default function Tests() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Храним выбранные ответы: ключ - question_code, значение - code выбранного ответа
  const [selectedAnswers, setSelectedAnswers] = useState({});
  // Храним результаты проверки: ключ - question_code, значение - { isCorrect: boolean, checking: boolean, error: string, correctAnswerCode: string }
  const [checkResults, setCheckResults] = useState({});

  // Общие стили для переиспользования
  const mainContainerStyle = {
    position: "relative",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center"
  };

  const contentContainerStyle = {
    maxWidth: 600,
    boxSizing: "border-box"
  };

  const centerContainerStyle = {
    ...contentContainerStyle,
    textAlign: "center"
  };

  // Базовые стили для вариантов ответов
  const baseAnswerStyle = {
    padding: "0.75rem 1rem",
    borderRadius: "8px",
    fontSize: "0.9375rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    cursor: "default"
  };

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        
        // Пытаемся получить вопросы через GET /answers (основной эндпоинт для получения вопросов)
        // /check используется для POST запросов (проверка ответов)
        let response = await fetch(API_ENDPOINTS.ANSWERS, {
          method: 'GET',
          headers: {
            'accept': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Получены данные с сервера:', data);
        
        // Проверяем структуру данных
        let questionsData = [];
        if (Array.isArray(data)) {
          questionsData = data;
        } else if (data && typeof data === 'object') {
          // Пытаемся найти массив вопросов в объекте
          questionsData = data.questions || data.data || data.items || [];
        }

        console.log('Список вопросов:', questionsData);
        setQuestions(questionsData);
        setError(null);
      } catch (err) {
        // Улучшенная обработка ошибок
        const errorMessage = err.message || 'Не удалось загрузить вопросы';
        setError(errorMessage);
        console.error('Ошибка при загрузке вопросов:', err);
        
        // Если API недоступен, показываем более понятное сообщение
        if (err.message.includes('404') || err.message.includes('Failed to fetch')) {
          setError('API сервер недоступен. Убедитесь, что сервер запущен и доступен.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  // Функция для проверки ответа через /check
  const checkAnswer = async (questionCode, answerCode) => {
    // Устанавливаем состояние проверки
    setCheckResults(prev => ({
      ...prev,
        [questionCode]: { checking: true, isCorrect: null, error: null, correctAnswerCode: null }
    }));

    try {
      const response = await fetch(API_ENDPOINTS.CHECK, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify([
          {
            question_code: questionCode,
            answerCodes: [String(answerCode)]
          }
        ])
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('=== Результат проверки ===');
      console.log('Вопрос:', questionCode);
      console.log('Выбранный ответ:', answerCode);
      console.log('Полный ответ сервера:', JSON.stringify(result, null, 2));
      console.log('Тип результата:', typeof result, Array.isArray(result) ? '(массив)' : '(объект)');

      // Определяем, правильный ли ответ
      // Структура ответа: { result: [{ questionCode, userAnswerCode, rightAnswerCode, isCorrect }] }
      let isCorrect = false;
      let correctAnswerCode = null;

      // Если результат - объект с полем result (массив)
      if (result && typeof result === 'object' && Array.isArray(result.result)) {
        console.log('Обработка объекта с массивом result');
        const resultsArray = result.result;
        const item = resultsArray.find(r => 
          r.questionCode === questionCode || 
          r.questionCode === String(questionCode) ||
          r.question_code === questionCode ||
          r.question_code === String(questionCode)
        ) || resultsArray[0];
        console.log('Найденный элемент в result:', item);
        
        if (item) {
          isCorrect = item.isCorrect === true;
          // rightAnswerCode - это массив, берем первый элемент
          correctAnswerCode = Array.isArray(item.rightAnswerCode) && item.rightAnswerCode.length > 0
            ? String(item.rightAnswerCode[0])
            : (item.rightAnswerCode || item.correctAnswerCode || item.correct_answer_code || null);
        }
      }
      // Если результат - массив напрямую
      else if (Array.isArray(result) && result.length > 0) {
        const item = result.find(r => 
          r.questionCode === questionCode || 
          r.questionCode === String(questionCode) ||
          r.question_code === questionCode || 
          r.question_code === String(questionCode)
        ) || result[0];
        console.log('Найденный элемент в массиве:', item);
        
        if (item) {
          isCorrect = item.isCorrect === true || item.correct === true || item.result === true || item.is_correct === true;
          // Проверяем различные варианты названий поля
          correctAnswerCode = Array.isArray(item.rightAnswerCode) && item.rightAnswerCode.length > 0
            ? String(item.rightAnswerCode[0])
            : (item.rightAnswerCode || item.correctAnswerCode || item.correct_answer_code || item.correctAnswer || item.correct_answer || null);
        }
      } 
      // Если результат - объект с другими полями
      else if (result && typeof result === 'object') {
        console.log('Обработка объекта результата');
        isCorrect = result.isCorrect === true || result.correct === true || result.result === true || result.is_correct === true;
        correctAnswerCode = Array.isArray(result.rightAnswerCode) && result.rightAnswerCode.length > 0
          ? String(result.rightAnswerCode[0])
          : (result.rightAnswerCode || result.correctAnswerCode || result.correct_answer_code || result.correctAnswer || result.correct_answer || null);
        
        // Если есть массив результатов внутри
        if (Array.isArray(result.results) || Array.isArray(result.data)) {
          const resultsArray = result.results || result.data;
          const item = resultsArray.find(r => 
            r.questionCode === questionCode ||
            r.questionCode === String(questionCode) ||
            r.question_code === questionCode || 
            r.question_code === String(questionCode)
          ) || resultsArray[0];
          console.log('Найденный элемент во вложенном массиве:', item);
          
          if (item) {
            isCorrect = item?.isCorrect === true || item?.correct === true || item?.result === true || item?.is_correct === true;
            correctAnswerCode = Array.isArray(item?.rightAnswerCode) && item.rightAnswerCode.length > 0
              ? String(item.rightAnswerCode[0])
              : (item?.rightAnswerCode || item?.correctAnswerCode || item?.correct_answer_code || item?.correctAnswer || item?.correct_answer || null);
          }
        }
      }

      // Если правильный ответ не указан явно, но ответ правильный - используем выбранный код
      if (!correctAnswerCode && isCorrect) {
        correctAnswerCode = String(answerCode);
      }

      console.log('=== Результат обработки ===');
      console.log('isCorrect =', isCorrect);
      console.log('correctAnswerCode =', correctAnswerCode);
      console.log('selectedAnswerCode =', answerCode);

      const resultData = { 
        checking: false, 
        isCorrect, 
        error: null,
        correctAnswerCode: correctAnswerCode || null
      };

      setCheckResults(prev => {
        const updated = { ...prev, [questionCode]: resultData };
        console.log('Обновленные результаты проверки:', updated);
        console.log('Результат для вопроса', questionCode, ':', resultData);
        return updated;
      });
    } catch (err) {
      console.error('Ошибка при проверке ответа:', err);
      setCheckResults(prev => ({
        ...prev,
        [questionCode]: { checking: false, isCorrect: null, error: err.message, correctAnswerCode: null }
      }));
    }
  };

  // Обработчик выбора ответа
  const handleAnswerSelect = (questionCode, answerCode) => {
    console.log('=== Выбор ответа ===');
    console.log('Вопрос (question_code):', questionCode);
    console.log('Выбранный ответ (code):', answerCode);
    
    // Сохраняем выбранный ответ
    setSelectedAnswers(prev => {
      const updated = { ...prev, [questionCode]: answerCode };
      console.log('Обновленные выбранные ответы:', updated);
      return updated;
    });

    // Проверяем ответ
    checkAnswer(questionCode, answerCode);
  };

  // Получить стиль для варианта ответа
  const getAnswerStyle = (questionCode, answerCode) => {
    const selected = selectedAnswers[questionCode] === answerCode;
    const result = checkResults[questionCode];
    const isAnswered = selectedAnswers[questionCode] !== undefined;

    // Если вопрос проверен
    if (result && !result.checking && isAnswered) {
      // Определяем, является ли этот вариант правильным ответом
      const isCorrectAnswer = 
        (result.correctAnswerCode && result.correctAnswerCode === String(answerCode)) ||
        (result.isCorrect === true && selected) ||
        (!result.correctAnswerCode && result.isCorrect === true && selected);
      
      // Если это правильный ответ - всегда показываем зеленым
      if (isCorrectAnswer) {
        return {
          ...baseAnswerStyle,
          background: "#f0fdf4",
          borderWidth: 2,
          borderStyle: "solid",
          borderColor: "#10b981",
          color: "#065f46",
          boxShadow: "0 0 0 3px rgba(16,185,129,0.1)",
        };
      }
      
      // Если это неправильно выбранный ответ - показываем красным
      if (selected && result.isCorrect === false) {
        return {
          ...baseAnswerStyle,
          background: "#fef2f2",
          borderWidth: 2,
          borderStyle: "solid",
          borderColor: "#ef4444",
          color: "#991b1b",
          boxShadow: "0 0 0 3px rgba(239,68,68,0.1)",
        };
      }
    }

    // Если проверяется
    if (selected && result && result.checking) {
      return {
        ...baseAnswerStyle,
        background: "#fffbeb",
        borderWidth: 2,
        borderStyle: "solid",
        borderColor: "#f59e0b",
        color: "#92400e",
      };
    }

    // Если выбран, но еще не проверен
    if (selected && (!result || result.checking)) {
      return {
        ...baseAnswerStyle,
        background: "#f3f4f6",
        borderWidth: 2,
        borderStyle: "solid",
        borderColor: "#6366f1",
        color: "#374151",
      };
    }

    // Если вопрос проверен и это не выбранный и не правильный ответ - приглушаем
    if (result && !result.checking && isAnswered && !selected && 
        result.correctAnswerCode !== String(answerCode)) {
      return {
        ...baseAnswerStyle,
        background: "#f9fafb",
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: "#e5e7eb",
        color: "#9ca3af",
        opacity: 0.6,
      };
    }

    // Обычное состояние (не выбран)
    return {
      ...baseAnswerStyle,
      background: "#f9fafb",
      borderWidth: 1,
      borderStyle: "solid",
      borderColor: "#e5e7eb",
      color: "#374151",
      cursor: isAnswered ? "default" : "pointer",
      transition: "all 0.2s ease",
    };
  };

  if (loading) {
    return (
      <main style={mainContainerStyle}>
        <div style={centerContainerStyle}>
          <p style={{ fontSize: "1rem", color: "#6b7280" }}>Загрузка вопросов...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main style={mainContainerStyle}>
        <div style={centerContainerStyle}>
          <p style={{ fontSize: "1rem", color: "#ef4444" }}>Ошибка загрузки: {error}</p>
        </div>
      </main>
    );
  }

  return (
    <main style={mainContainerStyle}>
      <div style={contentContainerStyle}>
        <h1 style={{ fontSize: "2rem", fontWeight: 600, marginBottom: "2rem", color: "white" }}>
          Список вопросов
        </h1>

        {questions.length === 0 ? (
          <div
            style={{
              background: "#f3f4f6",
              borderRadius: "12px",
              padding: "2rem",
              textAlign: "center",
            }}
          >
            <p style={{ margin: 0, fontSize: "1rem", color: "#6b7280" }}>
              Нет доступных вопросов
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {questions.map((question, index) => {
              // Извлекаем код вопроса (структура: Code - это question_code для /check POST)
              const questionCode = question.Code || question.code || question.question_code || question.id || String(index + 1);
              
              // Извлекаем текст вопроса (структура: Name)
              const questionText = 
                question.Name || 
                question.name ||
                question.text || 
                question.question || 
                question.title ||
                question.question_text ||
                question.label ||
                `Вопрос ${index + 1}`;

              // Извлекаем варианты ответов (структура: Answers - массив с Name и Code)
              let options = [];
              
              if (question.Answers && Array.isArray(question.Answers)) {
                // Структура: Answers - массив объектов с Name и Code
                options = question.Answers.map(answer => ({
                  code: answer.Code || answer.code || String(answer),
                  text: answer.Name || answer.name || answer.text || answer.label || String(answer)
                }));
              } else if (question.answers && Array.isArray(question.answers)) {
                options = question.answers.map(answer => {
                  if (typeof answer === 'object' && answer !== null) {
                    return {
                      code: answer.Code || answer.code || String(answer),
                      text: answer.Name || answer.name || answer.text || answer.label || String(answer)
                    };
                  }
                  return {
                    code: String(answer),
                    text: String(answer)
                  };
                });
              } else if (question.options && Array.isArray(question.options)) {
                options = question.options.map(opt => {
                  if (typeof opt === 'object' && opt !== null) {
                    return {
                      code: opt.Code || opt.code || String(opt),
                      text: opt.Name || opt.name || opt.text || opt.label || String(opt)
                    };
                  }
                  return {
                    code: String(opt),
                    text: String(opt)
                  };
                });
              }

              return (
                  <section
                  key={questionCode || question.id || question._id || index}
                  style={{
                    background: "#ffffff",
                    borderRadius: "16px",
                    padding: "1.5rem",
                    borderWidth: 1,
                    borderStyle: "solid",
                    borderColor: "#e5e7eb",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    width: "100%",
                  }}
                >
                  <div style={{ marginBottom: "1rem" }}>
                    <h2
                      style={{
                        margin: 0,
                        fontSize: "1.25rem",
                        fontWeight: 600,
                        color: "#111827",
                      }}
                    >
                      {questionText}
                    </h2>
                  </div>

                  {Array.isArray(options) && options.length > 0 ? (
                    <ul
                      style={{
                        listStyle: "none",
                        padding: 0,
                        margin: 0,
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.5rem",
                      }}
                    >
                      {options.map((option, optIndex) => {
                        // option уже имеет структуру { code, text }
                        const optionCode = option.code || String(optIndex + 1);
                        const optionText = option.text || `Вариант ${optIndex + 1}`;
                        const selected = selectedAnswers[questionCode] === optionCode;
                        const result = checkResults[questionCode];
                        const isChecking = selected && result && result.checking;
                        const isAnswered = selectedAnswers[questionCode] !== undefined;

                        return (
                          <li
                            key={optIndex}
                            onClick={() => {
                              // Не позволяем выбирать другой ответ, если уже выбран
                              if (!isAnswered) {
                                handleAnswerSelect(questionCode, optionCode);
                              }
                            }}
                            style={getAnswerStyle(questionCode, optionCode)}
                            onMouseEnter={(e) => {
                              if (!isAnswered && !selected) {
                                e.currentTarget.style.background = "#f3f4f6";
                                e.currentTarget.style.borderColor = "#d1d5db";
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!isAnswered && !selected) {
                                e.currentTarget.style.background = "#f9fafb";
                                e.currentTarget.style.borderColor = "#e5e7eb";
                              }
                            }}
                          >
                            <span style={{ fontWeight: selected ? 600 : 400 }}>
                              {optionText}
                              {isChecking && (
                                <span style={{ 
                                  marginLeft: "0.5rem", 
                                  fontSize: "0.875rem",
                                  fontStyle: "italic"
                                }}>
                                  (проверка...)
                                </span>
                              )}
                            </span>
                            <span style={{ 
                              fontSize: "0.75rem", 
                              color: "#9ca3af",
                              marginLeft: "0.5rem"
                            }}>
                              Code: {optionCode}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <p style={{ margin: 0, fontSize: "0.875rem", color: "#9ca3af", fontStyle: "italic" }}>
                      Нет вариантов ответа
                    </p>
                  )}

                  {/* Отображение ошибки проверки, если она есть */}
                  {checkResults[questionCode]?.error && (
                    <div
                      style={{
                        marginTop: "1rem",
                        padding: "0.75rem 1rem",
                        background: "#fef2f2",
                        borderRadius: "8px",
                        borderWidth: 1,
                        borderStyle: "solid",
                        borderColor: "#ef4444",
                      }}
                    >
                      <p style={{ margin: 0, fontSize: "0.875rem", color: "#dc2626" }}>
                        Ошибка при проверке ответа: {checkResults[questionCode].error}
                      </p>
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        )}

        <div
          style={{
            marginTop: "2rem",
            padding: "1rem",
            background: "#f3f4f6",
            borderRadius: "8px",
            fontSize: "0.875rem",
            color: "#6b7280",
          }}
        >
          Всего вопросов: {questions.length}
        </div>
      </div>
    </main>
  );
}
