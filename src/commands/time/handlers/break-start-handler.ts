import type { CommandContext } from 'discord-hono';
import { startBreak } from '../functions/start-break';

type Option = {
  context: CommandContext;
};

export const breakStartHandler = async ({ context }: Option) => {
  const projectName = context.var.project_name;

  if (!projectName) {
    return context.res('project_nameは必須です。');
  }

  try {
    const result = await startBreak({
      env: context.env,
      userId: context.interaction.member?.user?.id ?? '',
      projectName,
    });

    if (!result.success) {
      return context.res(result.message);
    }

    return context.res(
      `${context.interaction.member?.user?.global_name}が休憩を開始しました。\n休憩開始時間: ${result.data.breakStartTime}`
    );
  } catch {
    return context.res('エラーが発生しました');
  }
};
