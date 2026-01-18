import type { ValueRange, ValuesGetParams } from '../../../types/google-sheets';
import { fetcher } from '../../fetcher';

export const get = async ({ spreadsheetId, range }: ValuesGetParams) => {
  return fetcher<ValueRange>(`/spreadsheets/${spreadsheetId}/values/${range}`, {
    method: 'GET',
  });
};
