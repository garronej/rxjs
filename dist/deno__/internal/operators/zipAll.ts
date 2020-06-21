import { ZipOperator } from '../observable/zip.ts';
import { Observable } from '../Observable.ts';
import { OperatorFunction, ObservableInput } from '../types.ts';

export function zipAll<T>(): OperatorFunction<ObservableInput<T>, T[]>;
export function zipAll<T>(): OperatorFunction<any, T[]>;
export function zipAll<T, R>(project: (...values: T[]) => R): OperatorFunction<ObservableInput<T>, R>;
export function zipAll<R>(project: (...values: Array<any>) => R): OperatorFunction<any, R>;

export function zipAll<T, R>(project?: (...values: Array<any>) => R): OperatorFunction<T, R> {
  return (source: Observable<T>) => source.lift(new ZipOperator(project));
}
