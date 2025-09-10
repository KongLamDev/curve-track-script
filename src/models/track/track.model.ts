import { model } from "mongoose";
import { trackSchema } from "./track.schema";
import { Track } from "./types";

export const TrackModel = model<Track>("Track", trackSchema);
