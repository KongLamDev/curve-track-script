import { ErrorRow, ParsedRow } from "./types";
import { ContractModel, Track } from "../../models";

// Split aliases on ";" and trim off unnecessary whitespaces
const parseAliases = (aliases?: string): string[] => {
  if (!aliases) return [];
  return aliases
    .split(";")
    .map((a) => a.trim())
    .filter((a) => a.length > 0);
};

export const invalidContractName = (contractName: string) =>
  `Document doesn't exist for contract name ${contractName}`;

export const invalidRequiredFields =
  "Missing one or more of the required fields: Title, ISRC";

// Validate a row
export const validateRow = async (
  track: ParsedRow
): Promise<{ data?: Track; error?: ErrorRow }> => {
  if (!track.title || !track.artist) {
    return {
      error: {
        error: invalidRequiredFields,
        lineNumber: track.lineNumber || 0,
      },
    };
  }
  const { contract: contractName, lineNumber, ...resultTrack } = track;
  const result = resultTrack as Track;
  if (contractName) {
    const contractDocument = await ContractModel.findOne({
      name: contractName,
    });
    if (!contractDocument) {
      return {
        error: {
          error: invalidContractName(contractName),
          lineNumber: lineNumber || 0,
        },
      };
    }
    result.contract_id = contractDocument._id;
  }

  result.aliases = parseAliases(track.aliases);

  return { data: result };
};
