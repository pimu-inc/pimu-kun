import { append } from '../../../clients/spreadsheets/values/append';
import { get } from '../../../clients/spreadsheets/values/get';
import { formatJSTDate } from '../../../functions/format-jst-date';
import { formatJSTTime } from '../../../functions/format-jst-time';
import type { Result } from '../../../types/result';
import { getSheets } from './get-sheets';

type Options = {
  projectName: string;
  userId: string;
  userName: string;
  memo: string;
  env: Env;
};

export const appendStartTime = async ({
  projectName,
  memo,
  userId,
  userName,
  env,
}: Options): Promise<Result<{ startTime: string }>> => {
  const sheetList = await getSheets({ env });

  if (!Object.keys(sheetList).includes(projectName)) {
    return {
      success: false,
      message: `プロジェクト ${projectName}が見つかりません。`,
    };
  }

  const now = new Date();
  const dateFormatted = formatJSTDate(now);
  const startTimeFormatted = formatJSTTime(now);

  // 同じユーザーIDで既に勤務中のレコードがあるか確認
  // 新構造: B列=ユーザーID(0), C列=ユーザー名(1), D列=日付(2), E列=開始時刻(3), F列=終了時刻(4), G列=休憩時間(5), H列=稼働時間(6), I列=ステータス(7), J列=作業内容(8)
  const res = await get({
    spreadsheetId: env.TIMER_SPREADSHEET_ID,
    range: `${projectName}!B8:J`,
  });

  const rows = res.values || [];
  for (let i = 0; i < rows.length; i++) {
    // ユーザーID(インデックス0)が一致し、終了時刻(インデックス4)が空の場合
    if (rows?.[i]?.[0] === userId && rows?.[i]?.[4] === '') {
      return {
        success: false,
        message: 'すでに勤務開始しています。先に勤務を終了してください。',
      };
    }
  }

  // 新しい行を追加
  // B列=ユーザーID, C列=ユーザー名, D列=日付, E列=開始時刻, F列=終了時刻(空), G列=休憩時間(空), H列=稼働時間(空), I列=ステータス(空), J列=作業内容
  await append({
    spreadsheetId: env.TIMER_SPREADSHEET_ID,
    range: `${projectName}!B8:J`,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [[userId, userName, dateFormatted, startTimeFormatted, '', '', '', '', memo]],
    },
  });

  return {
    success: true,
    data: {
      startTime: startTimeFormatted,
    },
  };
};
