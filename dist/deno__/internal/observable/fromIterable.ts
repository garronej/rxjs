import { Observable } from '../Observable.ts';
import { SchedulerLike } from '../types.ts';
import { subscribeToIterable } from '../util/subscribeToIterable.ts';
import { scheduleIterable } from '../scheduled/scheduleIterable.ts';

export function fromIterable<T>(input: Iterable<T>, scheduler?: SchedulerLike) {
  if (!input) {
    throw new Error('Iterable cannot be null');
  }
  if (!scheduler) {
    return new Observable<T>(subscribeToIterable(input));
  } else {
    return scheduleIterable(input, scheduler);
  }
}
