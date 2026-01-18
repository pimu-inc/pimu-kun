import type { SlackResponse } from '../../../slack/types';
import { createSheet } from '../functions/create-sheet';

type Options = {
  projectName: string;
  env: Env;
};

export const createProjectHandler = async ({ projectName, env }: Options): Promise<SlackResponse> => {
  if (!projectName) {
    return { text: '新規プロジェクト名を入力してください。' };
  }

  try {
    await createSheet({ env, projectName });
    return { text: `プロジェクト "${projectName}" を作成しました。` };
  } catch {
    return { text: 'エラーが発生しました' };
  }
};
