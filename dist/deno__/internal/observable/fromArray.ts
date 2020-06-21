import { Observable } from '../Observable.ts';
import { SchedulerLike } from '../types.ts';
import { subscribeToArray } from '../util/subscribeToArray.ts';
import { scheduleArray } from '../scheduled/scheduleArray.ts';

export function fromArray<T>(input: ArrayLike<T>, scheduler?: SchedulerLike) {
  if (!scheduler) {
    return new Observable<T>(subscribeToArray(input));
  } else {
    return scheduleArray(input, scheduler);
  }
}
