import { Schema } from "mongoose";
import { Track } from "./types";

export const trackSchema = new Schema<Track>(
  {
    title: { type: String, required: true, description: "Track title" },
    version: { type: String, description: "Track version" },
    artist: { type: String, description: "Track artist" },
    isrc: { type: String, required: true, description: "Track ISRC" },
    p_line: { type: String, description: "Track P Line" },
    aliases: [{ type: String, description: "Track aliases" }],
    contract_id: {
      type: Schema.Types.ObjectId,
      ref: "Contract",
      description: "Contract association",
    },
  },
  { timestamps: true }
);
