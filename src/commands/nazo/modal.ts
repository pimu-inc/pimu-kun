import type { ModalView, Option } from '../../slack/types';

const ACTION_OPTIONS: Option[] = [
  { text: { type: 'plain_text', text: '謎を見る' }, value: 'start' },
  { text: { type: 'plain_text', text: '答える' }, value: 'answer' },
];

export const createNazoModal = (channelId: string): ModalView => {
  return {
    type: 'modal',
    callback_id: 'nazo_modal',
    title: { type: 'plain_text', text: '謎解き' },
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
      {
        type: 'input',
        block_id: 'first_answer_block',
        label: { type: 'plain_text', text: '1問目の答え' },
        element: {
          type: 'plain_text_input',
          action_id: 'first_answer',
          placeholder: { type: 'plain_text', text: '1問目の答えを入力' },
        },
        optional: true,
      },
      {
        type: 'input',
        block_id: 'second_answer_block',
        label: { type: 'plain_text', text: '2問目の答え' },
        element: {
          type: 'plain_text_input',
          action_id: 'second_answer',
          placeholder: { type: 'plain_text', text: '2問目の答えを入力' },
        },
        optional: true,
      },
    ],
  };
};
