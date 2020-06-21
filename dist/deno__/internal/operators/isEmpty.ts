import { Operator } from '../Operator.ts';
import { Subscriber } from '../Subscriber.ts';
import { Observable } from '../Observable.ts';
import { OperatorFunction } from '../types.ts';

/**
 * Emits `false` if the input Observable emits any values, or emits `true` if the
 * input Observable completes without emitting any values.
 *
 * <span class="informal">Tells whether any values are emitted by an Observable.</span>
 *
 * ![](isEmpty.png)
 *
 * `isEmpty` transforms an Observable that emits values into an Observable that
 * emits a single boolean value representing whether or not any values were
 * emitted by the source Observable. As soon as the source Observable emits a
 * value, `isEmpty` will emit a `false` and complete.  If the source Observable
 * completes having not emitted anything, `isEmpty` will emit a `true` and
 * complete.
 *
 * A similar effect could be achieved with {@link count}, but `isEmpty` can emit
 * a `false` value sooner.
 *
 * ## Examples
 *
 * Emit `false` for a non-empty Observable.
 *
 * ```ts
 * import { Subject } from 'rxjs DENOIFY: DEPENDENCY UNMET (BUILTIN)';
 * import { isEmpty } from 'rxjs/operators DENOIFY: DEPENDENCY UNMET (BUILTIN)';
 *
 * const source = new Subject<string>();
 * const result = source.pipe(isEmpty());
 *
 * source.subscribe(x => console.log(x));
 * result.subscribe(x => console.log(x));
 *
 * source.next('a');
 * source.next('b');
 * source.next('c');
 * source.complete();
 *
 * // Outputs
 * // a
 * // false
 * // b
 * // c
 * ```
 *
 * Emit `true` for an empty Observable.
 *
 * ```ts
 * import { EMPTY } from 'rxjs DENOIFY: DEPENDENCY UNMET (BUILTIN)';
 * import { isEmpty } from 'rxjs/operators DENOIFY: DEPENDENCY UNMET (BUILTIN)';
 *
 * const result = EMPTY.pipe(isEmpty());
 * result.subscribe(x => console.log(x));
 *
 * // Outputs
 * // true
 * ```
 *
 * @see {@link count}
 * @see {@link index/EMPTY}
 *
 * @return {OperatorFunction<T, boolean>} An Observable of a boolean value indicating whether observable was empty or not.
 * @name isEmpty
 */

export function isEmpty<T>(): OperatorFunction<T, boolean> {
  return (source: Observable<T>) => source.lift(new IsEmptyOperator());
}

class IsEmptyOperator implements Operator<any, boolean> {
  call (observer: Subscriber<boolean>, source: any): any {
    return source.subscribe(new IsEmptySubscriber(observer));
  }
}

/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class IsEmptySubscriber extends Subscriber<any> {
  constructor(destination: Subscriber<boolean>) {
    super(destination);
  }

  private notifyComplete(isEmpty: boolean): void {
    const destination = this.destination;

    destination.next(isEmpty);
    destination.complete();
  }

  protected _next(value: boolean) {
    this.notifyComplete(false);
  }

  protected _complete() {
    this.notifyComplete(true);
  }
}
