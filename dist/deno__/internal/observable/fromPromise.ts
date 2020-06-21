import { Observable } from '../Observable.ts';
import { SchedulerLike } from '../types.ts';
import { subscribeToPromise } from '../util/subscribeToPromise.ts';
import { schedulePromise } from '../scheduled/schedulePromise.ts';

export function fromPromise<T>(input: PromiseLike<T>, scheduler?: SchedulerLike) {
  if (!scheduler) {
    return new Observable<T>(subscribeToPromise(input));
  } else {
    return schedulePromise(input, scheduler);
  }
}
