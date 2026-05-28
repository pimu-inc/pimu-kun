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

export type TimepickerElement = {
  type: 'timepicker';
  action_id: string;
  initial_time?: string; // 'HH:mm'
  placeholder?: PlainTextElement;
};

export type DatepickerElement = {
  type: 'datepicker';
  action_id: string;
  initial_date?: string; // 'YYYY-MM-DD'
  placeholder?: PlainTextElement;
};

export type ConversationsSelectElement = {
  type: 'conversations_select';
  action_id: string;
  default_to_current_conversation?: boolean;
  initial_conversation?: string;
  placeholder?: PlainTextElement;
};

export type MultiUsersSelectElement = {
  type: 'multi_users_select';
  action_id: string;
  placeholder?: PlainTextElement;
};

export type ButtonElement = {
  type: 'button';
  action_id: string;
  text: PlainTextElement;
  value?: string;
  style?: 'primary' | 'danger';
};

export type InputElement =
  | StaticSelectElement
  | PlainTextInputElement
  | TimepickerElement
  | DatepickerElement
  | ConversationsSelectElement
  | MultiUsersSelectElement;

export type InputBlock = {
  type: 'input';
  block_id: string;
  label: PlainTextElement;
  element: InputElement;
  optional?: boolean;
  dispatch_action?: boolean;
};

export type ActionsBlock = {
  type: 'actions';
  block_id: string;
  elements: Array<StaticSelectElement | ButtonElement>;
};

export type HeaderBlock = {
  type: 'header';
  text: PlainTextElement;
};

export type SectionBlock = {
  type: 'section';
  text: TextElement;
  accessory?: ButtonElement;
};

export type ContextBlock = {
  type: 'context';
  elements: TextElement[];
};

export type DividerBlock = {
  type: 'divider';
};

export type Block = InputBlock | ActionsBlock | HeaderBlock | SectionBlock | ContextBlock | DividerBlock;

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
      values: StateValues;
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

export type TimeValue = {
  type: 'timepicker';
  selected_time: string | null;
};

export type DateValue = {
  type: 'datepicker';
  selected_date: string | null;
};

export type ConversationValue = {
  type: 'conversations_select';
  selected_conversation: string | null;
};

export type UsersValue = {
  type: 'multi_users_select';
  selected_users: string[];
};

export type StateValue = SelectValue | TextValue | TimeValue | DateValue | ConversationValue | UsersValue;

export type StateValues = Record<string, Record<string, StateValue>>;

// block_actions payload（Modal内の操作で発火）
export type BlockAction = {
  type: string;
  action_id: string;
  block_id: string;
  value?: string;
  selected_option?: { text: PlainTextElement; value: string } | null;
  selected_time?: string | null;
  selected_date?: string | null;
  selected_conversation?: string | null;
};

export type BlockActionsPayload = {
  type: 'block_actions';
  trigger_id: string;
  user: { id: string; username: string; name: string };
  view: {
    id: string;
    callback_id: string;
    private_metadata: string;
    state: {
      values: StateValues;
    };
  };
  actions: BlockAction[];
};

export type InteractionPayload = ViewSubmissionPayload | BlockActionsPayload;

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
