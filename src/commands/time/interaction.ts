import type { Context } from 'hono';
import { postMessage } from '../../slack/api';
import type { SelectValue, SlackResponse, TextValue, ViewSubmissionPayload } from '../../slack/types';
import { breakEndHandler } from './handlers/break-end-handler';
import { breakStartHandler } from './handlers/break-start-handler';
import { createProjectHandler } from './handlers/create-project-handler';
import { endHandler } from './handlers/end-handler';
import { listHandler } from './handlers/list-handler';
import { startHandler } from './handlers/start-handler';

const getSelectValue = (
  values: Record<string, Record<string, SelectValue | TextValue>>,
  blockId: string,
  actionId: string
): string | null => {
  const block = values[blockId];
  if (!block) return null;
  const action = block[actionId];
  if (!action || action.type !== 'static_select') return null;
  return action.selected_option?.value ?? null;
};

const getTextValue = (
  values: Record<string, Record<string, SelectValue | TextValue>>,
  blockId: string,
  actionId: string
): string | null => {
  const block = values[blockId];
  if (!block) return null;
  const action = block[actionId];
  if (!action || action.type !== 'plain_text_input') return null;
  return action.value ?? null;
};

export const handleTimeInteraction = async (
  c: Context<{ Bindings: Env }>,
  payload: ViewSubmissionPayload
): Promise<Response> => {
  const values = payload.view.state.values;
  const userId = payload.user.id;
  const userName = payload.user.name;
  const env = c.env;

  const action = getSelectValue(values, 'action_block', 'action');
  const project = getSelectValue(values, 'project_block', 'project');
  const newProjectName = getTextValue(values, 'project_name_block', 'project_name');
  const memo = getTextValue(values, 'memo_block', 'memo') ?? '';

  let result: SlackResponse;

  switch (action) {
    case 'start':
      result = await startHandler({
        projectName: project ?? '',
        memo,
        userId,
        userName,
        env,
      });
      break;
    case 'end':
      result = await endHandler({
        projectName: project ?? '',
        userId,
        userName,
        env,
      });
      break;
    case 'break_start':
      result = await breakStartHandler({
        projectName: project ?? '',
        userId,
        userName,
        env,
      });
      break;
    case 'break_end':
      result = await breakEndHandler({
        projectName: project ?? '',
        userId,
        userName,
        env,
      });
      break;
    case 'create_project':
      result = await createProjectHandler({
        projectName: newProjectName ?? '',
        env,
      });
      break;
    case 'list':
      result = await listHandler({ env });
      break;
    default:
      result = { text: '不明なアクションです' };
  }

  // private_metadata から channel_id を取得してメッセージを送信
  const metadata = JSON.parse(payload.view.private_metadata || '{}') as { channel_id?: string };
  const channelId = metadata.channel_id;

  if (channelId) {
    const postResult = await postMessage(env.SLACK_BOT_TOKEN, channelId, result);

    // 投稿に失敗した場合はエラーを返す
    if (!postResult.ok) {
      return c.json({
        response_action: 'errors',
        errors: {
          action_block: `メッセージの投稿に失敗しました: ${postResult.error}`,
        },
      });
    }
  }

  // Modal を閉じる
  return c.body(null, 200);
};
