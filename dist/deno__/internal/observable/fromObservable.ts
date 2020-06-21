import { Observable } from '../Observable.ts';
import { subscribeToObservable } from '../util/subscribeToObservable.ts';
import { InteropObservable, SchedulerLike } from '../types.ts';
import { scheduleObservable } from '../scheduled/scheduleObservable.ts';

export function fromObservable<T>(input: InteropObservable<T>, scheduler?: SchedulerLike) {
  if (!scheduler) {
    return new Observable<T>(subscribeToObservable(input));
  } else {
    return scheduleObservable(input, scheduler);
  }
}
