// Slack Slash Command のリクエストボディ
export type SlashCommandPayload = {
  token: string;
  team_id: string;
  team_domain: string;
  channel_id: string;
  channel_name: string;
  user_id: string;
  user_name: string;
  command: string;
  text: string;
  response_url: string;
  trigger_id: string;
};

// Slack Block Kit の型定義
export type PlainTextElement = {
  type: 'plain_text';
  text: string;
  emoji?: boolean;
};

export type MrkdwnElement = {
  type: 'mrkdwn';
  text: string;
};

export type TextElement = PlainTextElement | MrkdwnElement;

export type Option = {
  text: PlainTextElement;
  value: string;
};

export type StaticSelectElement = {
  type: 'static_select';
  action_id: string;
  options: Option[];
  placeholder?: PlainTextElement;
  initial_option?: Option;
};

export type PlainTextInputElement = {
  type: 'plain_text_input';
  action_id: string;
  multiline?: boolean;
  placeholder?: PlainTextElement;
  initial_value?: string;
};

export type InputBlock = {
  type: 'input';
  block_id: string;
  label: PlainTextElement;
  element: StaticSelectElement | PlainTextInputElement;
  optional?: boolean;
};

export type HeaderBlock = {
  type: 'header';
  text: PlainTextElement;
};

export type SectionBlock = {
  type: 'section';
  text: TextElement;
};

export type DividerBlock = {
  type: 'divider';
};

export type Block = InputBlock | HeaderBlock | SectionBlock | DividerBlock;

export type ModalView = {
  type: 'modal';
  callback_id: string;
  title: PlainTextElement;
  submit?: PlainTextElement;
  close?: PlainTextElement;
  blocks: Block[];
  private_metadata?: string;
};

// view_submission payload
export type ViewSubmissionPayload = {
  type: 'view_submission';
  team: { id: string; domain: string };
  user: { id: string; username: string; name: string };
  view: {
    id: string;
    callback_id: string;
    private_metadata: string;
    state: {
      values: Record<string, Record<string, SelectValue | TextValue>>;
    };
  };
  response_urls: Array<{
    block_id: string;
    action_id: string;
    channel_id: string;
    response_url: string;
  }>;
};

export type SelectValue = {
  type: 'static_select';
  selected_option: { text: PlainTextElement; value: string } | null;
};

export type TextValue = {
  type: 'plain_text_input';
  value: string | null;
};

// Slack レスポンス
export type SlackResponse = {
  response_type?: 'in_channel' | 'ephemeral';
  text?: string;
  blocks?: Block[];
};

// view_submission のレスポンス（Modal を閉じる or エラー表示）
export type ViewSubmissionResponse =
  | { response_action: 'clear' }
  | { response_action: 'errors'; errors: Record<string, string> }
  | { response_action: 'update'; view: ModalView };
