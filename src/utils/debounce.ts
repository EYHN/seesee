// tslint:disable-next-line:ban-types
export default function debounce<T extends Function>(func: T, wait: number) {
  let timeout: number, result: any;

  function later(args: any[]) {
    timeout = null;
    if (args) {
      result = func.apply(null, args);
    }
  }

  function debounced(...args: any[]) {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = window.setTimeout(() => {
      return later(args);
    }, wait);

    return result;
  }

  return debounced;
}
