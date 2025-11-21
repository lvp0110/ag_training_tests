import React from "react";
import quest1 from "../assets/quest1.png";
import quest2 from "../assets/quest2.png";
import quest3 from "../assets/quest3.png";
import quest4 from "../assets/quest4.png";
import quest5 from "../assets/quest5.png";

export default function Article() {
  // Пример большого текста для демонстрации
  const longText = `
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

    Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.

    Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur?

    Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur? At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.

    Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.

    Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.

    Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.

    Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur?

    Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur? At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.

    Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.
  `.trim();

  // Массив изображений для отображения
  const images = [quest1, quest2, quest3, quest4, quest5];

  return (
    <main style={{ position: "relative", minHeight: "100vh", display: "flex", justifyContent: "center" }}>
      <div style={{ margin: "0 auto", width: "100%" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 600, marginBottom: "2rem", color: "white" }}>
          Статья
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
            style={{
              flex: 1,
              background: "#ffffff",
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
              color: "#374151",
            }}
          >
            <div
              style={{
                whiteSpace: "pre-wrap",
                wordWrap: "break-word",
                textAlign: "justify",
              }}
            >
              {longText}
            </div>
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
              overflowY: "auto",
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

