import type { Context } from 'hono';
import { openModal } from '../../slack/api';
import type { SlashCommandPayload } from '../../slack/types';
import { createNazoModal } from './modal';

export const nazoCommand = async (c: Context<{ Bindings: Env }>, payload: SlashCommandPayload): Promise<Response> => {
  const triggerId = payload.trigger_id;
  const channelId = payload.channel_id;
  const env = c.env;

  // Modal を開く
  await openModal(env.SLACK_BOT_TOKEN, triggerId, createNazoModal(channelId));

  // 即座に空レスポンス
  return c.body(null, 200);
};
