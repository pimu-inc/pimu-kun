import type { Context } from 'hono';
import { openModal } from '../../slack/api';
import type { SlashCommandPayload } from '../../slack/types';
import { buildRemindModal } from './modal';

export const remindCommand = async (c: Context<{ Bindings: Env }>, payload: SlashCommandPayload): Promise<Response> => {
  await openModal(c.env.SLACK_BOT_TOKEN, payload.trigger_id, buildRemindModal(''));
  return c.body(null, 200);
};
