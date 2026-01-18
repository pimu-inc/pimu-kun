import type { SlackResponse } from '../../../slack/types';
import { updateEndTIme } from '../functions/update-end-time';

type Options = {
  projectName: string;
  userId: string;
  userName: string;
  env: Env;
};

export const endHandler = async ({ projectName, userId, userName, env }: Options): Promise<SlackResponse> => {
  if (!projectName) {
    return { text: 'プロジェクトを選択してください。' };
  }

  try {
    const result = await updateEndTIme({
      env,
      userId,
      projectName,
    });

    if (!result.success) {
      return { text: result.message };
    }

    return {
      text: `${userName}がプロジェクト "${result.data.projectName}" の勤務を終了しました。\n開始時間: ${result.data.startTime}\n終了時間: ${result.data.endTime}`,
    };
  } catch {
    return { text: 'エラーが発生しました' };
  }
};
