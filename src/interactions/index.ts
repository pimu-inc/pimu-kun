import type { Context } from 'hono';
import { handleNazoInteraction } from '../commands/nazo/interaction';
import { handleTimeInteraction } from '../commands/time/interaction';
import type { ViewSubmissionPayload } from '../slack/types';

export const handleInteraction = async (
  c: Context<{ Bindings: Env }>,
  payload: ViewSubmissionPayload
): Promise<Response> => {
  if (payload.type !== 'view_submission') {
    return c.text('Unknown interaction type', 400);
  }

  const callbackId = payload.view.callback_id;

  switch (callbackId) {
    case 'time_modal':
      return await handleTimeInteraction(c, payload);
    case 'nazo_modal':
      return await handleNazoInteraction(c, payload);
    default:
      return c.text('Unknown callback_id', 400);
  }
};
