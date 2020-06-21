import { Observable } from '../Observable.ts';
import { BehaviorSubject } from '../BehaviorSubject.ts';
import { multicast } from './multicast.ts';
import { ConnectableObservable } from '../observable/ConnectableObservable.ts';
import { UnaryFunction } from '../types.ts';

/**
 * @param value
 * @return {ConnectableObservable<T>}
 * @name publishBehavior
 */
export function publishBehavior<T>(value: T):  UnaryFunction<Observable<T>, ConnectableObservable<T>> {
  return (source: Observable<T>) => multicast(new BehaviorSubject<T>(value))(source) as ConnectableObservable<T>;
}
