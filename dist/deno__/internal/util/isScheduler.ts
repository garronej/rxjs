import { SchedulerLike } from '../types.ts';

export function isScheduler(value: any): value is SchedulerLike {
  return value && typeof value.schedule === 'function';
}
