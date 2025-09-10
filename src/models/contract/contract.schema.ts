import { Schema } from "mongoose";

import { Contract } from "./types";

export const contractSchema = new Schema<Contract>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      description: "Contract name",
    },
  },
  { timestamps: true }
);
