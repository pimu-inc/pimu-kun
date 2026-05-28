import type { StateValues } from '../../../slack/types';

export const getSelect = (values: StateValues, blockId: string, actionId: string): string | null => {
  const action = values[blockId]?.[actionId];
  if (!action || action.type !== 'static_select') return null;
  return action.selected_option?.value ?? null;
};

export const getText = (values: StateValues, blockId: string, actionId: string): string | null => {
  const action = values[blockId]?.[actionId];
  if (!action || action.type !== 'plain_text_input') return null;
  return action.value ?? null;
};

export const getTime = (values: StateValues, blockId: string, actionId: string): string | null => {
  const action = values[blockId]?.[actionId];
  if (!action || action.type !== 'timepicker') return null;
  return action.selected_time ?? null;
};

export const getDate = (values: StateValues, blockId: string, actionId: string): string | null => {
  const action = values[blockId]?.[actionId];
  if (!action || action.type !== 'datepicker') return null;
  return action.selected_date ?? null;
};

export const getConversation = (values: StateValues, blockId: string, actionId: string): string | null => {
  const action = values[blockId]?.[actionId];
  if (!action || action.type !== 'conversations_select') return null;
  return action.selected_conversation ?? null;
};

export const getUsers = (values: StateValues, blockId: string, actionId: string): string[] => {
  const action = values[blockId]?.[actionId];
  if (!action || action.type !== 'multi_users_select') return [];
  return action.selected_users ?? [];
};
