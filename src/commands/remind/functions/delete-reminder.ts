export const deleteReminder = async (env: Env, id: string): Promise<void> => {
  await env.DB.prepare('DELETE FROM reminders WHERE id = ?').bind(id).run();
};
