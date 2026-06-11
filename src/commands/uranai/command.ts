import type { Context } from 'hono';
import { openModal } from '../../slack/api';
import type { SlashCommandPayload } from '../../slack/types';
import { listProfiles } from './functions/profiles';
import { buildRegisterModal, buildSelectModal } from './modal';
import type { UranaiMetadata } from './types';

// /uranai → 鑑定モーダルを開く。プロフィールが0件なら登録モーダルから始める。
export const uranaiCommand = async (c: Context<{ Bindings: Env }>, payload: SlashCommandPayload): Promise<Response> => {
  const env = c.env;
  const metadata: UranaiMetadata = { channelId: payload.channel_id };
  const privateMetadata = JSON.stringify(metadata);

  const profiles = await listProfiles(env);
  const view =
    profiles.length === 0 ? buildRegisterModal(privateMetadata) : buildSelectModal(profiles, privateMetadata);

  await openModal(env.SLACK_BOT_TOKEN, payload.trigger_id, view);
  return c.body(null, 200);
};
