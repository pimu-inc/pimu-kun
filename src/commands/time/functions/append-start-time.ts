import { batchUpdate } from '../../../clients/spreadsheets/batch-update';
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
  // 新構造: B列=ユーザーID(0), C列=ユーザー名(1), D列=日付(2), E列=開始時刻(3), F列=終了時刻(4), G列=休憩開始時刻(5), H列=休憩終了時刻(6), I列=休憩時間(7), J列=稼働時間(8), K列=ステータス(9), L列=作業内容(10)
  const res = await get({
    spreadsheetId: env.TIMER_SPREADSHEET_ID,
    range: `${projectName}!B8:L`,
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

  const sheetId = sheetList[projectName];

  // 新しい行を追加
  // B列=ユーザーID, C列=ユーザー名, D列=日付, E列=開始時刻, F列=終了時刻(空), G列=休憩開始時刻(空), H列=休憩終了時刻(空), I列=休憩時間(式), J列=稼働時間(式), K列=ステータス(自動打刻), L列=作業内容
  // I列: 休憩時間 = H列(休憩終了) - G列(休憩開始)
  // J列: 稼働時間 = F列(終了) - E列(開始) - I列(休憩時間)
  const appendRes = await append({
    spreadsheetId: env.TIMER_SPREADSHEET_ID,
    range: `${projectName}!B8:L`,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [
        [
          userId,
          userName,
          dateFormatted,
          startTimeFormatted,
          '',
          '',
          '',
          '=IF(AND(INDIRECT("G"&ROW())<>"",INDIRECT("H"&ROW())<>""),INDIRECT("H"&ROW())-INDIRECT("G"&ROW()),"")',
          '=IF(INDIRECT("F"&ROW())<>"",INDIRECT("F"&ROW())-INDIRECT("E"&ROW())-INDIRECT("I"&ROW()),"")',
          '自動打刻',
          memo,
        ],
      ],
    },
  });

  // 追加された行番号を取得してK列にチップスタイルのプルダウンを設定
  // updatedRangeは「シート名!B8:L8」のような形式
  const updatedRange = appendRes.updates?.updatedRange;
  if (updatedRange && sheetId != null) {
    const rowMatch = updatedRange.match(/:L(\d+)$/);
    if (rowMatch?.[1]) {
      const rowNumber = Number.parseInt(rowMatch[1], 10);
      const cellRange = {
        sheetId: sheetId,
        startRowIndex: rowNumber - 1, // 0-indexed
        endRowIndex: rowNumber,
        startColumnIndex: 10, // K列 (0-indexed: A=0, B=1, ... K=10)
        endColumnIndex: 11,
      };

      // C3セルのチップスタイルのプルダウンをK列にコピー
      await batchUpdate({
        spreadsheetId: env.TIMER_SPREADSHEET_ID,
        requestBody: {
          requests: [
            {
              copyPaste: {
                source: {
                  sheetId: sheetId,
                  startRowIndex: 2, // C3 (0-indexed: row 2)
                  endRowIndex: 3,
                  startColumnIndex: 2, // C列 (0-indexed: A=0, B=1, C=2)
                  endColumnIndex: 3,
                },
                destination: cellRange,
                pasteType: 'PASTE_DATA_VALIDATION',
              },
            },
          ],
        },
      });
    }
  }

  return {
    success: true,
    data: {
      startTime: startTimeFormatted,
    },
  };
};
