import { scheduleObservable } from './scheduleObservable.ts';
import { schedulePromise } from './schedulePromise.ts';
import { scheduleArray } from './scheduleArray.ts';
import { scheduleIterable } from './scheduleIterable.ts';
import { isInteropObservable } from '../util/isInteropObservable.ts';
import { isPromise } from '../util/isPromise.ts';
import { isArrayLike } from '../util/isArrayLike.ts';
import { isIterable } from '../util/isIterable.ts';
import { ObservableInput, SchedulerLike } from '../types.ts';
import { Observable } from '../Observable.ts';
import { scheduleAsyncIterable } from './scheduleAsyncIterable.ts';

/**
 * Converts from a common {@link ObservableInput} type to an observable where subscription and emissions
 * are scheduled on the provided scheduler.
 *
 * @see {@link from}
 * @see {@link of}
 *
 * @param input The observable, array, promise, iterable, etc you would like to schedule
 * @param scheduler The scheduler to use to schedule the subscription and emissions from
 * the returned observable.
 */
export function scheduled<T>(input: ObservableInput<T>, scheduler: SchedulerLike): Observable<T> {
  if (input != null) {
    if (isInteropObservable(input)) {
      return scheduleObservable(input, scheduler);
    } else if (isPromise(input)) {
      return schedulePromise(input, scheduler);
    } else if (isArrayLike(input)) {
      return scheduleArray(input, scheduler);
    }  else if (isIterable(input) || typeof input === 'string') {
      return scheduleIterable(input, scheduler);
    } else if (Symbol && Symbol.asyncIterator && typeof (input as any)[Symbol.asyncIterator] === 'function') {
      return scheduleAsyncIterable(input as any, scheduler);
    }
  }
  throw new TypeError((input !== null && typeof input || input) + ' is not observable');
}
