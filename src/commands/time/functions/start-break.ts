import { get } from '../../../clients/spreadsheets/values/get';
import { update } from '../../../clients/spreadsheets/values/update';
import { formatJSTTime } from '../../../functions/format-jst-time';
import type { Result } from '../../../types/result';
import { getSheets } from './get-sheets';

type Options = {
  env: Env;
  userId: string;
  projectName: string;
};

export const startBreak = async ({
  userId,
  env,
  projectName,
}: Options): Promise<Result<{ breakStartTime: string }>> => {
  const sheetList = await getSheets({ env });

  if (!Object.keys(sheetList).includes(projectName)) {
    return {
      success: false,
      message: `プロジェクト ${projectName}が見つかりません。`,
    };
  }

  const breakStartTimeFormatted = formatJSTTime(new Date());

  // 新構造: B列=ユーザーID(0), C列=ユーザー名(1), D列=日付(2), E列=開始時刻(3), F列=終了時刻(4), G列=休憩開始時刻(5), H列=休憩終了時刻(6), I列=休憩時間(7), J列=稼働時間(8), K列=ステータス(9), L列=作業内容(10)
  const res = await get({
    spreadsheetId: env.TIMER_SPREADSHEET_ID,
    range: `${projectName}!B8:L`,
  });

  const rows = res.values || [];

  for (let i = 0; i < rows.length; i++) {
    // ユーザーID(インデックス0)が一致し、開始時刻(インデックス3)があり、終了時刻(インデックス4)が空の場合
    if (rows?.[i]?.[0] === userId && rows?.[i]?.[3] && !rows?.[i]?.[4]) {
      const breakStartTime = rows?.[i]?.[5] || '';
      const breakEndTime = rows?.[i]?.[6] || '';

      // 既に休憩中でないかチェック（休憩開始時刻があり、休憩終了時刻が空の場合）
      if (breakStartTime && !breakEndTime) {
        return {
          success: false,
          message: '既に休憩中です。',
        };
      }

      // 休憩開始時刻をG列に hh:mm 形式で書き込み（8行目からなので行番号は i + 8）
      await update({
        spreadsheetId: env.TIMER_SPREADSHEET_ID,
        valueInputOption: 'USER_ENTERED',
        range: `${projectName}!G${i + 8}`,
        requestBody: {
          values: [[breakStartTimeFormatted]],
        },
      });

      return {
        success: true,
        data: {
          breakStartTime: breakStartTimeFormatted,
        },
      };
    }
  }

  return {
    success: false,
    message: `プロジェクト "${projectName}" で勤務中のレコードが見つかりません。先に勤務を開始してください。`,
  };
};
