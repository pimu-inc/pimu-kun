import { omikuziBuilder } from './omikuzi/builder';
import { omikuziHandler } from './omikuzi/handler';
import { timeBuilder } from './time/builder';
import { timeHandler } from './time/handler';

export const commands = [timeBuilder, omikuziBuilder];
export const handlers = {
  time: timeHandler,
  omikuzi: omikuziHandler,
};
