import type { AppendValuesResponse, ValuesAppendParams } from '../../../types/google-sheets';
import { fetcher } from '../../fetcher';

export const append = async ({ spreadsheetId, range, requestBody, valueInputOption }: ValuesAppendParams) => {
  return fetcher<AppendValuesResponse>(
    `/spreadsheets/${spreadsheetId}/values/${range}:append?valueInputOption=${valueInputOption}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    }
  );
};
