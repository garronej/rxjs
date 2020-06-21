import { Subscriber } from '../Subscriber.ts';
import { rxSubscriber as rxSubscriberSymbol } from '../symbol/rxSubscriber.ts';
import { empty as emptyObserver } from '../Observer.ts';
import { PartialObserver } from '../types.ts';

export function toSubscriber<T>(
  nextOrObserver?: PartialObserver<T> | ((value: T) => void) | null,
  error?: ((error: any) => void) | null,
  complete?: (() => void) | null): Subscriber<T> {

  if (nextOrObserver) {
    if (nextOrObserver instanceof Subscriber) {
      return (<Subscriber<T>> nextOrObserver);
    }

    if ((nextOrObserver as any)[rxSubscriberSymbol]) {
      return (nextOrObserver as any)[rxSubscriberSymbol]();
    }
  }

  if (!nextOrObserver && !error && !complete) {
    return new Subscriber(emptyObserver);
  }

  return new Subscriber(nextOrObserver, error, complete);
}
