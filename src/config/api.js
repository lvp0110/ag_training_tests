// Конфигурация API endpoints
// В разработке используется proxy из vite.config.js
// В production нужно указать полный URL к API серверу

const getApiBaseUrl = () => {
  // Если указана переменная окружения VITE_API_BASE_URL, используем её
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  // В режиме разработки (dev) используем относительные пути (работают через proxy)
  if (import.meta.env.DEV) {
    return '';
  }
  
  // В production по умолчанию возвращаем пустую строку
  // Если API находится на другом домене, установите VITE_API_BASE_URL
  // Например: export VITE_API_BASE_URL=http://your-api-server.com
  return '';
};

export const API_BASE_URL = getApiBaseUrl();

// Endpoints
export const API_ENDPOINTS = {
  ANSWERS: `${API_BASE_URL}/answers`,
  CHECK: `${API_BASE_URL}/check`,
  API_V1: `${API_BASE_URL}/api/v1`,
};

