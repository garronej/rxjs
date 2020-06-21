import { Observer } from './types.ts';
import { config } from './config.ts';
import { hostReportError } from './util/hostReportError.ts';

export const empty: Observer<any> = {
  closed: true,
  next(value: any): void { /* noop */},
  error(err: any): void {
    if (config.useDeprecatedSynchronousErrorHandling) {
      throw err;
    } else {
      hostReportError(err);
    }
  },
  complete(): void { /*noop*/ }
};
