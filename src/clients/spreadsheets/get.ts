import type { Spreadsheet, SpreadsheetsGetParams } from '../../types/google-sheets';
import { fetcher } from '../fetcher';

export const get = async ({ spreadsheetId, fields }: SpreadsheetsGetParams) => {
  return fetcher<Spreadsheet>(`/spreadsheets/${spreadsheetId}?fields=${fields}`, {
    method: 'GET',
  });
};
