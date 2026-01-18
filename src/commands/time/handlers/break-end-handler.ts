import type { SlackResponse } from '../../../slack/types';
import { endBreak } from '../functions/end-break';

type Options = {
  projectName: string;
  userId: string;
  userName: string;
  env: Env;
};

export const breakEndHandler = async ({ projectName, userId, userName, env }: Options): Promise<SlackResponse> => {
  if (!projectName) {
    return { text: 'プロジェクトを選択してください。' };
  }

  try {
    const result = await endBreak({
      env,
      userId,
      projectName,
    });

    if (!result.success) {
      return { text: result.message };
    }

    return {
      text: `${userName}が休憩を終了しました。\n休憩終了時刻: ${result.data.breakEndTime}`,
    };
  } catch {
    return { text: 'エラーが発生しました' };
  }
};
