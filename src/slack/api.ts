import type { ModalView, SlackResponse } from './types';

const SLACK_API_BASE = 'https://slack.com/api';

type ViewsOpenResponse = {
  ok: boolean;
  error?: string;
};

export const openModal = async (token: string, triggerId: string, view: ModalView): Promise<ViewsOpenResponse> => {
  const response = await fetch(`${SLACK_API_BASE}/views.open`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      trigger_id: triggerId,
      view,
    }),
  });

  return (await response.json()) as ViewsOpenResponse;
};

export const updateModal = async (token: string, viewId: string, view: ModalView): Promise<ViewsOpenResponse> => {
  const response = await fetch(`${SLACK_API_BASE}/views.update`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      view_id: viewId,
      view,
    }),
  });

  return (await response.json()) as ViewsOpenResponse;
};

type PostMessageResponse = {
  ok: boolean;
  error?: string;
};

export const postMessage = async (
  token: string,
  channel: string,
  message: SlackResponse
): Promise<PostMessageResponse> => {
  const response = await fetch(`${SLACK_API_BASE}/chat.postMessage`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      channel,
      ...message,
    }),
  });

  return (await response.json()) as PostMessageResponse;
};

export const respondToUrl = async (responseUrl: string, message: SlackResponse): Promise<void> => {
  await fetch(responseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
};
