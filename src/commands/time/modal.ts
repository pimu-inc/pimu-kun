import type { ModalView, Option } from '../../slack/types';

const ACTION_OPTIONS: Option[] = [
  { text: { type: 'plain_text', text: '勤務開始' }, value: 'start' },
  { text: { type: 'plain_text', text: '勤務終了' }, value: 'end' },
  { text: { type: 'plain_text', text: '休憩開始' }, value: 'break_start' },
  { text: { type: 'plain_text', text: '休憩終了' }, value: 'break_end' },
  { text: { type: 'plain_text', text: 'プロジェクト作成' }, value: 'create_project' },
  { text: { type: 'plain_text', text: '一覧表示' }, value: 'list' },
];

export const createTimeModal = (projects: string[], channelId: string): ModalView => {
  const projectOptions: Option[] = projects.map((p) => ({
    text: { type: 'plain_text', text: p },
    value: p,
  }));

  return {
    type: 'modal',
    callback_id: 'time_modal',
    title: { type: 'plain_text', text: '勤怠管理' },
    submit: { type: 'plain_text', text: '送信' },
    close: { type: 'plain_text', text: 'キャンセル' },
    private_metadata: JSON.stringify({ channel_id: channelId }),
    blocks: [
      {
        type: 'input',
        block_id: 'action_block',
        label: { type: 'plain_text', text: 'アクション' },
        element: {
          type: 'static_select',
          action_id: 'action',
          options: ACTION_OPTIONS,
          placeholder: { type: 'plain_text', text: 'アクションを選択' },
        },
      },
      ...(projectOptions.length > 0
        ? [
            {
              type: 'input' as const,
              block_id: 'project_block',
              label: { type: 'plain_text' as const, text: 'プロジェクト' },
              element: {
                type: 'static_select' as const,
                action_id: 'project',
                options: projectOptions,
                placeholder: { type: 'plain_text' as const, text: 'プロジェクトを選択' },
              },
              optional: true,
            },
          ]
        : []),
      {
        type: 'input',
        block_id: 'project_name_block',
        label: { type: 'plain_text', text: '新規プロジェクト名' },
        element: {
          type: 'plain_text_input',
          action_id: 'project_name',
          placeholder: { type: 'plain_text', text: 'プロジェクト作成時のみ入力' },
        },
        optional: true,
      },
      {
        type: 'input',
        block_id: 'memo_block',
        label: { type: 'plain_text', text: 'メモ' },
        element: {
          type: 'plain_text_input',
          action_id: 'memo',
          placeholder: { type: 'plain_text', text: '作業内容など' },
        },
        optional: true,
      },
    ],
  };
};
