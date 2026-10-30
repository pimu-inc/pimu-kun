import { postMessage } from '../slack/api';
import type { Result } from '../types/result';
import type { LineEvent, LineMessage } from './types';

const HEADING = '📩 LINE(TRIPLATE)';

const MESSAGE_LABELS: Record<string, string> = {
  sticker: '[スタンプ]',
  image: '[画像]',
  video: '[動画]',
  audio: '[音声]',
  file: '[ファイル]',
  location: '[位置情報]',
};

// Slack の mrkdwn で制御文字として解釈される & < > をエスケープする(<!channel> などのメンション化を防ぐ)
const escapeSlackText = (text: string): string =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const toQuote = (text: string): string =>
  text
    .split('\n')
    .map((line) => `> ${line}`)
    .join('\n');

const formatMessage = (message: LineMessage): string => {
  const body =
    message.type === 'text' ? escapeSlackText(message.text) : (MESSAGE_LABELS[message.type] ?? '[未対応のメッセージ]');
  return `${HEADING}\n${toQuote(body)}`;
};

const isMessageEvent = (event: LineEvent): event is Extract<LineEvent, { type: 'message' }> =>
  event.type === 'message' && 'message' in event;

type Options = { events: LineEvent[]; env: Env };

// LINE のメッセージイベントを1件ずつ Slack に投稿する。投稿できた件数を返す。
export const forwardLineEventsToSlack = async ({ events, env }: Options): Promise<Result<number>> => {
  const errors: string[] = [];
  let posted = 0;

  for (const event of events) {
    if (!isMessageEvent(event)) {
      continue;
    }

    const response = await postMessage(env.SLACK_BOT_TOKEN, env.LINE_NOTIFY_SLACK_CHANNEL_ID, {
      text: formatMessage(event.message),
    });
    if (response.ok) {
      posted++;
    } else {
      errors.push(response.error ?? 'unknown_error');
    }
  }

  if (errors.length > 0) {
    return { success: false, message: `Failed to forward LINE message to Slack: ${errors.join(', ')}` };
  }
  return { success: true, data: posted };
};
