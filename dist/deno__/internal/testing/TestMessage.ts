import { Notification } from '../Notification.ts';

export interface TestMessage {
  frame: number;
  notification: Notification<any>;
  isGhost?: boolean;
}
