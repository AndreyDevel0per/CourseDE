/**
 * Подключение внешнего скрипта
 */
export const getExternalScript = (url) => {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = url;
    script.onload = () => resolve();
    script.onerror = () => {
      reject(new Error()`Failed to load script ${url}`);
    };
    document.head.appendChild(script);
  });
};
