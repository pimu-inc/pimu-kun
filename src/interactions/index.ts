import type { Context } from 'hono';
import { handleNazoInteraction } from '../commands/nazo/interaction';
import { handleReminderBlockActions } from '../commands/remind/block-actions';
import { handleReminderSubmission } from '../commands/remind/interaction';
import { ACTION_DELETE, ACTION_MODE } from '../commands/remind/modal';
import { handleTimeInteraction } from '../commands/time/interaction';
import type { InteractionPayload } from '../slack/types';

export const handleInteraction = async (
  c: Context<{ Bindings: Env }>,
  payload: InteractionPayload
): Promise<Response> => {
  if (payload.type === 'block_actions') {
    const actionId = payload.actions[0]?.action_id;
    if (actionId === ACTION_MODE || actionId === ACTION_DELETE) {
      return await handleReminderBlockActions(c, payload);
    }
    return c.body(null, 200);
  }

  if (payload.type !== 'view_submission') {
    return c.text('Unknown interaction type', 400);
  }

  const callbackId = payload.view.callback_id;

  switch (callbackId) {
    case 'time_modal':
      return await handleTimeInteraction(c, payload);
    case 'nazo_modal':
      return await handleNazoInteraction(c, payload);
    case 'reminder_create':
      return await handleReminderSubmission(c, payload);
    default:
      return c.text('Unknown callback_id', 400);
  }
};
