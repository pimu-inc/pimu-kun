import type { Block, ModalView, Option } from '../../slack/types';
import { describeNextFire, describeSchedule } from './functions/describe-reminder';
import { type Reminder, type ReminderType, WEEKDAY_LABELS } from './types';

export const CALLBACK_CREATE = 'reminder_create';
export const ACTION_MODE = 'reminder_mode';
export const ACTION_DELETE = 'reminder_delete';

export type Mode = ReminderType | 'list' | '';

export type HomeMetadata = {
  mode: Mode;
};

const MODE_OPTIONS: Option[] = [
  { text: { type: 'plain_text', text: '毎日' }, value: 'daily' },
  { text: { type: 'plain_text', text: '毎週' }, value: 'weekly' },
  { text: { type: 'plain_text', text: '毎月' }, value: 'monthly' },
  { text: { type: 'plain_text', text: '特定の日時' }, value: 'once' },
  { text: { type: 'plain_text', text: '設定中の一覧・削除' }, value: 'list' },
];

const weekdayOptions = (): Option[] =>
  WEEKDAY_LABELS.map((label, i) => ({ text: { type: 'plain_text', text: `${label}曜` }, value: String(i) }));

const dayOfMonthOptions = (): Option[] => [
  ...Array.from({ length: 31 }, (_, i) => ({
    text: { type: 'plain_text' as const, text: `${i + 1}日` },
    value: String(i + 1),
  })),
  { text: { type: 'plain_text', text: '末日' }, value: '0' },
];

const broadcastOptions = (): Option[] => [
  { text: { type: 'plain_text', text: '@here' }, value: 'here' },
  { text: { type: 'plain_text', text: '@channel' }, value: 'channel' },
];

const modeSelectBlock = (mode: Mode): Block => {
  const initial = MODE_OPTIONS.find((o) => o.value === mode);
  return {
    type: 'actions',
    block_id: 'mode_block',
    elements: [
      {
        type: 'static_select',
        action_id: ACTION_MODE,
        options: MODE_OPTIONS,
        placeholder: { type: 'plain_text', text: 'やりたいことを選択' },
        ...(initial ? { initial_option: initial } : {}),
      },
    ],
  };
};

const messageBlock = (): Block => ({
  type: 'input',
  block_id: 'message_block',
  label: { type: 'plain_text', text: 'メッセージ' },
  element: {
    type: 'plain_text_input',
    action_id: 'message',
    multiline: true,
    placeholder: { type: 'plain_text', text: 'リマインドする内容' },
  },
});

const channelBlock = (): Block => ({
  type: 'input',
  block_id: 'channel_block',
  label: { type: 'plain_text', text: '通知先チャンネル' },
  element: {
    type: 'conversations_select',
    action_id: 'channel',
    default_to_current_conversation: true,
    placeholder: { type: 'plain_text', text: 'チャンネルを選択' },
  },
});

const timeBlock = (): Block => ({
  type: 'input',
  block_id: 'time_block',
  label: { type: 'plain_text', text: '時刻' },
  element: {
    type: 'timepicker',
    action_id: 'time',
    initial_time: '09:00',
    placeholder: { type: 'plain_text', text: '時刻を選択' },
  },
});

const weekdayBlock = (): Block => ({
  type: 'input',
  block_id: 'weekday_block',
  label: { type: 'plain_text', text: '曜日' },
  element: {
    type: 'static_select',
    action_id: 'weekday',
    options: weekdayOptions(),
    placeholder: { type: 'plain_text', text: '曜日を選択' },
  },
});

const dayOfMonthBlock = (): Block => ({
  type: 'input',
  block_id: 'dom_block',
  label: { type: 'plain_text', text: '日' },
  element: {
    type: 'static_select',
    action_id: 'dom',
    options: dayOfMonthOptions(),
    placeholder: { type: 'plain_text', text: '日を選択' },
  },
});

const dateBlock = (): Block => ({
  type: 'input',
  block_id: 'date_block',
  label: { type: 'plain_text', text: '日付' },
  element: {
    type: 'datepicker',
    action_id: 'date',
    placeholder: { type: 'plain_text', text: '日付を選択' },
  },
});

const mentionUsersBlock = (): Block => ({
  type: 'input',
  block_id: 'mention_users_block',
  optional: true,
  label: { type: 'plain_text', text: 'メンション対象' },
  element: {
    type: 'multi_users_select',
    action_id: 'mention_users',
    placeholder: { type: 'plain_text', text: 'メンションするユーザー（任意）' },
  },
});

const broadcastBlock = (): Block => ({
  type: 'input',
  block_id: 'broadcast_block',
  optional: true,
  label: { type: 'plain_text', text: '全体へのメンション' },
  element: {
    type: 'static_select',
    action_id: 'broadcast',
    options: broadcastOptions(),
    placeholder: { type: 'plain_text', text: 'なし（任意）' },
  },
});

const createBlocks = (mode: ReminderType): Block[] => {
  const scheduleBlocks: Block[] = [];
  if (mode === 'weekly') scheduleBlocks.push(weekdayBlock());
  if (mode === 'monthly') scheduleBlocks.push(dayOfMonthBlock());
  if (mode === 'once') scheduleBlocks.push(dateBlock());
  scheduleBlocks.push(timeBlock());
  return [...scheduleBlocks, messageBlock(), mentionUsersBlock(), broadcastBlock(), channelBlock()];
};

const listBlocks = (reminders: Reminder[]): Block[] => {
  if (reminders.length === 0) {
    return [{ type: 'section', text: { type: 'mrkdwn', text: '設定中のリマインダーはありません。' } }];
  }
  return reminders.flatMap((r): Block[] => [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*${describeSchedule(r)}*\n${r.message}\n<#${r.channelId}> ・ 次回: ${describeNextFire(r)}`,
      },
      accessory: {
        type: 'button',
        action_id: ACTION_DELETE,
        text: { type: 'plain_text', text: '削除' },
        value: r.id,
        style: 'danger',
      },
    },
    { type: 'divider' },
  ]);
};

// home モーダル。mode に応じて中身を切り替える。
// reminders は list モードでのみ使用する。
export const buildRemindModal = (mode: Mode, reminders: Reminder[] = []): ModalView => {
  const blocks: Block[] = [modeSelectBlock(mode), { type: 'divider' }];

  let withSubmit = false;
  if (mode === 'list') {
    blocks.push(...listBlocks(reminders));
  } else if (mode === '') {
    blocks.push({
      type: 'context',
      elements: [{ type: 'mrkdwn', text: '上のメニューから操作を選んでください。' }],
    });
  } else {
    blocks.push(...createBlocks(mode));
    withSubmit = true;
  }

  const metadata: HomeMetadata = { mode };
  return {
    type: 'modal',
    callback_id: CALLBACK_CREATE,
    title: { type: 'plain_text', text: 'リマインダー' },
    ...(withSubmit ? { submit: { type: 'plain_text', text: '作成' } } : {}),
    close: { type: 'plain_text', text: '閉じる' },
    private_metadata: JSON.stringify(metadata),
    blocks,
  };
};
