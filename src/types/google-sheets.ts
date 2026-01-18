// Google Sheets API の型定義（googleapis の代わり）

// Spreadsheets.get のパラメータ
export type SpreadsheetsGetParams = {
  spreadsheetId?: string;
  fields?: string;
};

// Spreadsheets のスキーマ
export type Spreadsheet = {
  spreadsheetId?: string;
  properties?: SpreadsheetProperties;
  sheets?: Sheet[];
};

export type SpreadsheetProperties = {
  title?: string;
};

export type Sheet = {
  properties?: SheetProperties;
};

export type SheetProperties = {
  sheetId?: number;
  title?: string;
  index?: number;
};

// Spreadsheets.batchUpdate のパラメータ
export type SpreadsheetsBatchUpdateParams = {
  spreadsheetId?: string;
  requestBody?: BatchUpdateSpreadsheetRequest;
};

export type BatchUpdateSpreadsheetRequest = {
  requests?: Request[];
};

export type Request = {
  duplicateSheet?: DuplicateSheetRequest;
  updateCells?: UpdateCellsRequest;
  copyPaste?: CopyPasteRequest;
  repeatCell?: RepeatCellRequest;
};

export type RepeatCellRequest = {
  range?: GridRange;
  cell?: CellData;
  fields?: string;
};

export type DuplicateSheetRequest = {
  sourceSheetId?: number;
  insertSheetIndex?: number;
  newSheetName?: string;
};

export type UpdateCellsRequest = {
  rows?: RowData[];
  fields?: string;
  start?: GridCoordinate;
};

export type RowData = {
  values?: CellData[];
};

export type CellData = {
  userEnteredValue?: ExtendedValue;
  userEnteredFormat?: CellFormat;
};

export type ExtendedValue = {
  stringValue?: string;
  numberValue?: number;
  boolValue?: boolean;
  formulaValue?: string;
};

export type CellFormat = {
  textFormat?: TextFormat;
};

export type TextFormat = {
  bold?: boolean;
};

export type GridCoordinate = {
  sheetId?: number;
  rowIndex?: number;
  columnIndex?: number;
};

export type CopyPasteRequest = {
  source?: GridRange;
  destination?: GridRange;
  pasteType?: string;
};

export type GridRange = {
  sheetId?: number;
  startRowIndex?: number;
  endRowIndex?: number;
  startColumnIndex?: number;
  endColumnIndex?: number;
};

export type BatchUpdateSpreadsheetResponse = {
  spreadsheetId?: string;
  replies?: Response[];
  updatedSpreadsheet?: Spreadsheet;
};

export type Response = {
  duplicateSheet?: DuplicateSheetResponse;
};

export type DuplicateSheetResponse = {
  properties?: SheetProperties;
};

// Values.get のパラメータ
export type ValuesGetParams = {
  spreadsheetId?: string;
  range?: string;
};

export type ValueRange = {
  range?: string;
  majorDimension?: string;
  values?: unknown[][];
};

// Values.append のパラメータ
export type ValuesAppendParams = {
  spreadsheetId?: string;
  range?: string;
  valueInputOption?: string;
  requestBody?: ValueRange;
};

export type AppendValuesResponse = {
  spreadsheetId?: string;
  tableRange?: string;
  updates?: UpdateValuesResponse;
};

// Values.update のパラメータ
export type ValuesUpdateParams = {
  spreadsheetId?: string;
  range?: string;
  valueInputOption?: string;
  requestBody?: ValueRange;
};

export type UpdateValuesResponse = {
  spreadsheetId?: string;
  updatedRange?: string;
  updatedRows?: number;
  updatedColumns?: number;
  updatedCells?: number;
  updatedData?: ValueRange;
};
