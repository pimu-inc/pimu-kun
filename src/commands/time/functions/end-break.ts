import { get } from '../../../clients/spreadsheets/values/get';
import { update } from '../../../clients/spreadsheets/values/update';
import { formatDurationHourMin } from '../../../functions/format-duration';
import { getJstDate } from '../../../functions/get-jst-date';
import type { Result } from '../../../types/result';
import { getSheets } from './get-sheets';

type Options = {
  env: Env;
  userId: string;
  projectName: string;
};

export const endBreak = async ({ userId, env, projectName }: Options): Promise<Result<{ breakDuration: string }>> => {
  const sheetList = await getSheets({ env });

  if (!Object.keys(sheetList).includes(projectName)) {
    return {
      success: false,
      message: `プロジェクト ${projectName}が見つかりません。`,
    };
  }

  const breakEndTimeJst = getJstDate();

  // 新構造: B列=ユーザーID(0), C列=ユーザー名(1), D列=日付(2), E列=開始時刻(3), F列=終了時刻(4), G列=休憩時間(5)
  const res = await get({
    spreadsheetId: env.TIMER_SPREADSHEET_ID,
    range: `${projectName}!B8:J`,
  });

  const rows = res.values || [];

  for (let i = 0; i < rows.length; i++) {
    // ユーザーID(インデックス0)が一致し、開始時刻(インデックス3)があり、終了時刻(インデックス4)が空の場合
    if (rows?.[i]?.[0] === userId && rows?.[i]?.[3] && !rows?.[i]?.[4]) {
      const breakData = rows?.[i]?.[5] || '';

      if (!breakData.includes('休憩中')) {
        return {
          success: false,
          message: '休憩中ではありません。',
        };
      }

      // 休憩開始時刻を取得: 休憩中: hh:mm
      const breakStartMatch = breakData.match(/休憩中: (\d{2}:\d{2})/);
      if (!breakStartMatch) {
        return {
          success: false,
          message: '休憩開始時間が見つかりません。',
        };
      }

      const breakStartTimeString = breakStartMatch[1];
      const dateString = rows?.[i]?.[2] || ''; // D列の日付（yyyy/mm/dd形式）

      // 日付と時刻を組み合わせてDateオブジェクトを作成
      const [hours, minutes] = breakStartTimeString.split(':').map(Number);
      const [year, month, day] = dateString.split('/').map(Number);

      // JSTの時刻としてDateを作成（UTCとして作成し、JSTオフセットを考慮）
      const breakStartTimeJst = new Date(Date.UTC(year, month - 1, day, hours - 9, minutes, 0));

      // JST時刻同士で差分をミリ秒で計算
      const breakDurationMs = breakEndTimeJst.getTime() - breakStartTimeJst.getTime();
      const breakDurationMinutes = breakDurationMs / (1000 * 60);

      // hh:mm形式で表示
      const breakDurationFormatted = formatDurationHourMin(breakDurationMinutes);

      // G列に休憩時間を書き込み（8行目からなので行番号は i + 8）
      await update({
        spreadsheetId: env.TIMER_SPREADSHEET_ID,
        valueInputOption: 'USER_ENTERED',
        range: `${projectName}!G${i + 8}`,
        requestBody: {
          values: [[breakDurationFormatted]],
        },
      });

      return {
        success: true,
        data: {
          breakDuration: breakDurationFormatted,
        },
      };
    }
  }

  return {
    success: false,
    message: `プロジェクト "${projectName}" で休憩中のレコードが見つかりません。`,
  };
};
