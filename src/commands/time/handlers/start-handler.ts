import type { SlackResponse } from '../../../slack/types';
import { appendStartTime } from '../functions/append-start-time';

type Options = {
  projectName: string;
  memo: string;
  userId: string;
  userName: string;
  env: Env;
};

export const startHandler = async ({ projectName, memo, userId, userName, env }: Options): Promise<SlackResponse> => {
  if (!projectName) {
    return { text: 'プロジェクトを選択してください。' };
  }

  try {
    const result = await appendStartTime({
      projectName,
      memo,
      userId,
      userName,
      env,
    });

    if (!result.success) {
      return { text: result.message };
    }

    return {
      text: `${userName}がプロジェクト "${projectName}" の勤務を開始しました。\n開始時間: ${result.data.startTime}\nメモ：${memo}`,
    };
  } catch {
    return { text: 'エラーが発生しました' };
  }
};
