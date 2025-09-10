import { model } from "mongoose";

import { contractSchema } from "./contract.schema";
import { Contract } from "./types";

export const ContractModel = model<Contract>("Contract", contractSchema);
