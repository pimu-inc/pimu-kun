import type { Context } from 'hono';
import { updateModal } from '../../slack/api';
import type { BlockActionsPayload } from '../../slack/types';
import { buildRegisterModal } from './modal';

// 「📝 新しい人を登録する」ボタン → モーダルの中身を登録フォームに差し替える
export const handleUranaiBlockActions = async (
  c: Context<{ Bindings: Env }>,
  payload: BlockActionsPayload
): Promise<Response> => {
  await updateModal(c.env.SLACK_BOT_TOKEN, payload.view.id, buildRegisterModal(payload.view.private_metadata));
  return c.body(null, 200);
};
