import { Types } from "mongoose";

export interface Track {
  title: string;
  version?: string;
  artist?: string;
  isrc: string;
  p_line?: string;
  aliases?: string[];
  contract_id?: Types.ObjectId;
}
