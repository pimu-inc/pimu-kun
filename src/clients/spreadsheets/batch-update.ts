import type { BatchUpdateSpreadsheetResponse, SpreadsheetsBatchUpdateParams } from '../../types/google-sheets';
import { fetcher } from '../fetcher';

export const batchUpdate = async ({ spreadsheetId, requestBody }: SpreadsheetsBatchUpdateParams) => {
  return fetcher<BatchUpdateSpreadsheetResponse>(`/spreadsheets/${spreadsheetId}:batchUpdate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });
};
