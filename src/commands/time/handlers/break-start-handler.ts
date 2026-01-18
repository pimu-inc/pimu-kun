import type { SlackResponse } from '../../../slack/types';
import { startBreak } from '../functions/start-break';

type Options = {
  projectName: string;
  userId: string;
  userName: string;
  env: Env;
};

export const breakStartHandler = async ({ projectName, userId, userName, env }: Options): Promise<SlackResponse> => {
  if (!projectName) {
    return { text: 'プロジェクトを選択してください。' };
  }

  try {
    const result = await startBreak({
      env,
      userId,
      projectName,
    });

    if (!result.success) {
      return { text: result.message };
    }

    return {
      text: `${userName}が休憩を開始しました。\n休憩開始時間: ${result.data.breakStartTime}`,
    };
  } catch {
    return { text: 'エラーが発生しました' };
  }
};
