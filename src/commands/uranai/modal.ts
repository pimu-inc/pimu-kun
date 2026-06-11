import type { Block, ModalView, Option } from '../../slack/types';
import type { Profile } from './types';

export const CALLBACK_SELECT = 'uranai_select';
export const CALLBACK_REGISTER = 'uranai_register';
export const ACTION_OPEN_REGISTER = 'uranai_open_register';

// /uranai → 占う人を選ぶモーダル(下部に新規登録ボタン)
export const buildSelectModal = (profiles: Profile[], privateMetadata: string, notice?: string): ModalView => {
  const options: Option[] = profiles.map((p) => ({
    text: { type: 'plain_text', text: p.name },
    value: p.id,
  }));

  const blocks: Block[] = [];

  if (notice) {
    blocks.push({ type: 'section', text: { type: 'mrkdwn', text: notice } });
  }

  blocks.push({
    type: 'input',
    block_id: 'target_block',
    label: { type: 'plain_text', text: '占う人' },
    element: {
      type: 'static_select',
      action_id: 'target',
      options,
      placeholder: { type: 'plain_text', text: 'プロフィールを選択' },
    },
  });

  blocks.push({
    type: 'actions',
    block_id: 'select_actions',
    elements: [
      {
        type: 'button',
        action_id: ACTION_OPEN_REGISTER,
        text: { type: 'plain_text', text: '📝 新しい人を登録する', emoji: true },
      },
    ],
  });

  return {
    type: 'modal',
    callback_id: CALLBACK_SELECT,
    title: { type: 'plain_text', text: '🔮 鑑定' },
    submit: { type: 'plain_text', text: '占ってもらう' },
    close: { type: 'plain_text', text: 'やめる' },
    private_metadata: privateMetadata,
    blocks,
  };
};

// 新しい人を登録するモーダル
export const buildRegisterModal = (privateMetadata: string): ModalView => ({
  type: 'modal',
  callback_id: CALLBACK_REGISTER,
  title: { type: 'plain_text', text: 'プロフィール登録' },
  submit: { type: 'plain_text', text: '登録する' },
  close: { type: 'plain_text', text: 'やめる' },
  private_metadata: privateMetadata,
  blocks: [
    {
      type: 'input',
      block_id: 'name_block',
      label: { type: 'plain_text', text: '名前(表示用ニックネームでOK)' },
      element: {
        type: 'plain_text_input',
        action_id: 'name',
        placeholder: { type: 'plain_text', text: '名前を入力' },
      },
    },
    {
      type: 'input',
      block_id: 'birthday_block',
      label: { type: 'plain_text', text: '生年月日' },
      element: {
        type: 'datepicker',
        action_id: 'birthday',
        placeholder: { type: 'plain_text', text: '日付を選択' },
      },
    },
    {
      type: 'context',
      elements: [
        {
          type: 'mrkdwn',
          text: '⚠️ 登録したプロフィールは全員が鑑定対象として選べるようになります。本人以外を登録する場合は了解を取ってからどうぞ!',
        },
      ],
    },
  ],
});
