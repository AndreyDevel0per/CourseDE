/**
 *
 */
export function getDebouncedFn(func, delay = 500) {
  let timeout;
  return function (...args) {
    const context = this;

    clearTimeout(timeout);
    timeout = setTimeout(() => {
      timeout = null;
      func.apply(context, args);
    }, delay);
  };
}
