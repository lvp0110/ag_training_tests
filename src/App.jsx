import { Outlet, useLocation } from "react-router-dom";


export default function App() {
  const location = useLocation();
  const currentPath = location.pathname;

  const getLinkStyle = (path) => {
    const isActive = currentPath === path;
    return {
      fontSize: "1.1rem",
      fontWeight: isActive ? "600" : "400",
      color: isActive ? "#1f2937" : "#6b7280",
      cursor: "default",
      textDecoration: "none",
      padding: "8px 0",
      transition: "color 0.2s ease",
    };
  };

  return (     
    <div
      style={{
        margin: "0px auto",
        fontFamily: "sans-serif",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <header
        style={{
          width: "100%",
          display: "flex",
          gap: 24,
          padding: "20px 16px",
          position: "sticky",
          top: 0,
          zIndex: 10,
          borderBottom: "1px solid #eee",
          backgroundColor: "#fffe",
        }}
      >
       
        <span style={getLinkStyle("/articles")}>
          Список статей
        </span>
        <span style={getLinkStyle("/article")}>
          Статья
        </span>
        <span style={getLinkStyle("/tests")}>
          Тест
        </span>
      </header>

      <main
        style={{
          flex: 1,
          alignItems: "start",
          justifyContent: "start",
          padding: "24px 16px",
        }}
      >
        <Outlet />
      </main>

      <footer
        style={{
          marginTop: "auto",
          opacity: 0.7,
          padding: "12px 16px",
          borderTop: "1px solid #eee",
        }}
      >
        <small>
          AN Game Card ©
          {new Date()
            .toLocaleDateString("ru-RU", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })
            .replace(" г.", " г.")
            .replace(/^./, (c) => c.toUpperCase())}
        </small>
      </footer>
    </div>
    
  );
}
