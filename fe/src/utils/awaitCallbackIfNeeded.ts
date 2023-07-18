/*
 * Copyright 2023 lucdev<lucdev.net>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
