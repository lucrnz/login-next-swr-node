type callbackType<T, U> =
  | ((...args: U[]) => T | Promise<T>)
  | (() => T | Promise<T>);

export default async function awaitCallbackIfNeeded<T, U>(
  callback: callbackType<T, U>,
  callbackArgs: U | U[] | undefined = undefined
) {
  let promiseOrResult: T | Promise<T> | null = null;
  const callbackArgsIsArray = Array.isArray(callbackArgs);

  if (callbackArgs !== undefined && callbackArgsIsArray) {
    promiseOrResult = callback(...callbackArgs);
  } else if (callbackArgs !== undefined && !callbackArgsIsArray) {
    promiseOrResult = callback(callbackArgs);
  } else {
    promiseOrResult = callback();
  }

  return promiseOrResult instanceof Promise
    ? await promiseOrResult
    : promiseOrResult;
}
