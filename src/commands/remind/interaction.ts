import type { Context } from 'hono';
import { postMessage } from '../../slack/api';
import type { ViewSubmissionPayload } from '../../slack/types';
import { type CreateReminderInput, createReminder } from './functions/create-reminder';
import { describeNextFire, describeSchedule } from './functions/describe-reminder';
import { getConversation, getDate, getSelect, getText, getTime, getUsers } from './functions/state-values';
import type { HomeMetadata, Mode } from './modal';

// メンション対象を Slack 記法に変換して文言の先頭に付与する
const composeMessage = (message: string, userIds: string[], broadcast: string | null): string => {
  const prefix = [...userIds.map((id) => `<@${id}>`), ...(broadcast ? [`<!${broadcast}>`] : [])].join(' ');
  return prefix ? `${prefix} ${message}` : message;
};

const parseTime = (time: string | null): { hour: number; minute: number } | null => {
  if (!time) return null;
  const parts = time.split(':');
  const hour = Number.parseInt(parts[0] ?? '', 10);
  const minute = Number.parseInt(parts[1] ?? '', 10);
  if (Number.isNaN(hour) || Number.isNaN(minute)) return null;
  return { hour, minute };
};

const errorResponse = (c: Context<{ Bindings: Env }>, block: string, message: string): Response =>
  c.json({ response_action: 'errors', errors: { [block]: message } });

export const handleReminderSubmission = async (
  c: Context<{ Bindings: Env }>,
  payload: ViewSubmissionPayload
): Promise<Response> => {
  const env = c.env;
  const values = payload.view.state.values;
  const meta = JSON.parse(payload.view.private_metadata || '{}') as HomeMetadata;
  const mode = meta.mode as Mode;

  if (mode !== 'daily' && mode !== 'weekly' && mode !== 'monthly' && mode !== 'once') {
    return c.body(null, 200);
  }

  const time = parseTime(getTime(values, 'time_block', 'time'));
  if (!time) return errorResponse(c, 'time_block', '時刻を選択してください。');

  const message = getText(values, 'message_block', 'message');
  if (!message) return errorResponse(c, 'message_block', 'メッセージを入力してください。');

  const channelId = getConversation(values, 'channel_block', 'channel');
  if (!channelId) return errorResponse(c, 'channel_block', '通知先チャンネルを選択してください。');

  const mentionUsers = getUsers(values, 'mention_users_block', 'mention_users');
  const broadcast = getSelect(values, 'broadcast_block', 'broadcast');
  const finalMessage = composeMessage(message, mentionUsers, broadcast);

  const input: CreateReminderInput = {
    type: mode,
    hour: time.hour,
    minute: time.minute,
    message: finalMessage,
    channelId,
    createdBy: payload.user.id,
  };

  if (mode === 'weekly') {
    const weekday = getSelect(values, 'weekday_block', 'weekday');
    if (weekday == null) return errorResponse(c, 'weekday_block', '曜日を選択してください。');
    input.dayOfWeek = Number.parseInt(weekday, 10);
  }
  if (mode === 'monthly') {
    const dom = getSelect(values, 'dom_block', 'dom');
    if (dom == null) return errorResponse(c, 'dom_block', '日を選択してください。');
    input.dayOfMonth = Number.parseInt(dom, 10);
  }
  if (mode === 'once') {
    const date = getDate(values, 'date_block', 'date');
    if (date == null) return errorResponse(c, 'date_block', '日付を選択してください。');
    input.date = date;
  }

  const result = await createReminder(env, input);
  if (!result.success) {
    const block = mode === 'once' ? 'date_block' : 'time_block';
    return errorResponse(c, block, result.message);
  }

  const r = result.data;
  await postMessage(env.SLACK_BOT_TOKEN, r.channelId, {
    text: `:white_check_mark: リマインダーを登録しました\n*${describeSchedule(r)}* — ${r.message}\n次回: ${describeNextFire(r)}`,
  });

  return c.body(null, 200);
};
