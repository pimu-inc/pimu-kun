import type { UpdateValuesResponse, ValuesUpdateParams } from '../../../types/google-sheets';
import { fetcher } from '../../fetcher';

export const update = async ({ spreadsheetId, range, requestBody, valueInputOption }: ValuesUpdateParams) => {
  return fetcher<UpdateValuesResponse>(
    `/spreadsheets/${spreadsheetId}/values/${range}?valueInputOption=${valueInputOption}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    }
  );
};
