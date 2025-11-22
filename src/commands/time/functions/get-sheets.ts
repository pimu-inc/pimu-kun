import { get } from '../../../clients/spreadsheets/get';
import { EXCLUDED_SHEET_NAMES } from '../constants';

type Options = {
  env: Env;
};

export const getSheets = async ({ env }: Options) => {
  const res = await get({
    spreadsheetId: env.TIMER_SPREADSHEET_ID,
    fields: 'sheets.properties',
  });

  const sheetsData: { [key: string]: number | null | undefined } = {};

  if (res.sheets) {
    for (const sheet of res.sheets) {
      const title = sheet.properties?.title;
      if (title && !EXCLUDED_SHEET_NAMES.includes(title)) {
        sheetsData[title] = sheet.properties?.sheetId;
      }
    }
  }

  return sheetsData;
};
