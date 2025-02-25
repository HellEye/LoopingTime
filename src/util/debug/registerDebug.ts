window.debug = {};
export const registerDebug = (name: string, fn: () => void) => {
  window.debug[name] = fn;
};
