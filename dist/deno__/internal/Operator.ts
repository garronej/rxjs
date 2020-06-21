import { Subscriber } from './Subscriber.ts';
import { TeardownLogic } from './types.ts';

export interface Operator<T, R> {
  call(subscriber: Subscriber<R>, source: any): TeardownLogic;
}
