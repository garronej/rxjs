import { Operator } from '../Operator.ts';
import { Subscriber } from '../Subscriber.ts';
import { Observable } from '../Observable.ts';
import { Subject } from '../Subject.ts';
import { Subscription } from '../Subscription.ts';

import { OuterSubscriber } from '../OuterSubscriber.ts';
import { InnerSubscriber } from '../InnerSubscriber.ts';
import { subscribeToResult } from '../util/subscribeToResult.ts';

import { MonoTypeOperatorFunction, TeardownLogic } from '../types.ts';

/**
 * Returns an Observable that mirrors the source Observable with the exception of a `complete`. If the source
 * Observable calls `complete`, this method will emit to the Observable returned from `notifier`. If that Observable
 * calls `complete` or `error`, then this method will call `complete` or `error` on the child subscription. Otherwise
 * this method will resubscribe to the source Observable.
 *
 * ![](repeatWhen.png)
 *
 * ## Example
 * Repeat a message stream on click
 * ```ts
 * import { of, fromEvent } from 'rxjs DENOIFY: DEPENDENCY UNMET (BUILTIN)';
 * import { repeatWhen } from 'rxjs/operators DENOIFY: DEPENDENCY UNMET (BUILTIN)';
 *
 * const source = of('Repeat message');
 * const documentClick$ = fromEvent(document, 'click');
 *
 * source.pipe(repeatWhen(() => documentClick$)
 * ).subscribe(data => console.log(data))
 * ```
 * @see {@link repeat}
 * @see {@link retry}
 * @see {@link retryWhen}
 *
 * @param {function(notifications: Observable): Observable} notifier - Receives an Observable of notifications with
 * which a user can `complete` or `error`, aborting the repetition.
 * @return {Observable} The source Observable modified with repeat logic.
 * @name repeatWhen
 */
export function repeatWhen<T>(notifier: (notifications: Observable<any>) => Observable<any>): MonoTypeOperatorFunction<T> {
  return (source: Observable<T>) => source.lift(new RepeatWhenOperator(notifier));
}

class RepeatWhenOperator<T> implements Operator<T, T> {
  constructor(protected notifier: (notifications: Observable<any>) => Observable<any>) {
  }

  call(subscriber: Subscriber<T>, source: any): TeardownLogic {
    return source.subscribe(new RepeatWhenSubscriber(subscriber, this.notifier, source));
  }
}

/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class RepeatWhenSubscriber<T, R> extends OuterSubscriber<T, R> {

  private notifications: Subject<void> | null = null;
  private retries: Observable<any> | null = null;
  private retriesSubscription: Subscription | null | undefined = null;
  private sourceIsBeingSubscribedTo: boolean = true;

  constructor(destination: Subscriber<R>,
              private notifier: (notifications: Observable<any>) => Observable<any>,
              private source: Observable<T>) {
    super(destination);
  }

  notifyNext(outerValue: T, innerValue: R,
             outerIndex: number, innerIndex: number,
             innerSub: InnerSubscriber<T, R>): void {
    this.sourceIsBeingSubscribedTo = true;
    this.source.subscribe(this);
  }

  notifyComplete(innerSub: InnerSubscriber<T, R>): void {
    if (this.sourceIsBeingSubscribedTo === false) {
      return super.complete();
    }
  }

  complete() {
    this.sourceIsBeingSubscribedTo = false;

    if (!this.isStopped) {
      if (!this.retries) {
        this.subscribeToRetries();
      }
      if (!this.retriesSubscription || this.retriesSubscription.closed) {
        return super.complete();
      }

      this._unsubscribeAndRecycle();
      this.notifications!.next();
    }
  }

  /** @deprecated This is an internal implementation detail, do not use. */
  _unsubscribe() {
    const { notifications, retriesSubscription } = this;
    if (notifications) {
      notifications.unsubscribe();
      this.notifications = null;
    }
    if (retriesSubscription) {
      retriesSubscription.unsubscribe();
      this.retriesSubscription = null;
    }
    this.retries = null;
  }

  /** @deprecated This is an internal implementation detail, do not use. */
  _unsubscribeAndRecycle(): Subscriber<T> {
    const { _unsubscribe } = this;

    this._unsubscribe = null!;
    super._unsubscribeAndRecycle();
    this._unsubscribe = _unsubscribe;

    return this;
  }

  private subscribeToRetries() {
    this.notifications = new Subject();
    let retries;
    try {
      const { notifier } = this;
      retries = notifier(this.notifications);
    } catch (e) {
      return super.complete();
    }
    this.retries = retries;
    this.retriesSubscription = subscribeToResult(this, retries);
  }
}