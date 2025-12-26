import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { API_ENDPOINTS } from "../config/api";
import "./Tests.css";

export default function Tests() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const articleId = searchParams.get("articleId") || "";
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Перенаправление на список статей, если articleId не указан
  useEffect(() => {
    if (!articleId) {
      navigate("/articles", { replace: true });
    }
  }, [articleId, navigate]);
  // Храним выбранные ответы: ключ - question_code, значение - code выбранного ответа
  const [selectedAnswers, setSelectedAnswers] = useState({});
  // Храним результаты проверки: ключ - question_code, значение - { isCorrect: boolean, checking: boolean, error: string, correctAnswerCode: string }
  const [checkResults, setCheckResults] = useState({});

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!articleId) {
        setError("Код темы не указан");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Получаем вопросы через GET /thema/{code}/questions
        let response = await fetch(API_ENDPOINTS.THEMA_QUESTIONS(articleId), {
          method: "GET",
          headers: {
            accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Проверяем структуру данных
        let questionsData = [];
        if (Array.isArray(data)) {
          questionsData = data;
        } else if (data && typeof data === "object") {
          // Пытаемся найти массив вопросов в объекте
          questionsData = data.questions || data.data || data.items || [];
        }

        setQuestions(questionsData);
        setError(null);
      } catch (err) {
        // Улучшенная обработка ошибок
        const errorMessage = err.message || "Не удалось загрузить вопросы";
        setError(errorMessage);
        console.error("Ошибка при загрузке вопросов:", err);

        // Если API недоступен, показываем более понятное сообщение
        if (
          err.message.includes("404") ||
          err.message.includes("Failed to fetch")
        ) {
          setError(
            "API сервер недоступен. Убедитесь, что сервер запущен и доступен."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [articleId]);

  // Функция для проверки ответа через /check
  const checkAnswer = async (questionCode, answerCode) => {
    // Устанавливаем состояние проверки
    setCheckResults((prev) => ({
      ...prev,
      [questionCode]: {
        checking: true,
        isCorrect: null,
        error: null,
        correctAnswerCode: null,
      },
    }));

    try {
      const response = await fetch(API_ENDPOINTS.CHECK, {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify([
          {
            question_code: questionCode,
            answerCodes: [String(answerCode)],
          },
        ]),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("=== Результат проверки ===");
      console.log("Вопрос:", questionCode);
      console.log("Выбранный ответ:", answerCode);
      console.log("Полный ответ сервера:", JSON.stringify(result, null, 2));
      console.log(
        "Тип результата:",
        typeof result,
        Array.isArray(result) ? "(массив)" : "(объект)"
      );

      // Определяем, правильный ли ответ
      // Структура ответа: { result: [{ questionCode, userAnswerCode, rightAnswerCode, isCorrect }] }
      let isCorrect = false;
      let correctAnswerCode = null;

      // Если результат - объект с полем result (массив)
      if (
        result &&
        typeof result === "object" &&
        Array.isArray(result.result)
      ) {
        console.log("Обработка объекта с массивом result");
        const resultsArray = result.result;
        const item =
          resultsArray.find(
            (r) =>
              r.questionCode === questionCode ||
              r.questionCode === String(questionCode) ||
              r.question_code === questionCode ||
              r.question_code === String(questionCode)
          ) || resultsArray[0];
        console.log("Найденный элемент в result:", item);

        if (item) {
          isCorrect = item.isCorrect === true;
          // rightAnswerCode - это массив, берем первый элемент
          correctAnswerCode =
            Array.isArray(item.rightAnswerCode) &&
            item.rightAnswerCode.length > 0
              ? String(item.rightAnswerCode[0])
              : item.rightAnswerCode ||
                item.correctAnswerCode ||
                item.correct_answer_code ||
                null;
        }
      }
      // Если результат - массив напрямую
      else if (Array.isArray(result) && result.length > 0) {
        const item =
          result.find(
            (r) =>
              r.questionCode === questionCode ||
              r.questionCode === String(questionCode) ||
              r.question_code === questionCode ||
              r.question_code === String(questionCode)
          ) || result[0];
        console.log("Найденный элемент в массиве:", item);

        if (item) {
          isCorrect =
            item.isCorrect === true ||
            item.correct === true ||
            item.result === true ||
            item.is_correct === true;
          // Проверяем различные варианты названий поля
          correctAnswerCode =
            Array.isArray(item.rightAnswerCode) &&
            item.rightAnswerCode.length > 0
              ? String(item.rightAnswerCode[0])
              : item.rightAnswerCode ||
                item.correctAnswerCode ||
                item.correct_answer_code ||
                item.correctAnswer ||
                item.correct_answer ||
                null;
        }
      }
      // Если результат - объект с другими полями
      else if (result && typeof result === "object") {
        console.log("Обработка объекта результата");
        isCorrect =
          result.isCorrect === true ||
          result.correct === true ||
          result.result === true ||
          result.is_correct === true;
        correctAnswerCode =
          Array.isArray(result.rightAnswerCode) &&
          result.rightAnswerCode.length > 0
            ? String(result.rightAnswerCode[0])
            : result.rightAnswerCode ||
              result.correctAnswerCode ||
              result.correct_answer_code ||
              result.correctAnswer ||
              result.correct_answer ||
              null;

        // Если есть массив результатов внутри
        if (Array.isArray(result.results) || Array.isArray(result.data)) {
          const resultsArray = result.results || result.data;
          const item =
            resultsArray.find(
              (r) =>
                r.questionCode === questionCode ||
                r.questionCode === String(questionCode) ||
                r.question_code === questionCode ||
                r.question_code === String(questionCode)
            ) || resultsArray[0];
          console.log("Найденный элемент во вложенном массиве:", item);

          if (item) {
            isCorrect =
              item?.isCorrect === true ||
              item?.correct === true ||
              item?.result === true ||
              item?.is_correct === true;
            correctAnswerCode =
              Array.isArray(item?.rightAnswerCode) &&
              item.rightAnswerCode.length > 0
                ? String(item.rightAnswerCode[0])
                : item?.rightAnswerCode ||
                  item?.correctAnswerCode ||
                  item?.correct_answer_code ||
                  item?.correctAnswer ||
                  item?.correct_answer ||
                  null;
          }
        }
      }

      // Если правильный ответ не указан явно, но ответ правильный - используем выбранный код
      if (!correctAnswerCode && isCorrect) {
        correctAnswerCode = String(answerCode);
      }

      console.log("=== Результат обработки ===");
      console.log("isCorrect =", isCorrect);
      console.log("correctAnswerCode =", correctAnswerCode);
      console.log("selectedAnswerCode =", answerCode);

      const resultData = {
        checking: false,
        isCorrect,
        error: null,
        correctAnswerCode: correctAnswerCode || null,
      };

      setCheckResults((prev) => {
        const updated = { ...prev, [questionCode]: resultData };
        console.log("Обновленные результаты проверки:", updated);
        console.log("Результат для вопроса", questionCode, ":", resultData);
        return updated;
      });
    } catch (err) {
      console.error("Ошибка при проверке ответа:", err);
      setCheckResults((prev) => ({
        ...prev,
        [questionCode]: {
          checking: false,
          isCorrect: null,
          error: err.message,
          correctAnswerCode: null,
        },
      }));
    }
  };

  // Обработчик выбора ответа
  const handleAnswerSelect = (questionCode, answerCode) => {
    console.log("=== Выбор ответа ===");
    console.log("Вопрос (question_code):", questionCode);
    console.log("Выбранный ответ (code):", answerCode);

    // Сохраняем выбранный ответ
    setSelectedAnswers((prev) => {
      const updated = { ...prev, [questionCode]: answerCode };
      console.log("Обновленные выбранные ответы:", updated);
      return updated;
    });

    // Проверяем ответ
    checkAnswer(questionCode, answerCode);
  };

  // Получить классы для варианта ответа
  const getAnswerClasses = (questionCode, answerCode) => {
    const selected = selectedAnswers[questionCode] === answerCode;
    const result = checkResults[questionCode];
    const isAnswered = selectedAnswers[questionCode] !== undefined;

    let classes = ["tests-answer-item"];

    // Если вопрос проверен
    if (result && !result.checking && isAnswered) {
      // Определяем, является ли этот вариант правильным ответом
      const isCorrectAnswer =
        (result.correctAnswerCode &&
          result.correctAnswerCode === String(answerCode)) ||
        (result.isCorrect === true && selected) ||
        (!result.correctAnswerCode && result.isCorrect === true && selected);

      // Если это правильный ответ - всегда показываем зеленым
      if (isCorrectAnswer) {
        classes.push("tests-answer-item--correct");
      }
      // Если это неправильно выбранный ответ - показываем красным
      else if (selected && result.isCorrect === false) {
        classes.push("tests-answer-item--incorrect");
      }
      // Если вопрос проверен и это не выбранный и не правильный ответ - приглушаем
      else if (!selected && result.correctAnswerCode !== String(answerCode)) {
        classes.push("tests-answer-item--muted");
      }
    }
    // Если проверяется
    else if (selected && result && result.checking) {
      classes.push("tests-answer-item--checking");
    }
    // Если выбран, но еще не проверен
    else if (selected && (!result || result.checking)) {
      classes.push("tests-answer-item--selected");
    }
    // Если не выбран и вопрос не отвечен - можно выбрать
    else if (!isAnswered) {
      classes.push("tests-answer-item--selectable");
    }

    return classes.join(" ");
  };

  if (loading) {
    return (
      <main className="tests-main-container">
        <div className="tests-center-container">
          <p className="tests-loading">
            Загрузка вопросов...
          </p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="tests-main-container">
        <div className="tests-center-container">
          <p className="tests-error">
            Ошибка загрузки: {error}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="tests-main-container">
      <div className="tests-content-container">
        <h1 className="tests-title">
          Вопросы
        </h1>

        <div className="tests-questions-container">
        {questions.length === 0 ? (
          <div className="tests-no-questions">
            <p className="tests-no-questions-text">
              Нет доступных вопросов
            </p>
          </div>
        ) : (
          <div className="tests-questions-container">
            {questions.map((question, index) => {
              // Извлекаем код вопроса (структура: Code - это question_code для /check POST)
              const questionCode =
                question.Code ||
                question.code ||
                question.question_code ||
                question.id ||
                String(index + 1);

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
                options = question.Answers.map((answer) => ({
                  code: answer.Code || answer.code || String(answer),
                  text:
                    answer.Name ||
                    answer.name ||
                    answer.text ||
                    answer.label ||
                    String(answer),
                }));
              } else if (question.answers && Array.isArray(question.answers)) {
                options = question.answers.map((answer) => {
                  if (typeof answer === "object" && answer !== null) {
                    return {
                      code: answer.Code || answer.code || String(answer),
                      text:
                        answer.Name ||
                        answer.name ||
                        answer.text ||
                        answer.label ||
                        String(answer),
                    };
                  }
                  return {
                    code: String(answer),
                    text: String(answer),
                  };
                });
              } else if (question.options && Array.isArray(question.options)) {
                options = question.options.map((opt) => {
                  if (typeof opt === "object" && opt !== null) {
                    return {
                      code: opt.Code || opt.code || String(opt),
                      text:
                        opt.Name ||
                        opt.name ||
                        opt.text ||
                        opt.label ||
                        String(opt),
                    };
                  }
                  return {
                    code: String(opt),
                    text: String(opt),
                  };
                });
              }

              return (
                <section
                  key={questionCode || question.id || question._id || index}
                  className="tests-question-section"
                >
                  <div className="tests-question-title-container">
                    <h2 className="tests-question-title">
                      {questionText}
                    </h2>
                  </div>

                  {Array.isArray(options) && options.length > 0 ? (
                    <ul className="tests-answers-list">
                      {options.map((option, optIndex) => {
                        // option уже имеет структуру { code, text }
                        const optionCode = option.code || String(optIndex + 1);
                        const optionText =
                          option.text || `Вариант ${optIndex + 1}`;
                        const selected =
                          selectedAnswers[questionCode] === optionCode;
                        const result = checkResults[questionCode];
                        const isChecking =
                          selected && result && result.checking;
                        const isAnswered =
                          selectedAnswers[questionCode] !== undefined;

                        return (
                          <li
                            key={optIndex}
                            onClick={() => {
                              // Не позволяем выбирать другой ответ, если уже выбран
                              if (!isAnswered) {
                                handleAnswerSelect(questionCode, optionCode);
                              }
                            }}
                            className={getAnswerClasses(questionCode, optionCode)}
                          >
                            <span className={selected ? "tests-answer-text--selected" : "tests-answer-text"}>
                              {optionText}
                              {isChecking && (
                                <span className="tests-checking-indicator">
                                  (проверка...)
                                </span>
                              )}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <p className="tests-no-answers">
                      Нет вариантов ответа
                    </p>
                  )}

                  {/* Отображение ошибки проверки, если она есть */}
                  {checkResults[questionCode]?.error && (
                    <div className="tests-error-message">
                      <p className="tests-error-message-text">
                        Ошибка при проверке ответа:{" "}
                        {checkResults[questionCode].error}
                      </p>
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        )}

        <div className="tests-summary">
          Всего вопросов: {questions.length}
          {(() => {
            const correctCount = Object.values(checkResults).filter(
              (result) => result && result.isCorrect === true && !result.checking
            ).length;
            const percentage =
              questions.length > 0
                ? ((correctCount / questions.length) * 100).toFixed(1)
                : 0;
            const isAllAnswered = questions.length > 0 && Object.keys(selectedAnswers).length === questions.length;
            const isAllChecked = questions.length > 0 && 
              questions.every((q) => {
                const questionCode = q.Code || q.code || q.question_code || q.id;
                const result = checkResults[questionCode];
                return result && !result.checking && result.isCorrect !== null;
              });
            const isPerfect = parseFloat(percentage) === 100;
            
            return (
              <>
                {" | "}
                Правильных ответов: {correctCount} ({percentage}%)
                {isAllAnswered && isAllChecked && (
                  <div className="tests-summary-actions">
                    {isPerfect ? (
                      <button
                        onClick={() => navigate("/articles")}
                        className="tests-button tests-button--success"
                      >
                        Продолжить
                      </button>
                    ) : (
                      <button
                        onClick={() => navigate(`/article?code=${articleId}`)}
                        className="tests-button tests-button--primary"
                      >
                        Вернуться к статье
                      </button>
                    )}
                  </div>
                )}
              </>
            );
          })()}
        </div>

        </div>
      </div>
    </main>
  );
}
