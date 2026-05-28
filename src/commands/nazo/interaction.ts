import type { Context } from 'hono';
import { postMessage } from '../../slack/api';
import type { SlackResponse, StateValues, ViewSubmissionPayload } from '../../slack/types';
import { answerHandler } from './handlers/answer-handler';
import { startHandler } from './handlers/start-handler';

const getSelectValue = (values: StateValues, blockId: string, actionId: string): string | null => {
  const block = values[blockId];
  if (!block) return null;
  const action = block[actionId];
  if (!action || action.type !== 'static_select') return null;
  return action.selected_option?.value ?? null;
};

const getTextValue = (values: StateValues, blockId: string, actionId: string): string | null => {
  const block = values[blockId];
  if (!block) return null;
  const action = block[actionId];
  if (!action || action.type !== 'plain_text_input') return null;
  return action.value ?? null;
};

export const handleNazoInteraction = async (
  c: Context<{ Bindings: Env }>,
  payload: ViewSubmissionPayload
): Promise<Response> => {
  const values = payload.view.state.values;
  const env = c.env;

  const action = getSelectValue(values, 'action_block', 'action');
  const firstAnswer = getTextValue(values, 'first_answer_block', 'first_answer');
  const secondAnswer = getTextValue(values, 'second_answer_block', 'second_answer');

  let result: SlackResponse;

  switch (action) {
    case 'start':
      result = await startHandler();
      break;
    case 'answer':
      result = await answerHandler({ firstAnswer, secondAnswer });
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
