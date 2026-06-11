import type { Context } from 'hono';
import type { SlashCommandPayload } from '../slack/types';
import { nazoCommand } from './nazo/command';
import { omikujiCommand } from './omikuji/command';
import { remindCommand } from './remind/command';
import { timeCommand } from './time/command';
import { uranaiCommand } from './uranai/command';

export const handleCommand = async (c: Context<{ Bindings: Env }>, payload: SlashCommandPayload): Promise<Response> => {
  const command = payload.command;

  switch (command) {
    case '/time':
      return await timeCommand(c, payload);
    case '/omikuji':
      return await omikujiCommand(c, payload);
    case '/nazo':
      return await nazoCommand(c, payload);
    case '/reminder':
      return await remindCommand(c, payload);
    case '/uranai':
      return await uranaiCommand(c, payload);
    default:
      return c.json({ text: '不明なコマンドです' });
  }
};
