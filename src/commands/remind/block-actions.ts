import type { Context } from 'hono';
import { updateModal } from '../../slack/api';
import type { BlockActionsPayload } from '../../slack/types';
import { deleteReminder } from './functions/delete-reminder';
import { listReminders } from './functions/list-reminders';
import { ACTION_DELETE, ACTION_MODE, type Mode, buildRemindModal } from './modal';

// home モーダル内の操作（モード切替・削除ボタン）を views.update で反映する
export const handleReminderBlockActions = async (
  c: Context<{ Bindings: Env }>,
  payload: BlockActionsPayload
): Promise<Response> => {
  const env = c.env;
  const action = payload.actions[0];
  const viewId = payload.view.id;

  if (!action) return c.body(null, 200);

  if (action.action_id === ACTION_MODE) {
    const mode = (action.selected_option?.value ?? '') as Mode;
    const reminders = mode === 'list' ? await listReminders(env) : [];
    await updateModal(env.SLACK_BOT_TOKEN, viewId, buildRemindModal(mode, reminders));
    return c.body(null, 200);
  }

  if (action.action_id === ACTION_DELETE) {
    if (action.value) await deleteReminder(env, action.value);
    const reminders = await listReminders(env);
    await updateModal(env.SLACK_BOT_TOKEN, viewId, buildRemindModal('list', reminders));
    return c.body(null, 200);
  }

  return c.body(null, 200);
};
