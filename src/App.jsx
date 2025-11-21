import { Outlet, NavLink } from "react-router-dom";


export default function App() {
  const active = ({ isActive }) =>
    isActive ? { fontWeight: "700" } : undefined;

  return (     
    <div
      style={{
        margin: "0px auto",
        fontFamily: "sans-serif",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        paddingInline: 16,
      }}
    >
      <header
        style={{
          display: "flex",
          gap: 16,
          padding: "16px 0",
          position: "sticky",
          top: 0,
          zIndex: 10,
          borderBottom: "1px solid #eee",
        }}
      >
       
        <NavLink to="/articles" style={active}>
          Список статей
        </NavLink>
        <NavLink to="/article" style={active}>
          Статья
        </NavLink>
        <NavLink to="/tests" style={active}>
          Тест
        </NavLink>
        {/* Временно закомментировано для восстановления раскомментировать: */}
        {/* <NavLink to="/card" style={active}>
          Карточки
        </NavLink>
        <NavLink to="/solution" style={active}>
          Решение
        </NavLink> */}
      </header>

      <main
        style={{
          flex: 1,
          // display: "flex",
          alignItems: "start",
          justifyContent: "start",
          padding: "24px 0",
        }}
      >
        <Outlet />
      </main>

      <footer
        style={{
          marginTop: "auto",
          opacity: 0.7,
          padding: "12px 0",
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
