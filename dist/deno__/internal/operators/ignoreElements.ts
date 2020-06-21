import { Observable } from '../Observable.ts';
import { Operator } from '../Operator.ts';
import { Subscriber } from '../Subscriber.ts';
import { OperatorFunction } from '../types.ts';

/**
 * Ignores all items emitted by the source Observable and only passes calls of `complete` or `error`.
 *
 * ![](ignoreElements.png)
 *
 * The _IgnoreElements_ operator suppresses all of the items emitted by the source Observable,
 * but allows its termination notification (either `error` or `complete`) to pass through unchanged.
 *
 * If you do not care about the items being emitted by an Observable, but you do want to be notified
 * when it completes or when it terminates with an error, you can apply the `ignoreElements` operator
 * to the Observable, which will ensure that it will never call its observers’ `next` handlers.
 *
 * ## Examples
 * ```ts
 * import { of } from 'rxjs DENOIFY: DEPENDENCY UNMET (BUILTIN)';
 * import { ignoreElements } from 'rxjs/operators DENOIFY: DEPENDENCY UNMET (BUILTIN)';
 *
 * of('you', 'talking', 'to', 'me').pipe(
 *   ignoreElements(),
 * )
 * .subscribe(
 *   word => console.log(word),
 *   err => console.log('error:', err),
 *   () => console.log('the end'),
 * );
 * // result:
 * // 'the end'
 * ```
 * @return {Observable} An empty Observable that only calls `complete`
 * or `error`, based on which one is called by the source Observable.
 * @name ignoreElements
 */
export function ignoreElements(): OperatorFunction<any, never> {
  return function ignoreElementsOperatorFunction(source: Observable<any>) {
    return source.lift(new IgnoreElementsOperator());
  };
}

class IgnoreElementsOperator<T, R> implements Operator<T, R> {
  call(subscriber: Subscriber<R>, source: any): any {
    return source.subscribe(new IgnoreElementsSubscriber(subscriber));
  }
}

/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class IgnoreElementsSubscriber<T> extends Subscriber<T> {
  protected _next(unused: T): void {
    // Do nothing
  }
}
