import type { CommandContext } from 'discord-hono';
import { updateEndTIme } from '../functions/update-end-time';

type Option = {
  context: CommandContext;
};

export const endHandler = async ({ context }: Option) => {
  const projectName = context.var.project_name;

  if (!projectName) {
    return context.res('project_nameは必須です。');
  }

  try {
    const result = await updateEndTIme({
      env: context.env,
      userId: context.interaction.member?.user?.id ?? '',
      projectName,
    });

    if (!result.success) {
      return context.res(result.message);
    }

    return context.res(
      `${context.interaction.member?.user?.global_name}がプロジェクト "${result.data.projectName}" の勤務を終了しました。\n開始時間: ${result.data.startTime}\n終了時間: ${result.data.endTime}`
    );
  } catch {
    return context.res('エラーが発生しました');
  }
};
