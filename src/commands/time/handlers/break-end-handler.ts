import type { CommandContext } from 'discord-hono';
import { endBreak } from '../functions/end-break';

type Option = {
  context: CommandContext;
};

export const breakEndHandler = async ({ context }: Option) => {
  const projectName = context.var.project_name;

  if (!projectName) {
    return context.res('project_nameは必須です。');
  }

  try {
    const result = await endBreak({
      env: context.env,
      userId: context.interaction.member?.user?.id ?? '',
      projectName,
    });

    if (!result.success) {
      return context.res(result.message);
    }

    return context.res(
      `${context.interaction.member?.user?.global_name}が休憩を終了しました。\n休憩時間: ${result.data.breakDuration}`
    );
  } catch {
    return context.res('エラーが発生しました');
  }
};
