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

export const updateEndTIme = async ({
  userId,
  env,
  projectName,
}: Options): Promise<
  Result<{
    projectName: string;
    startTime: string;
    endTime: string;
  }>
> => {
  const sheetList = await getSheets({ env });

  if (!Object.keys(sheetList).includes(projectName)) {
    return {
      success: false,
      message: `プロジェクト ${projectName}が見つかりません。`,
    };
  }

  const endTimeFormatted = formatJSTTime(new Date());

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

      // 休憩中の場合はエラー（休憩開始時刻があり、休憩終了時刻が空の場合）
      if (breakStartTime && !breakEndTime) {
        return {
          success: false,
          message: '休憩中です。先に休憩を終了してください。',
        };
      }

      // 終了時刻をF列に書き込み（8行目からなので行番号は i + 8）
      await update({
        spreadsheetId: env.TIMER_SPREADSHEET_ID,
        valueInputOption: 'USER_ENTERED',
        range: `${projectName}!F${i + 8}`,
        requestBody: {
          values: [[endTimeFormatted]],
        },
      });

      return {
        success: true,
        data: {
          projectName,
          startTime: String(rows?.[i]?.[3] ?? ''),
          endTime: endTimeFormatted,
        },
      };
    }
  }

  return {
    success: false,
    message: `プロジェクト "${projectName}" で勤務中のレコードが見つかりません。`,
  };
};
