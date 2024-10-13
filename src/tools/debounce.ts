type DebounceOptions = {
  leading?: boolean;
  trailing?: boolean;
};

const defaultOptions = {
  leading: false,
  trailing: true,
} satisfies DebounceOptions;


export function debounce<F extends (...args: any[]) => any>(func: F, wait: number, options: DebounceOptions = {}) {
  let timeout: ReturnType<typeof setTimeout> | undefined;

  let lastArgs: Parameters<F> | undefined;
  let lastThis: ThisParameterType<F> | undefined;

  let result: ReturnType<F> | undefined;

  const isLeading = options.leading ?? defaultOptions.leading;
  const isTrailing = options.trailing ?? defaultOptions.trailing;

  const invokeFunc = () => {
    if (lastArgs) {
      result = func.apply(lastThis, lastArgs);
    }
  };

  const startTimer = (pendingFunc: () => void, delay: number) => {
    timeout = setTimeout(pendingFunc, delay);
  };

  const timerExpired = () => {
    timeout = undefined;

    if (isTrailing && lastArgs) {
      invokeFunc();
    }

    lastArgs = undefined;
    lastThis = undefined;
  };

  return function (this: ThisParameterType<F>, ...args: Parameters<F>) {
    lastArgs = args;
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    lastThis = this;

    const shouldInvoke = !timeout;

    if (shouldInvoke) {
      if (isLeading) {
        invokeFunc();

        lastArgs = undefined;
        lastThis = undefined;
      }

      startTimer(timerExpired, wait);
    } else {
      clearTimeout(timeout);

      startTimer(timerExpired, wait);
    }

    return result;
  };
}
