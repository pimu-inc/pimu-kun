import { Hono } from 'hono';
import { handleCommand } from './commands';
import { handleInteraction } from './interactions';
import type { SlashCommandPayload, ViewSubmissionPayload } from './slack/types';
import { verifySlackRequest } from './slack/verify';

const app = new Hono<{ Bindings: Env }>();

// スラッシュコマンド受信
app.post('/slack/commands', async (c) => {
  const rawBody = await c.req.text();
  if (!(await verifySlackRequest(c, rawBody))) {
    return c.text('Invalid signature', 401);
  }

  const params = new URLSearchParams(rawBody);
  const payload: SlashCommandPayload = {
    token: params.get('token') ?? '',
    team_id: params.get('team_id') ?? '',
    team_domain: params.get('team_domain') ?? '',
    channel_id: params.get('channel_id') ?? '',
    channel_name: params.get('channel_name') ?? '',
    user_id: params.get('user_id') ?? '',
    user_name: params.get('user_name') ?? '',
    command: params.get('command') ?? '',
    text: params.get('text') ?? '',
    response_url: params.get('response_url') ?? '',
    trigger_id: params.get('trigger_id') ?? '',
  };

  return await handleCommand(c, payload);
});

// インタラクション受信（Modal送信等）
app.post('/slack/interactions', async (c) => {
  const rawBody = await c.req.text();
  if (!(await verifySlackRequest(c, rawBody))) {
    return c.text('Invalid signature', 401);
  }

  const params = new URLSearchParams(rawBody);
  const payloadStr = params.get('payload');
  if (!payloadStr) {
    return c.text('Missing payload', 400);
  }

  const payload = JSON.parse(payloadStr) as ViewSubmissionPayload;
  return await handleInteraction(c, payload);
});

export default app;
