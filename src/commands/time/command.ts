import type { Context } from 'hono';
import { openModal } from '../../slack/api';
import type { SlashCommandPayload } from '../../slack/types';
import { getSheets } from './functions/get-sheets';
import { createTimeModal } from './modal';

export const timeCommand = async (c: Context<{ Bindings: Env }>, payload: SlashCommandPayload): Promise<Response> => {
  const triggerId = payload.trigger_id;
  const channelId = payload.channel_id;
  const env = c.env;

  // プロジェクト一覧を取得
  const sheetsData = await getSheets({ env });
  const projects = Object.keys(sheetsData);

  // Modal を開く
  await openModal(env.SLACK_BOT_TOKEN, triggerId, createTimeModal(projects, channelId));

  // 即座に空レスポンス（Modalを開いたことを示す）
  return c.body(null, 200);
};
