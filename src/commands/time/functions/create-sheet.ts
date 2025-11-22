import { batchUpdate } from '../../../clients/spreadsheets/batch-update';
import { update } from '../../../clients/spreadsheets/values/update';
import { TEMPLATE_SHEET_ID } from '../constants';

type Options = {
  projectName: string;
  env: Env;
};

export const createSheet = async ({ projectName, env }: Options) => {
  // templateシートをコピーして新しいシートを作成
  const res = await batchUpdate({
    spreadsheetId: env.TIMER_SPREADSHEET_ID,
    requestBody: {
      requests: [
        {
          duplicateSheet: {
            sourceSheetId: TEMPLATE_SHEET_ID,
            newSheetName: projectName,
            insertSheetIndex: 999, // 末尾に追加
          },
        },
      ],
    },
  });

  const sheetId = res.replies?.[0]?.duplicateSheet?.properties?.sheetId;

  // B2にプロジェクト名を太字で書き込む
  if (sheetId) {
    await update({
      spreadsheetId: env.TIMER_SPREADSHEET_ID,
      range: `${projectName}!B2`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[projectName]],
      },
    });

    // B2を太字にする
    await batchUpdate({
      spreadsheetId: env.TIMER_SPREADSHEET_ID,
      requestBody: {
        requests: [
          {
            repeatCell: {
              range: {
                sheetId: sheetId,
                startRowIndex: 1,
                endRowIndex: 2,
                startColumnIndex: 1,
                endColumnIndex: 2,
              },
              cell: {
                userEnteredFormat: {
                  textFormat: {
                    bold: true,
                  },
                },
              },
              fields: 'userEnteredFormat.textFormat.bold',
            },
          },
        ],
      },
    });
  }

  return { sheetId };
};
