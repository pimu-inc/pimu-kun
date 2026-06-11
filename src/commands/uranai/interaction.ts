import type { Context } from 'hono';
import type { StateValues, ViewSubmissionPayload } from '../../slack/types';
import { listProfiles, saveProfile } from './functions/profiles';
import { runReading } from './functions/run-reading';
import { CALLBACK_REGISTER, CALLBACK_SELECT, buildSelectModal } from './modal';
import type { UranaiMetadata } from './types';

const getText = (values: StateValues, blockId: string, actionId: string): string | null => {
  const action = values[blockId]?.[actionId];
  if (!action || action.type !== 'plain_text_input') return null;
  return action.value ?? null;
};

const getDate = (values: StateValues, blockId: string, actionId: string): string | null => {
  const action = values[blockId]?.[actionId];
  if (!action || action.type !== 'datepicker') return null;
  return action.selected_date ?? null;
};

const getSelect = (values: StateValues, blockId: string, actionId: string): string | null => {
  const action = values[blockId]?.[actionId];
  if (!action || action.type !== 'static_select') return null;
  return action.selected_option?.value ?? null;
};

// 登録フォーム送信 → 保存して鑑定モーダルに戻す(登録した人が選べる状態)
const handleRegister = async (c: Context<{ Bindings: Env }>, payload: ViewSubmissionPayload): Promise<Response> => {
  const env = c.env;
  const values = payload.view.state.values;

  const name = getText(values, 'name_block', 'name')?.trim();
  const birthday = getDate(values, 'birthday_block', 'birthday');

  if (!name) {
    return c.json({ response_action: 'errors', errors: { name_block: '名前を入力してください' } });
  }
  if (!birthday) {
    return c.json({ response_action: 'errors', errors: { birthday_block: '生年月日を選択してください' } });
  }

  await saveProfile(env, { name, birthday, registeredBy: payload.user.id });

  const profiles = await listProfiles(env);
  return c.json({
    response_action: 'update',
    view: buildSelectModal(
      profiles,
      payload.view.private_metadata,
      `✅ *${name}* さんを登録しました!そのまま鑑定できます。`
    ),
  });
};

// 鑑定モーダル送信 → 裏で生成してチャンネルへ投稿(モーダルは閉じる)
const handleSelect = (c: Context<{ Bindings: Env }>, payload: ViewSubmissionPayload): Response => {
  const values = payload.view.state.values;
  const targetId = getSelect(values, 'target_block', 'target');
  if (!targetId) {
    return c.json({ response_action: 'errors', errors: { target_block: '占う人を選んでください' } });
  }

  const { channelId } = JSON.parse(payload.view.private_metadata || '{}') as UranaiMetadata;
  c.executionCtx.waitUntil(runReading(c.env, channelId, targetId));
  return c.body(null, 200);
};

export const handleUranaiInteraction = async (
  c: Context<{ Bindings: Env }>,
  payload: ViewSubmissionPayload
): Promise<Response> => {
  switch (payload.view.callback_id) {
    case CALLBACK_REGISTER:
      return await handleRegister(c, payload);
    case CALLBACK_SELECT:
      return handleSelect(c, payload);
    default:
      return c.body(null, 200);
  }
};
