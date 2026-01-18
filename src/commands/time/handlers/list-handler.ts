import type { SlackResponse } from '../../../slack/types';
import { getSheets } from '../functions/get-sheets';

type Options = {
  env: Env;
};

export const listHandler = async ({ env }: Options): Promise<SlackResponse> => {
  try {
    const sheetList = await getSheets({ env });
    const projectNames = Object.keys(sheetList);

    if (projectNames.length === 0) {
      return {
        text: 'プロジェクトが存在しません。先に `/time` でプロジェクトを作成してください。',
      };
    }

    let response = '*プロジェクト一覧*\n\n';
    projectNames.forEach((name, index) => {
      response += `${index + 1}. ${name}\n`;
    });

    return { text: response };
  } catch {
    return { text: 'エラーが発生しました' };
  }
};
