export interface ParsedRow {
  id?: string;
  title: string;
  version?: string;
  artist?: string;
  isrc: string;
  aliases?: string;
  lineNumber?: number;
  contract?: string;
}

export interface ErrorRow {
  error: string;
  lineNumber: number;
}
