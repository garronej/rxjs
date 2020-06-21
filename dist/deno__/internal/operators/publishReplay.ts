import { Observable } from '../Observable.ts';
import { ReplaySubject } from '../ReplaySubject.ts';
import { multicast } from './multicast.ts';
import { ConnectableObservable } from '../observable/ConnectableObservable.ts';
import { UnaryFunction, MonoTypeOperatorFunction, OperatorFunction, SchedulerLike, ObservableInput, ObservedValueOf } from '../types.ts';

/* tslint:disable:max-line-length */
export function publishReplay<T>(bufferSize?: number, windowTime?: number, scheduler?: SchedulerLike): MonoTypeOperatorFunction<T>;
export function publishReplay<T, O extends ObservableInput<any>>(bufferSize?: number, windowTime?: number, selector?: (shared: Observable<T>) => O, scheduler?: SchedulerLike): OperatorFunction<T, ObservedValueOf<O>>;
/* tslint:enable:max-line-length */

export function publishReplay<T, R>(bufferSize?: number,
                                    windowTime?: number,
                                    selectorOrScheduler?: SchedulerLike | OperatorFunction<T, R>,
                                    scheduler?: SchedulerLike): UnaryFunction<Observable<T>, ConnectableObservable<R>> {

  if (selectorOrScheduler && typeof selectorOrScheduler !== 'function') {
    scheduler = selectorOrScheduler;
  }

  const selector = typeof selectorOrScheduler === 'function' ? selectorOrScheduler : undefined;
  const subject = new ReplaySubject<T>(bufferSize, windowTime, scheduler);

  return (source: Observable<T>) => multicast(() => subject, selector!)(source) as ConnectableObservable<R>;
}
