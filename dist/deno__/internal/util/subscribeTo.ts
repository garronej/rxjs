import { ObservableInput } from '../types.ts';
import { subscribeToArray } from './subscribeToArray.ts';
import { subscribeToPromise } from './subscribeToPromise.ts';
import { subscribeToIterable } from './subscribeToIterable.ts';
import { subscribeToObservable } from './subscribeToObservable.ts';
import { isArrayLike } from './isArrayLike.ts';
import { isPromise } from './isPromise.ts';
import { isObject } from './isObject.ts';
import { iterator as Symbol_iterator } from '../symbol/iterator.ts';
import { observable as Symbol_observable } from '../symbol/observable.ts';
import { Subscription } from '../Subscription.ts';
import { Subscriber } from '../Subscriber.ts';
import { subscribeToAsyncIterable } from './subscribeToAsyncIterable.ts';

export const subscribeTo = <T>(result: ObservableInput<T>): (subscriber: Subscriber<T>) => Subscription | void => {
  if (!!result && typeof (result as any)[Symbol_observable] === 'function') {
    return subscribeToObservable(result as any);
  } else if (isArrayLike(result)) {
    return subscribeToArray(result);
  } else if (isPromise(result)) {
    return subscribeToPromise(result);
  } else if (!!result && typeof (result as any)[Symbol_iterator] === 'function') {
    return subscribeToIterable(result as any);
  } else if (
    Symbol && Symbol.asyncIterator &&
    !!result && typeof (result as any)[Symbol.asyncIterator] === 'function'
  ) {
    return subscribeToAsyncIterable(result as any);
  } else {
    const value = isObject(result) ? 'an invalid object' : `'${result}'`;
    const msg = `You provided ${value} where a stream was expected.`
      + ' You can provide an Observable, Promise, Array, or Iterable.';
    throw new TypeError(msg);
  }
};
