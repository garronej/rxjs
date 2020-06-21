import { Subscription } from '../Subscription.ts';
import { InnerSubscriber } from '../InnerSubscriber.ts';
import { OuterSubscriber } from '../OuterSubscriber.ts';
import { Subscriber } from '../Subscriber.ts';
import { subscribeTo } from './subscribeTo.ts';
import { Observable } from '../Observable.ts';

export function subscribeToResult<T, R>(
  outerSubscriber: OuterSubscriber<T, R>,
  result: any,
  outerValue: undefined,
  outerIndex: undefined,
  innerSubscriber: InnerSubscriber<T, R>
): Subscription | undefined;

export function subscribeToResult<T, R>(
  outerSubscriber: OuterSubscriber<T, R>,
  result: any,
  outerValue?: T,
  outerIndex?: number
): Subscription | undefined;

export function subscribeToResult<T, R>(
  outerSubscriber: OuterSubscriber<T, R>,
  result: any,
  outerValue?: T,
  outerIndex?: number,
  innerSubscriber: Subscriber<R> = new InnerSubscriber(outerSubscriber, outerValue, outerIndex!)
): Subscription | undefined {
  if (innerSubscriber.closed) {
    return undefined;
  }
  if (result instanceof Observable) {
    return result.subscribe(innerSubscriber);
  }
  return subscribeTo(result)(innerSubscriber) as Subscription;
}
